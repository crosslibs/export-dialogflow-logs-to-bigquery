/**
 * Copyright 2019, Chaitanya Prakash N <chaitanyaprakash.n@gmail.com>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
const keyfile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const projectId = process.env.GOOGLE_CLOUD_PROJECT;
const locationId = process.env.LOCATION_ID;
const datasetId = process.env.DATASET_ID;
const tableId = process.env.TABLE_ID;

/**
 * Checks whether the string is empty or not
 * @param {string} str String to be validated against
 * @return {boolean} true if str is not undefined or null or empty
 */
function isEmpty(str) {
  return str === undefined
         || str === null
         || str.trim().length === 0;
}

/**
 * If any of the required parameters are not provided, then abort.
 */
if (isEmpty(keyfile)
     || isEmpty(projectId)
     || isEmpty(locationId)
     || isEmpty(datasetId)
     || isEmpty(tableId)) {
  console.error('Missing one or more of required environment variables: ' +
                  'GOOGLE_APPLICATION_CREDENTIALS, GOOGLE_CLOUD_PROJECT, ' +
                  'LOCATION_ID, DATASET_ID, TABLE_ID');
  process.exit(1);
}

const {BigQuery} = require('@google-cloud/bigquery');
const client = new BigQuery();
const options = {
  location: locationId,
};

client.createDataset(datasetId, options)
    .then((responses) => {
      console.log(`Successfully created BQ dataset ${datasetId}`);
      console.log(responses[0]);
    })
    .catch((err) => {
      if (err.code == 409) {
        console.log(`BQ dataset ${datasetId} already exists!`);
      } else {
        console.error(`Error while creating dataset ${datasetId}`);
        console.error(err);
        process.exit(2);
      }
    });

const schema = [
  {
    description: 'response id',
    mode: 'REQUIRED',
    name: 'responseId',
    type: 'STRING'
  },
  {
    description: 'session path',
    mode: 'REQUIRED',
    name: 'session',
    type: 'STRING'
  },
  {
    description: 'query text',
    mode: 'REQUIRED',
    name: 'query',
    type: 'STRING'
  },
  {
    description: 'user id',
    mode: 'NULLABLE',
    name: 'userId',
    type: 'STRING'
  },
  {
    description: 'intent detection confidence score',
    mode: 'REQUIRED',
    name: 'intentDetectionConfidence',
    type: 'FLOAT'
  },
  {
    description: 'intent',
    mode: 'NULLABLE',
    name: 'intent',
    type: 'RECORD',
    fields: [
      {
        'description': 'intent name',
        'name': 'name',
        'type': 'STRING',
        'mode': 'NULLABLE'
      },
      {
        'description': 'intent display name',
        'name': 'displayName',
        'type': 'STRING',
        'mode': 'NULLABLE'
      },
    ],
  },
];

const tableOptions = {
  location: locationId,
  schema: schema,
};

client.dataset(datasetId)
    .createTable(tableId, tableOptions)
    .then((responses) => {
      console.log(`Successfully created table ${tableId}`);
      console.log(responses[0]);
    })
    .catch((err) => {
      if(err.code == 409) {
        //ALREADY_EXISTS
        console.log(`BQ table ${tableId} already exists!`);
      }
      else {
        console.error(`Error while creating table ${tableId}`);
        console.error(err);
        process.exit(2);
      }
    });
