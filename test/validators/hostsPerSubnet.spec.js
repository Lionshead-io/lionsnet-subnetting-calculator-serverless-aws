/**
 * hostsPerSubnet.spec.js
 *
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { expect } from 'chai';
import hostsPerSubnetValidator, {
  hostsPerSubnetIsNumber,
  hostsPerSubnetValidRange,
  hostsPerSubnetValidSizeValidator
} from '../../src/validators/hostsPerSubnet';
import { Success, Failure } from 'folktale/validation';

describe('hostsPerSubnet Validators', () => {

  describe('hostsPerSubnet.hostsPerSubnetIsNumber()', () => {

    it('Return a Success if hostsPerSubnet is a valid integer', () => {
      expect(hostsPerSubnetIsNumber(256)).to.be.an.instanceof(Success);
    });

    it('Return a Failure if hostsPerSubnet is NOT a valid integer', () => {
      expect(hostsPerSubnetIsNumber('')).to.be.an.instanceof(Failure);
    });

  });

  describe('hostsPerSubnet.hostsPerSubnetValidRange()', () => {
    it('Return a Success if hostsPerSubnet is between 16 and totalHosts', () => {
      const hostsPerSubnet = 16;
      const totalHostsVpc = 256;
      expect(hostsPerSubnetValidRange(hostsPerSubnet, totalHostsVpc)).to.be.an.instanceof(Success);
    });

    it('Return a Failure when hostsPerSubnet is NOT between 16 and totalHostsVpc', () => {
      const hostsPerSubnet = 300;
      const totalHostsVpc = 256;
      expect(hostsPerSubnetValidRange(hostsPerSubnet, totalHostsVpc)).to.be.an.instanceof(Failure);
    });
  });

  describe('hostsPerSubnet.hostsPerSubnetValidRange()', () => {
    it('Return a Success when hostsPerSubnet corresponds to a valid CIDR prefix', () => {
      const hostsPerSubnet = 64;
      const totalHostsVpc = 256;
      expect(hostsPerSubnetValidSizeValidator(hostsPerSubnet, totalHostsVpc)).to.be.an.instanceof(Success);
    });

    it('Return a Failure when hostsPerSubnet does NOT corresponds to a valid CIDR prefix', () => {
      const hostsPerSubnet = 55;
      const totalHostsVpc = 256;
      expect(hostsPerSubnetValidSizeValidator(hostsPerSubnet, totalHostsVpc)).to.be.an.instanceof(Failure);
    });
  });

  describe('hostsPerSubnet.hostsPerSubnetValidator()', () => {
    it('Return a Success when hostsPerSubnet is a valid integer', () => {
      const hostsPerSubnet = 64;
      const totalHostsVpc = 256;
      expect(hostsPerSubnetValidator(hostsPerSubnet, totalHostsVpc)).to.be.an.instanceof(Success);
    });

    it('Return a Failure with 3 errors being accumulated into an Array<string>', () => {
      const hostsPerSubnet = 0;
      const totalHostsVpc = 256;
      const result = hostsPerSubnetValidator(hostsPerSubnet, totalHostsVpc);

      expect(hostsPerSubnetValidator(hostsPerSubnet, totalHostsVpc)).to.be.an.instanceof(Failure);
      result.matchWith({
        Success: ({ value }) => {},
        Failure: ({ value }) => {
          expect(value).to.have.lengthOf(2);
        }
      })
    });
  });

});
