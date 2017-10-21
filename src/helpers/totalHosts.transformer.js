// @flow
import { HOSTS_TO_PREFIX, PREFIX_TO_HOSTS } from './cidrEnum';
import { compose, last } from 'ramda';
import { toNumber } from 'lodash';

/**
 * totalHostsTransformer() - Accepts the number of total host addresses the user has supplied for the VPC they are trying
 *                           to provision and will return a safe totalHosts value. What this means is that if a user doesn't
 *                           supply a valid totalHosts integer that corresponds to a valid CIDR prefix, it will round down the
 *                           totalHosts value to the next available valid CIDR prefix.
 *
 * @param totalHosts int
 * @returns int
 */
export default function totalHostsTransformer(totalHosts: number): number {
  if (totalHosts < 256) return 256;
  else if (totalHosts > PREFIX_TO_HOSTS['/16']) return PREFIX_TO_HOSTS['/16'];
  else if (totalHosts % 256 > 0) {
    return compose(toNumber, last)(Object.keys(HOSTS_TO_PREFIX).filter(currVal => (currVal <= totalHosts)));
  }

  return totalHosts;
}
