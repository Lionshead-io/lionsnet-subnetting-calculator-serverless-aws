import Validation from 'folktale/validation';
import { isNumber as _isNumber } from 'lodash';

/**
 * defaultWorkspaceValidator() - Returns a Success type if a valid global default workspace CIDR address was provided.
 *                               Else, it returns a Failure type.
 *
 *
 * @param subnetCount int - # of subnets that are to be provisioned
 * @returns {Validation}
 */
export default function subnetCountValidator(subnetCount: number): Validation {
  return (_isNumber(subnetCount) && subnetCount > 0) ? Validation.Success() : Validation.Failure([`Subnet count must be a valid number greater than 0.`]);
};
