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
const datasetName = process.env.DATASET_NAME;
const tableName = process.env.TABLE_NAME;

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
     || isEmpty(datasetName)
     || isEmpty(tableName)) {
  console.error('Missing one or more of required environment variables: ' +
                  'GOOGLE_APPLICATION_CREDENTIALS, GOOGLE_CLOUD_PROJECT, ' +
                  'LOCATION_ID, DATASET_NAME, TABLE_NAME');
  process.exit(1);
}
