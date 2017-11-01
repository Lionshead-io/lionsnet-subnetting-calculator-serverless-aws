import Validation from 'folktale/validation';
import ip from 'ip';

/**
 * ipAddressValidator() - Returns a Success type if a valid global default workspace CIDR address was provided.
 *                               Else, it returns a Failure type.
 *
 *
 * @param subnetCount int - # of subnets that are to be provisioned
 * @returns {Validation}
 */
export default function ipAddressValidator(address: string): Validation {
  return (ip.isV4Format(address)) ? Validation.Success() : Validation.Failure([`IP Address provided is not valid or is not in V4 format.`]);
};
