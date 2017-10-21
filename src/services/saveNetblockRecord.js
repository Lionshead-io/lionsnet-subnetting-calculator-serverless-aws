// @flow
/**
 * updateNetblockRecord.js - Exports updateNetblockRecord()
 *
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import AWS from 'aws-sdk';
import DocumentClient from 'dynamodb-promise';
import { fromPromised } from 'folktale/concurrency/task';

const docClient = DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

async function updateNetblockRecord(numOfBlocks: number): Promise {
  const params = {
    Key: {
      vpcId : 'LAST_NETBLOCK'
    },
    TableName: 'lionsnet-vpc',
    ExpressionAttributeNames: { '#n': 'lastNetblockId' },
    ExpressionAttributeValues: { ':i' : numOfBlocks },
    ReturnValues: 'UPDATED_NEW',
    UpdateExpression: 'SET #n = #n + :i'
  };
  let result = await docClient.updateAsync( params );

  console.log(result, 'updateNetblockRecord -> result');

  return (result);
}

export default updateNetblockRecord;
export const updateNetblockRecordT = fromPromised(updateNetblockRecord);
