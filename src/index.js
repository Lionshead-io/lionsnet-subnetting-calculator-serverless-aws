/**
 * Lionsnet (https://github.com/Lionshead-io/lionsnet-subnetting-calculator-serverless-aws)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import Result from 'folktale/result';
import Maybe from 'folktale/maybe';
import Validation from 'folktale/validation';

import VPC from './classes/VPC';

let a = new VPC({ DefaultWorkspace: '100.64.0.0/10' });

debugger;

a.next({ totalHosts: 515, subnetCount: 1, hostsPerSubnet: 64 }).then(res => console.log(res, 'newVpc.then'));

exports.configure = (event, context, callback) => {
  const body = JSON.parse( event.body || '{}' );


};

exports.createVpc = (event, context, callback) => {

};
