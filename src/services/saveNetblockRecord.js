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
import { toString as _toString } from 'lodash';

const docClient = DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

const dynamodb = new AWS.DynamoDB({
  region: process.env.AWS_REGION || 'us-east-1'
});

const TableName = 'lionsnet-vpc';

async function updateNetblockRecord(endNetblock: number): Promise {
  const params = {
    Key: {
      vpcId : 'LAST_NETBLOCK'
    },
    TableName: TableName,
    ExpressionAttributeNames: { '#n': 'lastNetblockUsed' },
    ExpressionAttributeValues: { ':i' : endNetblock },
    ReturnValues: 'UPDATED_NEW',
    UpdateExpression: 'SET #n = :i'
  };

  return await docClient.updateAsync( params );
}

async function saveNetblockRecord(record: any): Promise {
  const nextRecord = Object.assign({}, record, { vpcId: 'LAST_NETBLOCK' });
  const params = {
    TableName,
    Item: nextRecord
  };
  const result = await docClient.putAsync(params);

  return result;
}

export default updateNetblockRecord;
export const saveNetblockRecordT = fromPromised(saveNetblockRecord);
export const updateNetblockRecordT = fromPromised(updateNetblockRecord);
