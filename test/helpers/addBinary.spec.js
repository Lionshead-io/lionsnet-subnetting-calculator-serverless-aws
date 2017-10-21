/**
 * addBinary.spec.js
 *
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { expect } from 'chai';
import addBinary from '../../src/helpers/addBinary';

describe('addBinary()', () => {

  it('should perform bitwise addition', () => {
    const a = '1100100010000000000000000000000';
    const b = '01100100010000000000000000000000';

    expect(addBinary(a, b)).to.be.equal('11001000100000000000000000000000');
  });

});
