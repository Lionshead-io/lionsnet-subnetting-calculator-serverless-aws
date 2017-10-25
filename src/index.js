/**
 * Lionsnet (https://github.com/Lionshead-io/lionsnet-subnetting-calculator-serverless-aws)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import Result from 'folktale/result';
import Maybe from 'folktale/maybe';
import Validation from 'folktale/validation';
import { fromPromised } from 'folktale/concurrency/task';
import { isEmpty as _isEmpty } from 'lodash';
import { task, of, rejected } from 'folktale/concurrency/task';
import { getNetblockRecordT } from './services/getNetblockRecord';
import { saveNetblockRecordT, updateNetblockRecordT } from './services/saveNetblockRecord';
import { saveVpcT } from './services/saveVpc';
import defaultWorkspaceValidator from './validators/defaultWorkspace';
import vpcIdValidator from './validators/vpcId';
import createResponse from './helpers/createResponse';
import VPC from './classes/VPC';

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
    .map(res => res.Item || {})
    .chain(res => (_isEmpty(res)) ? rejected('Error! Lionsnet must be configured before you can start provisioning VPCs.') : of(res))
    .chain(lastNetblock => vpcIdValidator(body.vpcId).matchWith({
      Success: () => {
        const _VPC = new VPC({ DefaultWorkspace: lastNetblock.DefaultWorkspace.S });

        return fromPromised(_VPC.next.bind(_VPC))(Object.assign({}, body, { DefaultWorkspace: lastNetblock.DefaultWorkspace.S }));
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

exports.createVpc = (event, context, callback) => {

};

exports.getConfiguration = async (event, context, callback) => {
  let result = await getNetblockRecordT().map(res => res.Item || {}).run().promise();

  callback(null, createResponse(200, result));
};

exports.configure = (event, context, callback) => {
  const body = JSON.parse(event.body || '{}');
  const transformedBody = Object.assign({}, body, { vpcId: 'LAST_NETBLOCK', lastNetblockUsed: 0 });

  // TODO: Add comments for this block of code.
  getNetblockRecordT()
    .map(res => res.Item || {})
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

// exports.configure({body: JSON.stringify({DefaultWorkspace: '100.64.0.0/10'})}, {}, (err, value) => console.log(value, 'cb'));
exports.createVpc({body: JSON.stringify({vpcId: 'w-prod', totalHosts: 512})}, {}, (err, value) => console.log(value, 'cb'));
