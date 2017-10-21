// @flow
/**
 * createTable.js - Exports createTable() and createTableTask (default)
 *
 * createTable() - dynamodb.createTable()
 * createTableTask - wraps promise yielding createTable in a Task data structure
 *
 * Copyright © 2015-2016 Michael Iglesias. All rights reserved.
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




