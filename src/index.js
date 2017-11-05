/**
 * Lionsnet (https://github.com/Lionshead-io/lionsnet-subnetting-calculator-serverless-aws)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import { of, rejected, fromPromised } from 'folktale/concurrency/task';
import { isEmpty as _isEmpty, isError as _isError, remove as _remove } from 'lodash';
import { getNetblockRecordT } from './services/getNetblockRecord';
import { saveNetblockRecordT, updateNetblockRecordT } from './services/saveNetblockRecord';
import { saveVpcT } from './services/saveVpc';
import { deleteVpcT } from './services/deleteVpc';
import { getVpcT } from './services/getVpc';
import defaultWorkspaceValidator from './validators/defaultWorkspace';
import vpcIdValidator from './validators/vpcId';
import subnetCountValidator from './validators/subnetCount';
import { hostsPerSubnetIsNumber } from './validators/hostsPerSubnet';
import ipAddressValidator from './validators/ipAddress';
import createResponse from './helpers/createResponse';
import VPC from './classes/VPC';

exports.getVpc = (event, context, callback) => {
  const pathParameters = event.pathParameters;
  const vpcId = pathParameters.vpcId;

  vpcIdValidator(vpcId).matchWith({
    Success: () => {
      getVpcT(vpcId)
        .map(res => res || {})
        .chain(res => (_isEmpty(res)) ? rejected('Error! The VPC you are trying to fetch does NOT exist.') : of(res))
        .run()
        .listen({
          onRejected:  (reason) => callback(null, createResponse(400, reason)),
          onResolved:  (value) => callback(null, createResponse(200, value))
        });
    },
    Failure: ({ value }) => callback(null, createResponse(400, value))
  });
};

exports.createVpc = (event, context, callback) => {
  const body = JSON.parse(event.body || '{}');

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // The steps and actions that occur to create & persist a new VPC are provided below. It is a multi-step process
  // that involves a few Folktale data structures (Validation, Task, & Result)
  //
  // 1) Call getNetblockRecordT to retrieve the 'LAST_NETBLOCK' record which contains the 'lastNetblockUsed' value
  // 2) Next, we want to chain a Task which returns a new VPC. Before we can provision a new VPC we want to make sure
  //          the user provided a vpcId. If a valid vpcId has been provided (Success) we will then
  //          cast the promise return VPC.next async function into a Task using the provided 'fromPromise' function
  //          exported by Folktale.
  // 3) Then we chain another Task 'saveVpcT' which will go ahead and persist the newly generated VPC. The thing is, that
  //          a call to VPC.next() will return a promise that resolves to a Folktale 'Result' data structure. That is why
  //          this chained task is matching based on whether the call to VPC.next() resulted in a value 'Ok(value)'
  //          or in an error 'Error(err)' while trying to generate a new VPC.
  // 4) Lastly, we chain the final Task to increment the 'LAST_NETBLOCK' record with the last used Netblock by this newly
  //          generated VPC via the updateNetblockRecord Task (updateNetblockRecordT).
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getNetblockRecordT()
    .map(res => res || {})
    .chain(res => (_isEmpty(res)) ? rejected('Error! Lionsnet must be configured before you can start provisioning VPCs.') : of(res))
    .chain(lastNetblock => vpcIdValidator(body.vpcId).matchWith({
      Success: () => {
        const _VPC = new VPC({ DefaultWorkspace: lastNetblock.DefaultWorkspace });

        return fromPromised(_VPC.next.bind(_VPC))(Object.assign({}, body, { DefaultWorkspace: lastNetblock.DefaultWorkspace }));
      },
      Failure: ({ value }) => rejected(value)
    }))
    .chain(vpc => {
      // At this point VPC is 'Result' data structure
      return vpc.matchWith({
        Ok: ({ value }) => saveVpcT(value),
        Error: ({ value }) => rejected(value)
      });
    })
    .chain(newVpc => updateNetblockRecordT(newVpc.endNetblock).map(_ => newVpc))
    .run()
    .listen({
      onRejected:  (reason) => callback(null, createResponse(400, reason)),
      onResolved:  (value) => callback(null, createResponse(200, value))
    });
};

exports.deleteVpc = (event, context, callback) => {
  const pathParameters = event.pathParameters;
  const vpcId = pathParameters.vpcId;

  vpcIdValidator(vpcId).matchWith({
    Success: () => {
      getVpcT(vpcId)
        .map(res => res || {})
        .chain(res => (_isEmpty(res)) ? rejected('Error! The VPC you are trying to delete does NOT exist.') : of(res))
        .map(vpc => ({ startNetblock: vpc.startNetblock, endNetblock: vpc.endNetblock, usedBlocks: vpc.usedBlocks }))
        .chain(releasedBlocks =>
          deleteVpcT(vpcId)
            .chain(_ => getNetblockRecordT())
            .chain(netblockRecord => {
              const nextNetblockRecord = Object.assign({}, netblockRecord, {
                ...(netblockRecord.releasedBlocks) ? { releasedBlocks: netblockRecord.releasedBlocks.concat([releasedBlocks]) } : { releasedBlocks: [releasedBlocks] }
              });

              return saveNetblockRecordT(nextNetblockRecord);
            })
        )
        .run()
        .listen({
          onRejected:  (reason) => callback(null, createResponse(400, reason)),
          onResolved:  (value) => callback(null, createResponse(200, null))
        });
    },
    Failure: ({ value }) => createResponse(400, value)
  });
};

exports.createSubnet = (event, context, callback) => {
  const body = JSON.parse(event.body || '{}');
  const pathParameters = event.pathParameters;
  const vpcId = pathParameters.vpcId;

  vpcIdValidator(vpcId)
    .concat(subnetCountValidator(body.subnetCount))
    .concat(hostsPerSubnetIsNumber(body.hostsPerSubnet))
    .matchWith({
      Success: () => {
        getVpcT(vpcId)
          .chain(vpc =>
            getNetblockRecordT()
              .map(res => res || {})
              .chain(res => (_isEmpty(res)) ? rejected('Error! Lionsnet must be configured before you can start provisioning VPCs.') : of(res))
              .map(res => ({ DefaultWorkspace: res.DefaultWorkspace }))
              .chain(lastNetblock => {
                const result = VPC.generateSubnets(body.subnetCount, body.hostsPerSubnet, vpc);

                return (_isError(result)) ? rejected(result) : of(result.getOrElse(rejected('Error! The subnets were not provisioned. Please try again.')));
              })
              .chain(newVpc => saveVpcT(newVpc))
          )
          .run()
          .listen({
            onRejected:  (reason) => callback(null, createResponse(400, reason)),
            onResolved:  (value) => callback(null, createResponse(200, value))
          });
      },
      Failure: ({ value }) => callback(null, createResponse(400, value))
    });
};

exports.deleteSubnet = (event, context, callback) => {
  const pathParameters = event.pathParameters;
  const vpcId = pathParameters.vpcId;
  const subnetNetworkAddress = pathParameters.subnetNetworkAddress;

  vpcIdValidator(vpcId)
    .concat(ipAddressValidator(subnetNetworkAddress))
    .matchWith({
      Success: () => {
        console.log(subnetNetworkAddress, 'deleteSubnet -> Success -> networkAddress');
        getVpcT(vpcId)
          .map(res => res || {})
          .chain(res => (_isEmpty(res)) ? rejected('Error! The VPC you are trying to modify does NOT exist.') : of(res))
          .map(vpc => {
            if (vpc.subnets.length) {
              _remove(vpc.subnets, (currVal) => currVal.networkAddress === subnetNetworkAddress)
            }

            return vpc;
          })
          .chain(newVpc => saveVpcT(newVpc))
          .run()
          .listen({
            onRejected:  (reason) => callback(null, createResponse(400, reason)),
            onResolved:  (value) => callback(null, createResponse(200, value))
          });
      },
      Failure: ({ value }) => callback(null, createResponse(400, value))
    });
};

exports.getConfiguration = async (event, context, callback) => {
  let result = await getNetblockRecordT().map(res => res || {}).run().promise();

  callback(null, createResponse(200, result));
};

exports.configure = (event, context, callback) => {
  const body = JSON.parse(event.body || '{}');
  const transformedBody = Object.assign({}, body, { vpcId: 'LAST_NETBLOCK', lastNetblockUsed: 0 });

  // TODO: Add comments for this block of code.
  getNetblockRecordT()
    .map(res => res || {})
    .chain(res => (_isEmpty(res)) ? of(res) : rejected('Error! Lionsnet has already been configured and cannot be re-configured'))
    .chain(_ => defaultWorkspaceValidator(body.DefaultWorkspace).matchWith({
      Success: () => saveNetblockRecordT(transformedBody),
      Failure: ({ value }) => rejected(value)
    }))
    .map(_ => transformedBody)
    .run()
    .listen({
      onRejected:  (reason) => callback(null, createResponse(400, reason)),
      onResolved:  (value) => callback(null, createResponse(200, value))
    })
};

exports.main = (event, context, callback) => {
  // REST -> /configuration
  if( event.resource == '/configuration' && event.httpMethod == 'GET' ) {
    exports.getConfiguration(event, context, callback);
  } else if( event.resource == '/configuration' && event.httpMethod == 'POST' ) {
    exports.configure(event, context, callback);
  }

  // REST -> /vpc
  if( event.resource == '/vpc' && event.httpMethod == 'POST' ) {
    exports.createVpc(event, context, callback);
  }

  // REST -> /vpc/{vpcId}
  if( event.resource == '/vpc/{vpcId}' && event.httpMethod == 'GET' ) {
    exports.getVpc(event, context, callback);
  } else if ( event.resource == '/vpc/{vpcId}' && event.httpMethod == 'DELETE' ) {
    exports.deleteVpc(event, context, callback);
  }

  // REST -> /vpc/{vpcId}/subnet
  if( event.resource == '/vpc/{vpcId}/subnet' && event.httpMethod == 'POST' ) {
    exports.createSubnet(event, context, callback);
  }

  // REST -> /vpc/{vpcId}/subnet/{subnetNetworkAddress}
  if( event.resource == '/vpc/{vpcId}/subnet/{subnetNetworkAddress}' && event.httpMethod == 'DELETE' ) {
    exports.deleteSubnet(event, context, callback);
  }
};
