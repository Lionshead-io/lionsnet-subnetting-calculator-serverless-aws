import Validation from 'folktale/validation';
import { isString as _isString } from 'lodash';
/**
 * vpcIdValidator() - Returns a Success type if a valid vpcId of type String was provided.
 *                       Else, it returns a Failure type.
 *
 *
 * @param vpcId string - A string to uniquely identify a VPC
 * @returns {Validation}
 */
export default function vpcIdValidator(vpcId: string): Validation {
  return (vpcId && _isString(vpcId)) ? Validation.Success() : Validation.Failure([`'vpcId' is required and must be a String.`]);
};
