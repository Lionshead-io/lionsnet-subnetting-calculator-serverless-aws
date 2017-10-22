/**
 * defaultWorkspace.spec.js
 *
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { expect } from 'chai';
import { Success, Failure } from 'folktale/validation';
import defaultWorkspaceValidator from '../../src/validators/defaultWorkspace';

describe('defaultWorkspaceValidator()', () => {

  it('should return a Failure becuase of an invalid CIDR address', () => {
    expect(defaultWorkspaceValidator('100.')).to.be.an.instanceof(Failure);
  });

  it('should return a Success becuase a valid CIDR Address has been provided (ex. 100.64.0.0/10).', () => {
    expect(defaultWorkspaceValidator('100.64.0.0/10')).to.be.an.instanceof(Success);
  });

});
