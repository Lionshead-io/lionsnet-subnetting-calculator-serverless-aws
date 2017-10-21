/**
 * addBinary.spec.js
 *
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { expect } from 'chai';
import hostsPerSubnetTransformer from '../../src/helpers/hostsPerSubnet.transformer';

describe('hostsPerSubnetTransformer()', () => {

  it('should return 16 when "hostsPerSubnet" value passed into function is < 16', () => {
    const hostsPerSubnet = 1;
    const hostsPerVpc = 256;

    expect(hostsPerSubnetTransformer(hostsPerSubnet, hostsPerVpc)).to.be.equal(16);
  });

  it('should return the value of "hostsPerVpc" when "hostsPerSubnet" value is greater than "hostsPerVpc"', () => {
    const hostsPerSubnet = 555;
    const hostsPerVpc = 256;

    expect(hostsPerSubnetTransformer(hostsPerSubnet, hostsPerVpc)).to.be.equal(256);
  });

});
