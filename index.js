'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _JSON$stringify = _interopDefault(require('babel-runtime/core-js/json/stringify'));
var _regeneratorRuntime = _interopDefault(require('babel-runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('babel-runtime/helpers/asyncToGenerator'));
var _extends = _interopDefault(require('babel-runtime/helpers/extends'));
var _Object$assign = _interopDefault(require('babel-runtime/core-js/object/assign'));
var folktale_concurrency_task = require('folktale/concurrency/task');
var lodash = require('lodash');
var AWS = _interopDefault(require('aws-sdk'));
var DocumentClient = _interopDefault(require('dynamodb-promise'));
var Result = _interopDefault(require('folktale/result'));
var Maybe = _interopDefault(require('folktale/maybe'));
var Validation = _interopDefault(require('folktale/validation'));
var _Promise = _interopDefault(require('babel-runtime/core-js/promise'));
var ip = _interopDefault(require('ip'));
var _Object$keys = _interopDefault(require('babel-runtime/core-js/object/keys'));
var _slicedToArray = _interopDefault(require('babel-runtime/helpers/slicedToArray'));
var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('babel-runtime/helpers/createClass'));
var R = require('ramda');
var R__default = _interopDefault(R);
var binaryIp = _interopDefault(require('binary-ip'));
var numberconvert = _interopDefault(require('number-convert'));
var binaryString = _interopDefault(require('math-uint32-to-binary-string'));

//      
/**
 * getNetblockRecord.js - Exports getNetblockRecord()
 *
 * getNetblockRecord() -
 *
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
var docClient = DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

var dynamodb = new AWS.DynamoDB({
  region: process.env.AWS_REGION || 'us-east-1'
});

var TableName = 'lionsnet-vpc';

var getNetblockRecord = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
    var params, result;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            params = {
              Key: {
                vpcId: 'LAST_NETBLOCK'
              },
              TableName: TableName
            };
            _context.next = 3;
            return docClient.getAsync(params);

          case 3:
            result = _context.sent;
            return _context.abrupt('return', result.Item);

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getNetblockRecord() {
    return _ref.apply(this, arguments);
  };
}();

var getNetblockRecordT = folktale_concurrency_task.fromPromised(getNetblockRecord);

var updateNetblockRecord = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(endNetblock) {
    var params;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            params = {
              Key: {
                vpcId: 'LAST_NETBLOCK'
              },
              TableName: TableName$1,
              ExpressionAttributeNames: { '#n': 'lastNetblockUsed' },
              ExpressionAttributeValues: { ':i': endNetblock },
              ReturnValues: 'UPDATED_NEW',
              UpdateExpression: 'SET #n = :i'
            };
            _context.next = 3;
            return docClient$1.updateAsync(params);

          case 3:
            return _context.abrupt('return', _context.sent);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function updateNetblockRecord(_x) {
    return _ref.apply(this, arguments);
  };
}();

var saveNetblockRecord = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(record) {
    var nextRecord, params, result;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            nextRecord = _Object$assign({}, record, { vpcId: 'LAST_NETBLOCK' });
            params = {
              TableName: TableName$1,
              Item: nextRecord
            };
            _context2.next = 4;
            return docClient$1.putAsync(params);

          case 4:
            result = _context2.sent;
            return _context2.abrupt('return', result);

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function saveNetblockRecord(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

//      
/**
 * updateNetblockRecord.js - Exports updateNetblockRecord()
 *
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
var docClient$1 = DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

var dynamodb$1 = new AWS.DynamoDB({
  region: process.env.AWS_REGION || 'us-east-1'
});

var TableName$1 = 'lionsnet-vpc';

var saveNetblockRecordT = folktale_concurrency_task.fromPromised(saveNetblockRecord);
var updateNetblockRecordT = folktale_concurrency_task.fromPromised(updateNetblockRecord);

// TODO: Check if vpcId exists before saving...
var saveVpc = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(vpc) {
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return docClient$2.putAsync({
              TableName: TableName$2,
              Item: vpc
            });

          case 2:
            return _context.abrupt('return', vpc);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function saveVpc(_x) {
    return _ref.apply(this, arguments);
  };
}();

//      
/**
 * saveVpc.js - Exports saveVpc()
 *
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
var docClient$2 = DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

var dynamodb$2 = new AWS.DynamoDB({
  region: process.env.AWS_REGION || 'us-east-1'
});

var TableName$2 = 'lionsnet-vpc';

var saveVpcT = folktale_concurrency_task.fromPromised(saveVpc);

//      
/**
 * deleteVpc.js - Exports deleteVpc()
 *
 * deleteVpc() - Deletes the specified VPC.
 *               TODO: will eventually take the Netblocks that were used by the VPC and append them to the running list
 *                     of released Netblocks that are stored on a property of the 'LAST_NETBLOCK' record
 *
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
var docClient$3 = DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

var dynamodb$3 = new AWS.DynamoDB({
  region: process.env.AWS_REGION || 'us-east-1'
});

var TableName$3 = 'lionsnet-vpc';

function deleteVpc(vpcId) {
  var params = {
    Key: {
      "vpcId": {
        S: vpcId
      }
    },
    TableName: TableName$3
  };

  return new _Promise(function (resolve, reject) {
    dynamodb$3.deleteItem(params, function (err, data) {
      if (err) reject(err);else resolve(data);
    });
  });
}

var deleteVpcT = folktale_concurrency_task.fromPromised(deleteVpc);

var getVpc = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(vpcId) {
    var result;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return docClient$4.getAsync({
              TableName: TableName$4,
              Key: {
                vpcId: vpcId
              }
            });

          case 2:
            result = _context.sent;
            return _context.abrupt('return', result.Item);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getVpc(_x) {
    return _ref.apply(this, arguments);
  };
}();

//      
/**
 * getVpc.js - Exports getVpc()
 *
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
var docClient$4 = DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

var dynamodb$4 = new AWS.DynamoDB({
  region: process.env.AWS_REGION || 'us-east-1'
});

var TableName$4 = 'lionsnet-vpc';

var getVpcT = folktale_concurrency_task.fromPromised(getVpc);

var Address4 = require('ip-address').Address4;

/**
 * defaultWorkspaceValidator() - Returns a Success type if a valid global default workspace CIDR address was provided.
 *                               Else, it returns a Failure type.
 *
 *
 * @param workspace string - An IPv4 address string (ex. '100.64.0.0./10')
 * @returns {Validation}
 */
function defaultWorkspaceValidator(workspace) {
  return new Address4(workspace).isValid() ? Validation.Success() : Validation.Failure([workspace + ' is not a valid CIDR Address.']);
}

/**
 * vpcIdValidator() - Returns a Success type if a valid vpcId of type String was provided.
 *                       Else, it returns a Failure type.
 *
 *
 * @param vpcId string - A string to uniquely identify a VPC
 * @returns {Validation}
 */
function vpcIdValidator(vpcId) {
  return vpcId && lodash.isString(vpcId) ? Validation.Success() : Validation.Failure(['\'vpcId\' is required and must be a String.']);
}

/**
 * defaultWorkspaceValidator() - Returns a Success type if a valid global default workspace CIDR address was provided.
 *                               Else, it returns a Failure type.
 *
 *
 * @param subnetCount int - # of subnets that are to be provisioned
 * @returns {Validation}
 */
function subnetCountValidator(subnetCount) {
  return lodash.isNumber(subnetCount) && subnetCount > 0 ? Validation.Success() : Validation.Failure(['Subnet count must be a valid number greater than 0.']);
}

var HOSTS_TO_PREFIX = {
  1: '/32',
  2: '/31',
  4: '/30',
  8: '/29',
  16: '/28',
  32: '/27',
  64: '/26',
  128: '/25',
  256: '/24',
  512: '/23',
  1024: '/22',
  2048: '/21',
  4096: '/20',
  8192: '/19',
  16384: '/18',
  32768: '/17',
  65536: '/16',
  131072: '/15',
  262144: '/14',
  524288: '/13',
  1048576: '/12',
  2097152: '/11',
  4194036: '/10'
};

var PREFIX_TO_HOSTS = {
  '/32': 1,
  '/31': 2,
  '/30': 4,
  '/29': 8,
  '/28': 16,
  '/27': 32,
  '/26': 64,
  '/25': 128,
  '/24': 256,
  '/23': 512,
  '/22': 1024,
  '/21': 2048,
  '/20': 4096,
  '/19': 8192,
  '/18': 16384,
  '/17': 32768,
  '/16': 65536,
  '/15': 131072,
  '/14': 262144,
  '/13': 524288,
  '/12': 1048576,
  '/11': 2097152,
  '/10': 4194036
};

/**
 * hostsPerSubnetValidator() - Returns a Success type if a valid value for 'hostsPerSubnet' is provided.
 *                               Else, it returns a Failure type.
 *
 *
 * @param hostsPerSubnet - # of host address per subnet that is to be provisioned
 * @returns {Validation}
 */
function hostsPerSubnetIsNumber(hostsPerSubnet) {
  return lodash.isNumber(hostsPerSubnet) ? Validation.Success() : Validation.Failure(['\'hostsPerSubnet\' must be an integer.']);
}

/**
 * ipAddressValidator() - Returns a Success type if a valid global default workspace CIDR address was provided.
 *                               Else, it returns a Failure type.
 *
 *
 * @param subnetCount int - # of subnets that are to be provisioned
 * @returns {Validation}
 */
function ipAddressValidator(address) {
  return ip.isV4Format(address) ? Validation.Success() : Validation.Failure(['IP Address provided is not valid or is not in V4 format.']);
}

//      
/**
 * createResponse() - Returns an object with the statusCode and body that is to be returned back to the client.
 *
 * @param statusCode int HTTP status code
 * @param body {}
 * @returns {{statusCode: number, body: any}}
 */
var createResponse = function createResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    body: body
  };
};

