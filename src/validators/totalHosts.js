import Validation from 'folktale/validation';
import { isNumber as _isNumber } from 'lodash';
import { HOSTS_TO_PREFIX } from '../helpers/cidrEnum';

/**
 * totalHosts() - Returns a Success type if a valid global default workspace CIDR address was provided.
 *                               Else, it returns a Failure type.
 *
 *
 * @param totalHosts - # of IP Addresses that are to be allocated to the VPC
 * @returns {*}
 */
export function totalHostsIsNumber(totalHosts: number): Validation {
  return (_isNumber(totalHosts)) ? Validation.Success() : Validation.Failure([`'totalHosts' must be an integer greater than or equal to 256..`]);
};

export function totalHostsValidRange(totalHosts: number): Validation {
  return (totalHosts >= 256 && totalHosts <= 65536) ? Validation.Success() : Validation.Failure([`'totalHosts' must be an integer greater than or equal to 256 and less than or equal to 65536. AWS VPCs can have a maximum of 65536 host addresses.`]);
};

export function totalHostsValidSizeValidator(totalHosts: number): Validation {
  return (HOSTS_TO_PREFIX[totalHosts]) ? Validation.Success() : Validation.Failure([`'totalHosts' must be an integer that corresponds to a valid CIDR prefix.`]);
}

export default function totalHostsValidator(totalHosts: number): Validation {
  return totalHostsIsNumber(totalHosts)
    .concat(totalHostsValidRange(totalHosts))
    .concat(totalHostsValidSizeValidator(totalHosts));
}


