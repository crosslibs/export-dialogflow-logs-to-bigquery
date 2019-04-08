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
     || isEmpty(queueId)) {
  console.error('Missing one or more of required environment variables: ' +
                  'GOOGLE_APPLICATION_CREDENTIALS, GCLOUD_PROJECT, ' +
                  'LOCATION_ID, QUEUE_ID');
  process.exit(1);
}

/**
 * Create a queue, if none exists with the same name.
 */
const client = new tasks.v2beta3.CloudTasksClient({keyfileName: keyfile,
  projectId: projectId});
const parent = client.locationPath(projectId, locationId);
const queueName = client.queuePath(projectId, locationId, queueId);
const queue = {name: queueName, appEngineHttpQueue: {}};
const request = {parent: parent, queue: queue};

client.getQueue({name: queueName})
    .then((responses) => {
      console.log(`Queue [${queueName}] exists!`);
    })
    .catch((err) => {
      if (err.code == 5) {
        // NOT_FOUND
        console.log(`Creating queue ${queue.name}`);
        client.createQueue(request)
            .then((responses) => {
              console.log(responses[0]);
            })
            .catch((err) => {
              console.error(`Error while creating queue ${queue}`);
              console.error(err);
              process.exit(2);
            });
      } else {
        console.error(`Couldn't fetch queue [${queueName}] details`);
        console.error(err);
        process.exit(2);
      }
    });
