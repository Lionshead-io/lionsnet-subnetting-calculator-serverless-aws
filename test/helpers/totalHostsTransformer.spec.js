/**
 * totalHostsTransformer.spec.js
 *
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { expect } from 'chai';
import totalHostsTransformer from '../../src/helpers/totalHosts.transformer';

describe('totalHostsTransformer()', () => {

  it('should return 256 when "totalHosts" value passed into function is < 256', () => {
    const totalHosts = 256;

    expect(totalHostsTransformer(totalHosts)).to.be.equal(256);
  });

  it('should return 65536 when "totalHosts" value passed into function is > 65536', () => {
    const totalHosts = 99999;

    expect(totalHostsTransformer(totalHosts)).to.be.equal(65536);
  });

  it('should return the totalHosts of the rounded down corresponding CIDR prefix (ex. 300 totalHosts will return 256 because it is the rounded down to a CIDR prefix of /24 (254 host addresses)', () => {
    const totalHosts = 300;

    expect(totalHostsTransformer(totalHosts)).to.be.equal(256);
  });

});
