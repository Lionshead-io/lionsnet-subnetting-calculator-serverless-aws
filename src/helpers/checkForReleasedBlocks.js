import { isUndefined as _isUndefined, isEmpty as _isEmpty } from 'lodash';
import { last } from 'ramda';
import IncrementedOrReleasedBlock from '../unions/incrementedOrReleasedBlock';

export default function checkForReleasedBlocks(netblockRecord, neededBlocks) {
  if (_isUndefined(netblockRecord.releasedBlocks) || netblockRecord.releasedBlocks.length <= 0) {
    return IncrementedOrReleasedBlock.Nil();
  }

  const result = last(
    netblockRecord.releasedBlocks
      .filter((currVal) => currVal.usedBlocks === neededBlocks)
      .map((currVal) => ({ lastNetblockUsed: currVal.startNetblock }))
  );

  debugger;

  return (_isEmpty(result)) ? IncrementedOrReleasedBlock.Incremented(netblockRecord) : IncrementedOrReleasedBlock.Released(result);
};
