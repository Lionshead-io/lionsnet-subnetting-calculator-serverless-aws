/**
 * hostsPerSubnet.spec.js
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
    const hostsPerSubnet = 300;
    const hostsPerVpc = 256;

    expect(hostsPerSubnetTransformer(hostsPerSubnet, hostsPerVpc)).to.be.equal(256);
  });

  it('should return the hostsPerSubnet of the rounded down corresponding CIDR prefix (ex. 20 hostsPerSubnet will return 16 because it is the rounded down to a CIDR prefix of /28 (16 host addresses)', () => {
    const hostsPerSubnet = 20;

    expect(hostsPerSubnetTransformer(hostsPerSubnet)).to.be.equal(16);
  });

});
