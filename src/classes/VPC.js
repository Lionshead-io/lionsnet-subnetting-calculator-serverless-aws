// @flow
/**
 * VPC.js - Exports VPC Class
 *
 * get/set  DefaultWorkspace()
 * get      DefaultWorkspaceBinary()
 *
 * static getCidrNotation() - Takes (totalHosts: number, networkAddress: Address4) and returns CIDR Notation Address (ex. 100.64.0.0/10)
 * async next() -
 *
 * This source code is licensed under the CC BY-SA 4.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import Result from 'folktale/result';
import Maybe from 'folktale/maybe';
import { of, rejected, fromPromised } from 'folktale/concurrency/task';
import R from 'ramda';
import { mixin as _mixin, isUndefined as _isUndefined, isNumber as _isNumber, toNumber as _toNumber, isNull as _isNull, isInteger as _isInteger } from 'lodash';
import ip from 'ip';
import binaryIp from 'binary-ip';
import numberconvert from 'number-convert';
import binaryString from 'math-uint32-to-binary-string';
import { getNetblockRecordT } from '../services/getNetblockRecord';
import { saveNetblockRecordT } from '../services/saveNetblockRecord';
import { HOSTS_TO_PREFIX, PREFIX_TO_HOSTS } from '../helpers/cidrEnum';
import addBinary from '../helpers/addBinary';
import totalHostsTransformer from '../helpers/totalHosts.transformer';
import hostsPerSubnetTransformer from '../helpers/hostsPerSubnet.transformer';
import checkForReleasedBlocks from '../helpers/checkForReleasedBlocks';
import parseNetblockRecord from '../helpers/parseNetblockRecord';
import IncrementedOrReleasedBlock from '../unions/incrementedOrReleasedBlock';

const Address4 = require('ip-address').Address4;

_mixin(Array.prototype, {
  last: function flatten() {
    return R.last(this);
  },
});

export default class VPC {
  _DefaultWorkspace: string;
  _DefaultWorkspaceBinary: string;

  // $FlowDisableLine
  constructor({ DefaultWorkspace = '' } = {}) {
    this._DefaultWorkspace = DefaultWorkspace;
    this._DefaultWorkspaceBinary = binaryIp(DefaultWorkspace.split('/')[0]).split('.').join('');
  }

  get DefaultWorkspace(): string {
    return this._DefaultWorkspace;
  }

  get DefaultWorkspaceBinary(): string {
    return this._DefaultWorkspaceBinary;
  }

  set DefaultWorkspace(DefaultWorkspace: string) {
    this._DefaultWorkspace = DefaultWorkspace;
    this._DefaultWorkspaceBinary = binaryIp(DefaultWorkspace.split('/')[0]).split('.').join('');
  }

  /**
   * getCidrNotation() - Static method that returns a CIDR address. It is worth noting that if the total
   *
   * @param totalHosts
   * @param networkAddress
   * @returns {string}
   */
  static getCidrNotation(totalHosts: number, networkAddress: Address4): string {
    // $FlowDisableLine
    const cidrPrefix = R.compose(_toNumber, R.last)(Object.keys(HOSTS_TO_PREFIX).filter(currVal => (currVal <= totalHosts)));

    return `${networkAddress.address}${HOSTS_TO_PREFIX[cidrPrefix]}`;
  }

  /**
   * next() - Async function that returns a new VPC with associated subnets.
   *
   * @param vpcId string - VPC unique identifier
   * @param totalHosts int - Total number of host addresses to be allocated to the VPC
   * @param subnetCount int - # of subnets to be provisioned within VPC
   * @param hostsPerSubnet int - # of host addresses for each subnet that is to be provisioned within the VPC
   * @returns Promise<Address4> Returns a Promise that resolves to a IPv4 address object with a 'subnets: Array<Address4>' property
   */
  // $FlowDisableLine
  async next ({ vpcId, totalHosts = 256, subnetCount = 4, hostsPerSubnet = 64 } = {}) {
    // Make sure that totalHosts, subnetCount, & hostsPerSubnet are all valid integers, if not return a rejected Promise.
    if ( !_isInteger(totalHosts)|| !_isInteger(subnetCount) || !_isInteger(hostsPerSubnet) || ((subnetCount * hostsPerSubnet) > totalHosts) ) return Promise.reject('totalHosts, subnetCount, & hostsPerSubnet must all be valid integers, and subnetCount times hostsPerSubnet must be less than or equal to totalHosts');

    let typeOfNetblocks;

    // safeTotalHosts & safeHostsPerSubnet will contain 'SAFE' values that correspond to a CIDR prefix.
    // In the case where a user passes the value of 'totalHosts=257' the value will be rounded down to '256' which
    // corresponds to a CIDR prefix of '/24'.
    const safeTotalHosts = totalHostsTransformer(totalHosts);
    const safeHostsPerSubnet = hostsPerSubnetTransformer(hostsPerSubnet, totalHosts);

    const getCidrNotationCurried = R.curry(VPC.getCidrNotation)(safeTotalHosts);
    const generateSubnetsCurried = R.curry(VPC.generateSubnets)(subnetCount)(safeHostsPerSubnet);
    let addVpcMetadata = R.curry(function (netblockCount, lastNetblockUsed, vpc) {
      const firstNetblock = _isNull(lastNetblockUsed);

      return Object.assign({}, vpc, {
        vpcId,
        netblockCount,
        ...(firstNetblock ? { startNetblock: 0 } : { startNetblock: lastNetblockUsed + 1 }),
        ...(firstNetblock ? { endNetblock: (((safeTotalHosts / 256)) - 1) } : { endNetblock: ((lastNetblockUsed + 1) + (safeTotalHosts / 256)) - 1 }),
        usedBlocks: vpc.length / 256,
        ...vpc,
      });
    })(safeTotalHosts / 256);

    // After we've retrieved the LAST_NETBLOCK record which contains the 'lastNetblockUsed' we want to add 1 to it & multiply
    // the by 256. The result refers to the number of host addresses that have already been consumed.
    let [lastNetblockUsed, hostAddressesUsed] = await (getNetblockRecordT()
                                .map(res => res || {})
                                // .map(res => orCombinator(thunkify(checkForReleasedBlocks, totalHosts, res), thunkify(parseNetblockRecord, res)))
                                // Check for released netblocks that match the number of netblocks needed to fulfill the request
                                .chain(res =>
                                  checkForReleasedBlocks(res, (safeTotalHosts / 256)).matchWith({
                                    Incremented: ({ value }) => {
                                      typeOfNetblocks = IncrementedOrReleasedBlock.Incremented();
                                      return of(value);
                                    },
                                    Released: ({ value }) => {
                                      typeOfNetblocks = IncrementedOrReleasedBlock.Released();
                                      const nextReleasedBlocksArr = res.releasedBlocks.filter(currVal => currVal.startNetblock !== value.lastNetblockUsed);
                                      const nextNetblockRecord = {
                                        ...res,
                                        ...((nextReleasedBlocksArr.length) ? { releasedBlocks: nextReleasedBlocksArr } : { releasedBlocks: [] })
                                      };
                                      (!nextNetblockRecord.releasedBlocks.length) && delete nextNetblockRecord.releasedBlocks;

                                      // Q: Why are we subtracting one from lastNetblockUsed?
                                      // A: We are doing this because parseNetblockRecord(netblockRecord) will add 1 to lastNetblockUsed
                                      //    to get the next available netblock record. We are adding one so we don't overwrite previously
                                      //    used netblock records. We are subtracting here because we are using 'RELEASED' netblocks and since
                                      //    the lastNetblockUsed value that we currently have within the scope of this function is in fact the
                                      //    first/start netblock record that will be used to provision this VPC. We simply want to reuse the 'START' Netblock that was
                                      //    previously released for reuse.
                                      // Message from Author: I apologize for this type of deception. I currently don't have time to go back and refactor.
                                      //                      However, a issue has been created and its progress can be tracked at (https://trello.com/c/mbvie4Ub/)
                                      return saveNetblockRecordT(nextNetblockRecord).map(_ => ({ lastNetblockUsed: value.lastNetblockUsed - 1 }));
                                    },
                                    Nil: () => {
                                      typeOfNetblocks = IncrementedOrReleasedBlock.Incremented();

                                      return of(res);
                                    }
                                  })
                                )
                                .map(res => parseNetblockRecord(res))
                                .map(res => R.tap(x => { addVpcMetadata = addVpcMetadata(x[0]) }, res))
                                .run()
                                .promise());

    // First, We are converting 'hostAddressesUsed' which is an unsigned Integer into it's literal bit representation
    // Secondly, we are performing a bitwise addition of 'hostAddressesUsed' & the bit representation of the DefaultWorkspace IP address.
    const totalHostsBinary = binaryString(hostAddressesUsed);
    const nextNetworkAddress = addBinary(totalHostsBinary, this.DefaultWorkspaceBinary);

    const buildVpc = R.compose(addVpcMetadata, ip.cidrSubnet, getCidrNotationCurried, Address4.fromHex, numberconvert.binToHex);
    const buildSubnets = R.compose(generateSubnetsCurried);

    // buildSubnets returns a Result data structure
    return R.compose(buildSubnets, buildVpc)(nextNetworkAddress).matchWith({
      Ok: ({ value }) => {
        return (IncrementedOrReleasedBlock.Incremented.hasInstance(typeOfNetblocks)) ? IncrementedOrReleasedBlock.Incremented(value) : IncrementedOrReleasedBlock.Released(value);
      },
      Error: ({ value }) => {
        return IncrementedOrReleasedBlock.Nil(value);
      }
    });
  }

  /**
   * static generateSubnets() - This member will take the number of subnets the user wants provisioned and will append
   *                            the newly generated subnets to the 'subnets' property of the VPC. This method returns a
   *                            Result data structure of type Just that wraps a VPC object. If there is an error at any point
   *                            throughout the process of generating new subnets, this method will return an Error.
   *
   *
   * @param subnetCount int - Number of subnets to provision
   * @param hostsPerSubnet int - Number of host addresses to be allocated to each subnet being provisioned
   * @param vpc {Address4} - The Address4 VPC object that contains a property 'subnets' of type Array along with all other relevant VPC metadata
   * @returns {Nothing, Just}
   */
  static generateSubnets(subnetCount, hostsPerSubnet, vpc) {
    const safeHostsPerSubnet = hostsPerSubnetTransformer(hostsPerSubnet, vpc.length);

    /**
     * totalBlocks() - Returns the number of Subnet Netblocks available by dividing the total number of host addresses
     *                 allocated to the VPC by 16. The reason we are dividing by 16 is that Subnet Netblocks are in increments of 16.
     *
     * @param vpc {Address4} - Address4 VPC object
     * @returns {*}
     */
    const totalBlocks = function (vpc) {
      return Maybe.Just({ totalBlocks: vpc.length / 16 });
    };

    /**
     * usedBlocks() - This function will iterate over 'vpc.subnets' and collected an accumulated sum of the number of
     *                netblocks used for each VPC that has been created within the VPC
     *
     * @param vpc {Address4} - Address4 VPC object
     * @returns Maybe.Just({ usedBlocks })
     */
    const usedBlocks = function (vpc) {
      if (_isUndefined(vpc.subnets)) return Maybe.Just({ usedBlocks: 0 });

      return Maybe.Just({
        usedBlocks: vpc.subnets
                      .map(currVal => currVal.usedBlocks)
                      .reduce((acc, currVal) => {
                        acc += currVal;

                        return acc;
                      }, 0)
      });
    };

    /**
     * remainingBlocks() - Returns the number of remaining netblocks that can be used to provision additional subnet(s)
     *
     * @param totalBlocks int - Vpc.length (# of host address allocated to the VPC) divided by 16 (16 - because
     * @param usedBlocks int - Number of blocks previously used to provision subnets
     * @returns Maybe.Just({ remainingBlocks })
     */
    const remainingBlocks = function ({ totalBlocks, usedBlocks }) {
      if (totalBlocks - usedBlocks <= 0) {
        return Maybe.Nothing('There are no more host addresses available in this VPC, thus you cannot create any more subnets');
      } else {
        return Maybe.Just({ remainingBlocks: totalBlocks - usedBlocks });
      }
    };

    /**
     * neededBlocks() - Returns the number of netblocks needed to provision the number of subnets specified
     *
     * @param totalBlocks
     * @param usedBlocks
     * @param remainingBlocks
     * @param subnetCount
     * @param safeHostsPerSubnet
     * @returns {Just, Nothing}
     */
    const neededBlocks = function ({ totalBlocks, usedBlocks, remainingBlocks }, subnetCount, safeHostsPerSubnet) {
      const result = ((safeHostsPerSubnet * subnetCount) / 16);

      if (result <= remainingBlocks) {
        return Maybe.Just({ neededBlocks: result });
      } else {
        return Maybe.Nothing(`Subnets: ${subnetCount} & Hosts per Subnet: ${safeHostsPerSubnet} -> ${result} Netblocks are needed an only ${remainingBlocks} are left.`);
      }
    };

    // First off, we are creating an accumulated object that contains
    //      a) totalBlocks - Total # of Netblocks needed to provision the specified number of subnets with their corresponding
    //                       number host address. This is calculated (numberOfSubnet * hostAddressesPerSubnet) / 16.
    //                       REMEMBER: Subnets have a minimum size of 16 host addresses (CIDR prefix of /28).
    //      b) usedBlocks - Total # of used Netblocks by all subnets that have been provisioned within that VPC.
    //                      We iterate over each subnet in the VPC.
    return Result.fromMaybe(
      Maybe.Just()
        .chain(_ => totalBlocks(vpc))
        .chain(tb => usedBlocks(vpc).map(ub => Object.assign(tb, ub)))
        .chain(tub => remainingBlocks(tub).map(rb => Object.assign(tub, rb)))
        .chain(blockAcc => neededBlocks(blockAcc, subnetCount, safeHostsPerSubnet).map(nb => Object.assign(blockAcc, nb)))
    )
      .chain(blockInfo => {
        const getCidrNotation = R.curry(VPC.getCidrNotation)(hostsPerSubnet);

        function buildSubnets (pendingSubnets, nextBlock, hostsPerSubnet, vpc) {
          if (pendingSubnets <= 0) return vpc;

          const nextBlockBinary = binaryString((nextBlock) * 16);
          const nextSubnetAddress = addBinary(nextBlockBinary, binaryIp(vpc.networkAddress).split('.').join(''));

          const addSubnetMetadata = (subnet) => {
            subnet.startBlock = nextBlock;
            subnet.endBlock = ((nextBlock + (hostsPerSubnet / 16)) - 1);
            subnet.usedBlocks = hostsPerSubnet / 16;
            delete subnet.contains;

            return subnet;
          };

          const newSubnet = R.compose(addSubnetMetadata, ip.cidrSubnet, getCidrNotation, Address4.fromHex, numberconvert.binToHex)(nextSubnetAddress);

          if(vpc.subnets) {
            vpc.subnets = vpc.subnets.concat([newSubnet]);
          } else {
            vpc.subnets = [newSubnet]
          }

          return buildSubnets((pendingSubnets - 1), ((nextBlock + (hostsPerSubnet / 16))), hostsPerSubnet, vpc);
        }

        return Result.Ok(buildSubnets(subnetCount, blockInfo.usedBlocks, hostsPerSubnet, vpc));
      })
      .orElse(err => new Error('Subnets were not generated. Please try again.'));
  }
}
