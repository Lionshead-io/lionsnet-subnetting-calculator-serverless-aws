// @flow
/**
 * getNetblockRecord.js - Exports getNetblockRecord()
 *
 * getNetblockRecord() -
 *
 *
 * This source code is licensed under the CC BY-SA 4.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import AWS from 'aws-sdk';
import DocumentClient from 'dynamodb-promise';
import Result from 'folktale/result';
import Maybe from 'folktale/maybe';
import Validation from 'folktale/validation';
import { task, of, fromPromised, waitAll } from 'folktale/concurrency/task';

const docClient = DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

const dynamodb = new AWS.DynamoDB({
  region: process.env.AWS_REGION || 'us-east-1'
});

const TableName = 'lionsnet-vpc';

export async function getNetblockRecord() {
  const params = {
    Key: {
      vpcId: 'LAST_NETBLOCK'
    },
    TableName
  };
  const result = await docClient.getAsync(params);

  return result.Item;
}

export const getNetblockRecordT = fromPromised(getNetblockRecord);
