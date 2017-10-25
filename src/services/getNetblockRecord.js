// @flow
/**
 * getNetblockRecord.js - Exports getNetblockRecord()
 *
 * getNetblockRecord() -
 *
 *
 * This source code is licensed under the MIT license found in the
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

export default function getNetblockRecord() {
  const params = {
    Key: {
      'vpcId': {
        S: 'LAST_NETBLOCK'
      }
    },
    TableName: 'lionsnet-vpc'
  };

  return new Promise((resolve, reject) => {
    dynamodb.getItem(params, function(err, data) {
      if (err) reject(err);
      else     resolve(data);
    });
  });
}

export const getNetblockRecordT = fromPromised(getNetblockRecord);
