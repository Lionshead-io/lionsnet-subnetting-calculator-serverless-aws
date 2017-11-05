// @flow
/**
 * saveVpc.js - Exports saveVpc()
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

const dynamodb = new AWS.DynamoDB({
  region: process.env.AWS_REGION || 'us-east-1'
});

const TableName = 'lionsnet-vpc';

async function saveVpc(vpc: any): Promise<any> {
  await docClient.putAsync({
    TableName,
    Item: vpc
  });

  return vpc;
}

export default saveVpc;
export const saveVpcT = fromPromised(saveVpc);
