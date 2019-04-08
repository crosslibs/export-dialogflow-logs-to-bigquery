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
const topicName = process.env.TOPIC_NAME;
const subscriptionName = process.env.SUBSCRIPTION_NAME;

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
     || isEmpty(topicName)
     || isEmpty(subscriptionName)) {
  console.error('Missing one or more of required environment variables: ' +
                  'GOOGLE_APPLICATION_CREDENTIALS, GOOGLE_CLOUD_PROJECT, ' +
                  'TOPIC_NAME, SUBSCRIPTION_NAME');
  process.exit(1);
}

const {PubSub} = require('@google-cloud/pubsub');
const pubsub = new PubSub({projectId});

/**
 * Create Topic
 */
pubsub.createTopic(topicName)
    .then((responses) => {
      console.log(`Successfully created topic: ${topicName}`);
      console.log(responses[0]);
    })
    .catch((err) => {
      if (err.code == 6) {
        // ALREADY_EXISTS
        console.log(`Topic ${topicName} already exists!`);
      } else {
        console.error(`Error while creating topic: ${topicName}`);
        console.error(err);
        process.exit(2);
      }
    });

/**
 * Create Subscription
 */
pubsub.topic(topicName)
      .createSubscription(subscriptionName)
      .then((responses) => {
        console.log(`Successfully created subscription: ${subscriptionName}`);
        console.log(responses[0]);
      })
      .catch((err) => {
        if (err.code == 6) {
          // ALREADY_EXISTS
          console.log(`Subscription ${subscriptionName} already exists!`);
        } else {
          console.error(`Error while creating subscription: ` +
                          `${subscriptionName}`);
          console.error(err);
          process.exit(2);
        }
      });
