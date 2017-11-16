import { of, rejected } from 'folktale/concurrency/task';
import { PREFIX_TO_HOSTS } from './cidrEnum';

export default function allNetblocksUsed(totalHosts = 256, lastNetblock) {
  const vpcTotalHosts = PREFIX_TO_HOSTS[lastNetblock.DefaultWorkspace.split('/')[1]];

  if ( ((totalHosts / 256) + lastNetblock.lastNetblockUsed) > (vpcTotalHosts / 256) ) return rejected(`You have cannot create a VPC of this size (${totalHosts}) as you've run out of Netblocks and don't have space within your DefaultWorkspace.`);

  return of(lastNetblock);
};
