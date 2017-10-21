// @flow
/**
 * hostsPerSubnetTransformer() - Accepts the number of hostsPerSubnet & totoal hostsPerVpc the user has supplied for the VPC they are trying
 *                           to provision and will return a safe hostsPerSubnet value. What this means is that if a user doesn't
 *                           supply a valid hostsPerSubnet integer that corresponds to a valid CIDR prefix, it will round down the
 *                           hostsPerSubnet value to the next available valid CIDR prefix. Note that the minimum number of
 *                           host addresses per subnet is 16. Also, the hostsPerSubnet value provided should not exceed the
 *                           number of total hosts that have been allocated to the VPC in which this subnets reside in.
 *
 *
 * @param hostsPerSubnet int
 * @param hostsPerVpc int
 * @returns {number}
 */
export default function hostsPerSubnetTransformer(hostsPerSubnet: number, hostsPerVpc: number): number {
  if (hostsPerSubnet < 16) return 16;
  else if (hostsPerSubnet > hostsPerVpc) return hostsPerVpc;

  return (Math.floor(hostsPerSubnet / 16) * 16);
};
