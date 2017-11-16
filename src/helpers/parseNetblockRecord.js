import { isNumber as _isNumber, toNumber as _toNumber } from 'lodash';
import IncrementedOrReleasedBlock from '../unions/incrementedOrReleasedBlock';

export default function parseNetblockRecord(netblockRecord) {
  const getLastNetblockUsed = (netblockRecord) => {
    if (netblockRecord.lastNetblockUsed && _isNumber(_toNumber(netblockRecord.lastNetblockUsed))) {
      return _toNumber(netblockRecord.lastNetblockUsed);
    } else {
      return null;
    }
  };

  const getHostAddressesUsed = (netblockRecord) => {
    if (netblockRecord.lastNetblockUsed) {
      return ( (_toNumber(netblockRecord.lastNetblockUsed) + 1) * 256 );
    } else {
      return 0;
    }
  };

  return [getLastNetblockUsed(netblockRecord), getHostAddressesUsed(netblockRecord)];
};
