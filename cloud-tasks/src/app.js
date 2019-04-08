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
const tasks = require('@google-cloud/tasks');

const keyfile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const projectId = process.env.GCLOUD_PROJECT;
const locationId = process.env.LOCATION_ID;
const queueId = process.env.QUEUE_ID;

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
     || isEmpty(queueId)) {
  console.error('Missing one or more of required environment variables: ' +
                  'GOOGLE_APPLICATION_CREDENTIALS, GCLOUD_PROJECT, ' +
                  'LOCATION_ID, QUEUE_ID');
  process.exit(1);
}

/**
 * Create a queue basis the command-line-parameter
 */
const client = new tasks.v2beta3.CloudTasksClient({keyfileName: keyfile,
                                      projectId: projectId});
var parent = client.locationPath(projectId, locationId);
var queueName = client.queuePath(projectId, locationId, queueId);
var queue = {name: queueName, appEngineHttpQueue:{}};
var request = {parent: parent, queue: queue};

client.createQueue(request)
    .then((responses) => {
      console.log(responses[0]);
    })
    .catch((err) => {
      console.log(err);
    });