/**
 * addBinary() - Bitwise addition.
 *               This function was pulled from https://www.codewars.com/kata/binary-addition/solutions/javascript
 *               Also, stackoverflow had quite a few code snippets that perform bitwise additions.
 *
 * @param a
 * @param b
 * @returns {string|string}
 */
function addBinary(a, b) {
  var res = '';
  var c = 0;

  a = a.split('');
  b = b.split('');
  while (a.length || b.length || c) {
    c += ~~a.pop() + ~~b.pop();
    res = c % 2 + res;
    c = c > 1;
  }

  return res.replace(/^0+/, '') || '0';
}

//      
/**
 * totalHostsTransformer() - Accepts the number of total host addresses the user has supplied for the VPC they are trying
 *                           to provision and will return a safe totalHosts value. What this means is that if a user doesn't
 *                           supply a valid totalHosts integer that corresponds to a valid CIDR prefix, it will round down the
 *                           totalHosts value to the next available valid CIDR prefix.
 *
 * @param totalHosts int
 * @returns int
 */
function totalHostsTransformer(totalHosts) {
  if (totalHosts < 256) return 256;else if (totalHosts > PREFIX_TO_HOSTS['/16']) return PREFIX_TO_HOSTS['/16'];else if (totalHosts % 256 > 0) {
    return R.compose(lodash.toNumber, R.last)(_Object$keys(HOSTS_TO_PREFIX).filter(function (currVal) {
      return currVal <= totalHosts;
    }));
  }

  return totalHosts;
}

