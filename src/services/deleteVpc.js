// @flow
/**
 * deleteVpc.js - Exports deleteVpc()
 *
 * deleteVpc() - Deletes the specified VPC.
 *
 *
 * This source code is licensed under the CC BY-SA 4.0 license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import AWS from 'aws-sdk';
import DocumentClient from 'dynamodb-promise';
import { task, of, fromPromised } from 'folktale/concurrency/task';

const docClient = DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

const dynamodb = new AWS.DynamoDB({
  region: process.env.AWS_REGION || 'us-east-1'
});

const TableName = 'lionsnet-vpc';

export default function deleteVpc(vpcId: string): Promise<any> {
  const params = {
    Key: {
      "vpcId": {
        S: vpcId
      }
    },
    TableName
  };

  return new Promise((resolve, reject) => {
    dynamodb.deleteItem(params, function(err, data) {
      if (err) reject(err);
      else     resolve(data);
    });
  });

}

export const deleteVpcT = fromPromised(deleteVpc);
