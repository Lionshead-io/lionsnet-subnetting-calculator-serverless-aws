import Validation from 'folktale/validation';
import { isNumber as _isNumber } from 'lodash';
import { HOSTS_TO_PREFIX } from '../helpers/cidrEnum';

/**
 * hostsPerSubnetValidator() - Returns a Success type if a valid value for 'hostsPerSubnet' is provided.
 *                               Else, it returns a Failure type.
 *
 *
 * @param hostsPerSubnet - # of host address per subnet that is to be provisioned
 * @returns {Validation}
 */
export function hostsPerSubnetIsNumber(hostsPerSubnet: number): Validation {
  return (_isNumber(hostsPerSubnet)) ? Validation.Success() : Validation.Failure([`'hostsPerSubnet' must be an integer.`]);
};

export function hostsPerSubnetValidRange(hostsPerSubnet: number, totalHosts: number): Validation {
  return (hostsPerSubnet >= 16 && hostsPerSubnet <= totalHosts) ? Validation.Success() : Validation.Failure([`'hostsPerSubnet' must be an integer greater than or equal to 16 and less than the number of host addresses allocated to the VPC (totalHosts).`]);
};

export function hostsPerSubnetValidSizeValidator(hostsPerSubnet: number): Validation {
  return (HOSTS_TO_PREFIX[hostsPerSubnet]) ? Validation.Success() : Validation.Failure([`'hostsPerSubnet' must be an integer that corresponds to a valid CIDR prefix.`]);
}

export default function hostsPerSubnetValidator(hostsPerSubnet: number, totalHosts: number): Validation {
  return hostsPerSubnetIsNumber(hostsPerSubnet)
    .concat(hostsPerSubnetValidRange(hostsPerSubnet, totalHosts))
    .concat(hostsPerSubnetValidSizeValidator(hostsPerSubnet));
}