//      
/**
 * hostsPerSubnetTransformer() - Accepts the number of hostsPerSubnet & totoal hostsPerVpc the user has supplied for the VPC they are trying
 *                           to provision and will return a safe hostsPerSubnet value. What this means is that if a user doesn't
 *                           supply a valid hostsPerSubnet integer that corresponds to a valid CIDR prefix, it will round down the
 *                           hostsPerSubnet value to the next available valid CIDR prefix. Note that the minimum number of
 *                           host addresses per subnet is 16. Also, the hostsPerSubnet value provided should not exceed the
 *                           number of total hosts that have been allocated to the VPC in which this subnets reside in.
 *
 *
 * @param hostsPerSubnet int
 * @param hostsPerVpc int
 * @returns {number}
 */
function hostsPerSubnetTransformer(hostsPerSubnet, hostsPerVpc) {
  if (hostsPerSubnet < 16) return 16;else if (hostsPerSubnet > hostsPerVpc) return hostsPerVpc;else if (hostsPerSubnet % 16 > 0) {
    return R.compose(lodash.toNumber, R.last)(_Object$keys(HOSTS_TO_PREFIX).filter(function (currVal) {
      return currVal <= hostsPerSubnet;
    }));
  }

  return Math.floor(hostsPerSubnet / 16) * 16;
}

