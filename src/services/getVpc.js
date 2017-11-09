// @flow
/**
 * getVpc.js - Exports getVpc()
 *
 *
 * This source code is licensed under the CC BY-SA 4.0 license found in the
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

async function getVpc(vpcId: string): Promise<any> {
  const result = await docClient.getAsync({
    TableName,
    Key : {
      vpcId
    }
  });

  return result.Item;
}

export default getVpc;
export const getVpcT = fromPromised(getVpc);