//      
/**
 * VPC.js - Exports VPC Class
 *
 * get/set  DefaultWorkspace()
 * get      DefaultWorkspaceBinary()
 *
 * static getCidrNotation() - Takes (totalHosts: number, networkAddress: Address4) and returns CIDR Notation Address (ex. 100.64.0.0/10)
 * async next() -
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
var Address4$1 = require('ip-address').Address4;

lodash.mixin(Array.prototype, {
  last: function flatten() {
    return R__default.last(this);
  }
});

var VPC = function () {

  // $FlowDisableLine
  function VPC() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$DefaultWorkspace = _ref.DefaultWorkspace,
        DefaultWorkspace = _ref$DefaultWorkspace === undefined ? '' : _ref$DefaultWorkspace;

    _classCallCheck(this, VPC);

    this._DefaultWorkspace = DefaultWorkspace;
    this._DefaultWorkspaceBinary = binaryIp(DefaultWorkspace.split('/')[0]).split('.').join('');
  }

  _createClass(VPC, [{
    key: 'next',


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
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            vpcId = _ref3.vpcId,
            _ref3$totalHosts = _ref3.totalHosts,
            totalHosts = _ref3$totalHosts === undefined ? 256 : _ref3$totalHosts,
            _ref3$subnetCount = _ref3.subnetCount,
            subnetCount = _ref3$subnetCount === undefined ? 4 : _ref3$subnetCount,
            _ref3$hostsPerSubnet = _ref3.hostsPerSubnet,
            hostsPerSubnet = _ref3$hostsPerSubnet === undefined ? 64 : _ref3$hostsPerSubnet;

        var safeTotalHosts, safeHostsPerSubnet, getCidrNotationCurried, generateSubnetsCurried, addVpcMetadata, _ref4, _ref5, lastNetblockUsed, hostAddressesUsed, totalHostsBinary, nextNetworkAddress, buildVpc, buildSubnets;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                //
                // safeTotalHosts & safeHostsPerSubnet will contain 'SAFE' values that correspond to a CIDR prefix.
                // In the case where a user passes the value of 'totalHosts=257' the value will be rounded down to '256' which
                // corresponds to a CIDR prefix of '/24'.
                //
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                safeTotalHosts = totalHostsTransformer(totalHosts);
                safeHostsPerSubnet = hostsPerSubnetTransformer(hostsPerSubnet, totalHosts);
                getCidrNotationCurried = R__default.curry(VPC.getCidrNotation)(safeTotalHosts);
                generateSubnetsCurried = R__default.curry(VPC.generateSubnets)(subnetCount)(safeHostsPerSubnet);
                addVpcMetadata = R__default.curry(function (netblockCount, lastNetblockUsed, vpc) {
                  var firstNetblock = lodash.isNull(lastNetblockUsed);

                  return _Object$assign({}, vpc, _extends({
                    vpcId: vpcId,
                    netblockCount: netblockCount
                  }, firstNetblock ? { startNetblock: 0 } : { startNetblock: lastNetblockUsed + 1 }, firstNetblock ? { endNetblock: safeTotalHosts / 256 - 1 } : { endNetblock: lastNetblockUsed + 1 + safeTotalHosts / 256 - 1 }, {
                    usedBlocks: vpc.length / 256
                  }, vpc));
                })(safeTotalHosts / 256);

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                //
                // After we've retrieved the LAST_NETBLOCK record which contains the 'lastNetblockUsed' we want to add 1 to it & multiply
                // the by 256. The result refers to the number of host addresses that have already been consumed.
                //
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                _context.next = 7;
                return getNetblockRecordT().map(function (res) {
                  return res || {};
                }).map(function (res) {
                  return [res.lastNetblockUsed && lodash.isNumber(lodash.toNumber(res.lastNetblockUsed)) ? lodash.toNumber(res.lastNetblockUsed) : null, res.lastNetblockUsed ? (lodash.toNumber(res.lastNetblockUsed) + 1) * 256 : 0];
                }).map(function (res) {
                  return R__default.tap(function (x) {
                    addVpcMetadata = addVpcMetadata(x[0]);
                  }, res);
                }).run().promise();

              case 7:
                _ref4 = _context.sent;
                _ref5 = _slicedToArray(_ref4, 2);
                lastNetblockUsed = _ref5[0];
                hostAddressesUsed = _ref5[1];


                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                //
                // First, We are converting 'hostAddressesUsed' which is an unsigned Integer into it's literal bit representation
                // Secondly, we are performing a bitwise addition of 'hostAddressesUsed' & the bit representation of the DefaultWorkspace IP address.
                //
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                totalHostsBinary = binaryString(hostAddressesUsed);
                nextNetworkAddress = addBinary(totalHostsBinary, this.DefaultWorkspaceBinary);
                buildVpc = R__default.compose(addVpcMetadata, ip.cidrSubnet, getCidrNotationCurried, Address4$1.fromHex, numberconvert.binToHex);
                buildSubnets = R__default.compose(generateSubnetsCurried);
                return _context.abrupt('return', R__default.compose(buildSubnets, buildVpc)(nextNetworkAddress));

              case 16:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function next() {
        return _ref2.apply(this, arguments);
      }

      return next;
    }()

    /**
     * static generateSubnets() - TODO: describe static method here.
     *
     *
     * @param subnetCount int - Number of subnets to provision
     * @param hostsPerSubnet int - Number of host addresses to be allocated to each subnet being provisioned
     * @param vpc {Address4} - The Address4 VPC object that contains a property 'subnets' of type Array along with all other relevant VPC metadata
     * @returns {Nothing, Just}
     */

  }, {
    key: 'DefaultWorkspace',
    get: function get() {
      return this._DefaultWorkspace;
    },
    set: function set(DefaultWorkspace) {
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

  }, {
    key: 'DefaultWorkspaceBinary',
    get: function get() {
      return this._DefaultWorkspaceBinary;
    }
  }], [{
    key: 'getCidrNotation',
    value: function getCidrNotation(totalHosts, networkAddress) {
      // $FlowDisableLine
      var cidrPrefix = R__default.compose(lodash.toNumber, R__default.last)(_Object$keys(HOSTS_TO_PREFIX).filter(function (currVal) {
        return currVal <= totalHosts;
      }));

      return '' + networkAddress.address + HOSTS_TO_PREFIX[cidrPrefix];
    }
  }, {
    key: 'generateSubnets',
    value: function generateSubnets(subnetCount, hostsPerSubnet, vpc) {
      // const safeHostsPerSubnet = (function ({ subnetCount = 4, hostsPerSubnet = 64, totalHosts = 256 } = {}) {
      //   if (hostsPerSubnet <= 0) return Maybe.Nothing();
      //   else if (hostsPerSubnet * subnetCount === totalHosts) return Maybe.Just(hostsPerSubnet);
      //
      //   debugger;
      //
      //   return Maybe.Just(
      //     // $FlowDisableLine
      //     R.compose(_toNumber, R.last)(
      //       Object.keys(HOSTS_TO_PREFIX).filter((currVal) => {
      //         return (subnetCount * currVal <= vpc.length)
      //       })
      //     )
      //   );
      // }({ subnetCount, hostsPerSubnet, totalHosts: vpc.length }));

      var safeHostsPerSubnet = hostsPerSubnetTransformer(hostsPerSubnet, vpc.length);

      debugger;

      /**
       * totalBlocks() - Returns the number of Subnet Netblocks available by dividing the total number of host addresses
       *                 allocated to the VPC by 16. The reason we are dividing by 16 is that Subnet Netblocks are in increments of 16.
       *
       * @param vpc {Address4} - Address4 VPC object
       * @returns {*}
       */
      var totalBlocks = function totalBlocks(vpc) {
        return Maybe.Just({ totalBlocks: vpc.length / 16 });
      };

      /**
       * usedBlocks() - This function will iterate over 'vpc.subnets' and collected an accumulated sum of the number of
       *                netblocks used for each VPC that has been created within the VPC
       *
       * @param vpc {Address4} - Address4 VPC object
       * @returns Maybe.Just({ usedBlocks })
       */
      var usedBlocks = function usedBlocks(vpc) {
        if (lodash.isUndefined(vpc.subnets)) return Maybe.Just({ usedBlocks: 0 });

        return Maybe.Just({
          usedBlocks: vpc.subnets.map(function (currVal) {
            return currVal.usedBlocks;
          }).reduce(function (acc, currVal) {
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
      var remainingBlocks = function remainingBlocks(_ref6) {
        var totalBlocks = _ref6.totalBlocks,
            usedBlocks = _ref6.usedBlocks;

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
      var neededBlocks = function neededBlocks(_ref7, subnetCount, safeHostsPerSubnet) {
        var totalBlocks = _ref7.totalBlocks,
            usedBlocks = _ref7.usedBlocks,
            remainingBlocks = _ref7.remainingBlocks;

        var result = safeHostsPerSubnet * subnetCount / 16;

        if (result <= remainingBlocks) {
          return Maybe.Just({ neededBlocks: result });
        } else {
          return Maybe.Nothing('Subnets: ' + subnetCount + ' & Hosts per Subnet: ' + safeHostsPerSubnet + ' -> ' + result + ' Netblocks are needed an only ' + remainingBlocks + ' are left.');
        }
      };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // First off, we are creating an accumulated object that contains
      //      a) totalBlocks - Total # of Netblocks needed to provision the specified number of subnets with their corresponding
      //                       number host address. This is calculated (numberOfSubnet * hostAddressesPerSubnet) / 16.
      //                       REMEMBER: Subnets have a minimum size of 16 host addresses (CIDR prefix of /28).
      //      b) usedBlocks - Total # of used Netblocks by all subnets that have been provisioned within that VPC.
      //                      We iterate over each subnet in the VPC.
      //
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      return Result.fromMaybe(Maybe.Just().chain(function (_) {
        return totalBlocks(vpc);
      }).chain(function (tb) {
        return usedBlocks(vpc).map(function (ub) {
          return _Object$assign(tb, ub);
        });
      }).chain(function (tub) {
        return remainingBlocks(tub).map(function (rb) {
          return _Object$assign(tub, rb);
        });
      }).chain(function (blockAcc) {
        return neededBlocks(blockAcc, subnetCount, safeHostsPerSubnet).map(function (nb) {
          return _Object$assign(blockAcc, nb);
        });
      })).chain(function (blockInfo) {
        var getCidrNotation = R__default.curry(VPC.getCidrNotation)(hostsPerSubnet);

        function buildSubnets(pendingSubnets, nextBlock, hostsPerSubnet, vpc) {
          if (pendingSubnets <= 0) return vpc;

          var nextBlockBinary = binaryString(nextBlock * 16);
          var nextSubnetAddress = addBinary(nextBlockBinary, binaryIp(vpc.networkAddress).split('.').join(''));

          var addSubnetMetadata = function addSubnetMetadata(subnet) {
            subnet.startBlock = nextBlock;
            subnet.endBlock = nextBlock + hostsPerSubnet / 16 - 1;
            subnet.usedBlocks = hostsPerSubnet / 16;
            delete subnet.contains;

            return subnet;
          };

          var newSubnet = R__default.compose(addSubnetMetadata, ip.cidrSubnet, getCidrNotation, Address4$1.fromHex, numberconvert.binToHex)(nextSubnetAddress);

          if (vpc.subnets) {
            vpc.subnets = vpc.subnets.concat([newSubnet]);
          } else {
            vpc.subnets = [newSubnet];
          }

          return buildSubnets(pendingSubnets - 1, nextBlock + hostsPerSubnet / 16, hostsPerSubnet, vpc);
        }

        return Result.Ok(buildSubnets(subnetCount, blockInfo.usedBlocks, hostsPerSubnet, vpc));
      }).orElse(function (err) {
        return new Error('Subnets were not generated. Please try again.');
      });
    }
  }]);

  return VPC;
}();

var _this = undefined;

/**
 * Lionsnet (https://github.com/Lionshead-io/lionsnet-subnetting-calculator-serverless-aws)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
exports.createVpc = function (event, context, callback) {
  var body = JSON.parse(event.body || '{}');

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
  getNetblockRecordT().map(function (res) {
    return res || {};
  }).chain(function (res) {
    return lodash.isEmpty(res) ? folktale_concurrency_task.rejected('Error! Lionsnet must be configured before you can start provisioning VPCs.') : folktale_concurrency_task.of(res);
  }).chain(function (lastNetblock) {
    return vpcIdValidator(body.vpcId).matchWith({
      Success: function Success() {
        var _VPC = new VPC({ DefaultWorkspace: lastNetblock.DefaultWorkspace });

        return folktale_concurrency_task.fromPromised(_VPC.next.bind(_VPC))(_Object$assign({}, body, { DefaultWorkspace: lastNetblock.DefaultWorkspace }));
      },
      Failure: function Failure(_ref) {
        var value = _ref.value;
        return folktale_concurrency_task.rejected(value);
      }
    });
  }).chain(function (vpc) {
    // At this point VPC is 'Result' data structure
    return vpc.matchWith({
      Ok: function Ok(_ref2) {
        var value = _ref2.value;
        return saveVpcT(value);
      },
      Error: function Error(_ref3) {
        var value = _ref3.value;
        return folktale_concurrency_task.rejected(value);
      }
    });
  }).chain(function (newVpc) {
    return updateNetblockRecordT(newVpc.endNetblock).map(function (_) {
      return newVpc;
    });
  }).run().listen({
    onRejected: function onRejected(reason) {
      return callback(null, createResponse(400, reason));
    },
    onResolved: function onResolved(value) {
      return callback(null, createResponse(200, value));
    }
  });
};

exports.deleteVpc = function (event, context, callback) {
  var body = JSON.parse(event.body || '{}');

  vpcIdValidator(body.vpcId).matchWith({
    Success: function Success() {
      getVpcT(body.vpcId).map(function (res) {
        return res || {};
      }).chain(function (res) {
        return lodash.isEmpty(res) ? folktale_concurrency_task.rejected('Error! The VPC you are trying to delete does NOT exist.') : folktale_concurrency_task.of(res);
      }).map(function (vpc) {
        return { startNetblock: vpc.startNetblock, endNetblock: vpc.endNetblock, usedBlocks: vpc.usedBlocks };
      }).chain(function (releasedBlocks) {
        return deleteVpcT(body.vpcId).chain(function (_) {
          return getNetblockRecordT();
        }).chain(function (netblockRecord) {
          var nextNetblockRecord = _Object$assign({}, netblockRecord, _extends({}, netblockRecord.releasedBlocks ? { releasedBlocks: netblockRecord.releasedBlocks.concat([releasedBlocks]) } : { releasedBlocks: [releasedBlocks] }));

          return saveNetblockRecordT(nextNetblockRecord);
        });
      }).run().listen({
        onRejected: function onRejected(reason) {
          return callback(null, createResponse(400, reason));
        },
        onResolved: function onResolved(value) {
          return callback(null, createResponse(200, null));
        }
      });
    },
    Failure: function Failure(_ref4) {
      var value = _ref4.value;
      return createResponse(400, value);
    }
  });
};

exports.createSubnet = function (event, context, callback) {
  var body = JSON.parse(event.body || '{}');

  vpcIdValidator(body.vpcId).concat(subnetCountValidator(body.subnetCount)).concat(hostsPerSubnetIsNumber(body.hostsPerSubnet)).matchWith({
    Success: function Success() {
      getVpcT(body.vpcId).chain(function (vpc) {
        return getNetblockRecordT().map(function (res) {
          return res || {};
        }).chain(function (res) {
          return lodash.isEmpty(res) ? folktale_concurrency_task.rejected('Error! Lionsnet must be configured before you can start provisioning VPCs.') : folktale_concurrency_task.of(res);
        }).map(function (res) {
          return { DefaultWorkspace: res.DefaultWorkspace };
        }).chain(function (lastNetblock) {
          var result = VPC.generateSubnets(body.subnetCount, body.hostsPerSubnet, vpc);

          return lodash.isError(result) ? folktale_concurrency_task.rejected(result) : folktale_concurrency_task.of(result.getOrElse(folktale_concurrency_task.rejected('Error! The subnets were not provisioned. Please try again.')));
        }).chain(function (newVpc) {
          return saveVpcT(newVpc);
        });
      }).run().listen({
        onRejected: function onRejected(reason) {
          return callback(null, createResponse(400, reason));
        },
        onResolved: function onResolved(value) {
          return callback(null, createResponse(200, value));
        }
      });
    },
    Failure: function Failure(_ref5) {
      var value = _ref5.value;
      return callback(null, createResponse(400, value));
    }
  });
};

exports.deleteSubnet = function (event, context, callback) {
  var pathParameters = JSON.parse(event.pathParameters || '{}');
  var vpcId = pathParameters.vpcId;
  var subnetNetworkAddress = pathParameters.subnetNetworkAddress;

  vpcIdValidator(vpcId).concat(ipAddressValidator(subnetNetworkAddress)).matchWith({
    Success: function Success() {
      console.log(subnetNetworkAddress, 'deleteSubnet -> Success -> networkAddress');
      getVpcT(vpcId).map(function (res) {
        return res || {};
      }).chain(function (res) {
        return lodash.isEmpty(res) ? folktale_concurrency_task.rejected('Error! The VPC you are trying to modify does NOT exist.') : folktale_concurrency_task.of(res);
      }).map(function (vpc) {
        if (vpc.subnets.length) {
          lodash.remove(vpc.subnets, function (currVal) {
            return currVal.networkAddress === subnetNetworkAddress;
          });
        }

        return vpc;
      }).chain(function (newVpc) {
        return saveVpcT(newVpc);
      }).run().listen({
        onRejected: function onRejected(reason) {
          return callback(null, createResponse(400, reason));
        },
        onResolved: function onResolved(value) {
          return callback(null, createResponse(200, value));
        }
      });
    },
    Failure: function Failure(_ref6) {
      var value = _ref6.value;
      return callback(null, createResponse(400, value));
    }
  });
};

exports.getConfiguration = function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(event, context, callback) {
    var result;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getNetblockRecordT().map(function (res) {
              return res || {};
            }).run().promise();

          case 2:
            result = _context.sent;


            callback(null, createResponse(200, result));

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));

  return function (_x, _x2, _x3) {
    return _ref7.apply(this, arguments);
  };
}();

exports.configure = function (event, context, callback) {
  var body = JSON.parse(event.body || '{}');
  var transformedBody = _Object$assign({}, body, { vpcId: 'LAST_NETBLOCK', lastNetblockUsed: 0 });

  // TODO: Add comments for this block of code.
  getNetblockRecordT().map(function (res) {
    return res || {};
  }).chain(function (res) {
    return lodash.isEmpty(res) ? folktale_concurrency_task.of(res) : folktale_concurrency_task.rejected('Error! Lionsnet has already been configured and cannot be re-configured');
  }).chain(function (_) {
    return defaultWorkspaceValidator(body.DefaultWorkspace).matchWith({
      Success: function Success() {
        return saveNetblockRecordT(transformedBody);
      },
      Failure: function Failure(_ref8) {
        var value = _ref8.value;
        return folktale_concurrency_task.rejected(value);
      }
    });
  }).map(function (_) {
    return transformedBody;
  }).run().listen({
    onRejected: function onRejected(reason) {
      return callback(null, createResponse(400, reason));
    },
    onResolved: function onResolved(value) {
      return callback(null, createResponse(200, value));
    }
  });
};

// exports.configure({body: JSON.stringify({DefaultWorkspace: '100.64.0.0/10'})}, {}, (err, value) => console.log(value, 'cb'));
// exports.getConfiguration({}, {}, (err, value) => console.log(value, 'cb'));
// exports.createVpc({body: JSON.stringify({vpcId: 'w-prod', totalHosts: 512})}, {}, (err, value) => console.log(value, 'cb'));
exports.deleteVpc({ body: _JSON$stringify({ vpcId: 'w-prod' }) }, {}, function (err, value) {
  return console.log(value, 'cb');
});
// exports.createSubnet({body: JSON.stringify({vpcId: 'w-prod', subnetCount: 2, hostsPerSubnet: 64})}, {}, (err, value) => console.log(err, value, 'cb'));
// exports.deleteSubnet({pathParameters: JSON.stringify({vpcId: 'w-prod', subnetNetworkAddress: '100.64.1.192'})}, {}, (err, value) => console.log(err, value, 'cb'));
//# sourceMappingURL=index.js.map
