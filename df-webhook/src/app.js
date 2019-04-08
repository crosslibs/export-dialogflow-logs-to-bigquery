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

/**
 * Check that all required parameters are present
 */
const Utils = require('./utils');
const projectId = process.env.GOOGLE_CLOUD_PROJECT;

const DLP = require('@google-cloud/dlp');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const FulfillmentError = require('./error');
const port = process.env.PORT || 8080;

/**
 * DLP Configuration
 */
const dlp = new DLP.DlpServiceClient();
const parent = dlp.projectPath(projectId);
const infoTypes = [{name: 'PHONE_NUMBER'},
  {name: 'EMAIL_ADDRESS'},
  {name: 'PERSON_NAME'},
  {name: 'CREDIT_CARD_NUMBER'}];
const customInfoTypes = [{
  infoType: {
    name: 'POLICY_NUMBER',
  },
  regex: {
    pattern: '[1-9]{3}-[1-9]{5}',
  },
  likelihood: 'POSSIBLE',
}];
const deidentifyConfig = {
  infoTypeTransformations: {
    transformations: [
      {
        primitiveTransformation: {
          replaceWithInfoTypeConfig: {},
        },
      },
    ],
  },
};
const minLikelihood = 'LIKELIHOOD_UNSPECIFIED';
const includeQuote = true;

/**
 * Cloud PubSub Configuration
 */
const {PubSub} = require('@google-cloud/pubsub');
const pubsub = new PubSub();
const topicName = process.env.TOPIC_NAME;

/**
 * Validates whether the request payload
 * @param {object} req webhook express request
 * @throws FulfillmentError if validation fails
 */
async function validate(req) {
  // Validating the dialogflow webhook request format
  if (Utils.isEmptyObject(req.body)) {
    throw new FulfillmentError('Empty request body', 400);
  } else if (Utils.isStringEmpty(req.body.responseId)
       || Utils.isStringEmpty(req.body.session)
       || Utils.isEmptyObject(req.body.queryResult)
       || Utils.isStringEmpty(req.body.queryResult.queryText)) {
    throw new FulfillmentError('Invalid request body', 400);
  }
}

/**
 * Dialogflow fulfillment function
 * Fulfills the request using custom logic
 * @param {object} req webhook express request
 * @param {object} res webhook express response
 */
function fulfill(req, res) {
  // Fulfillment logic goes here
  res.status(200).json({});
}

/**
 * Push the message to pubsub topic
 * @param {object} conv Conversation object with PII masked
 */
function pushToPubSubTopic(conv) {
  console.log(`Pushing message [${conv.responseId}, ${conv.session}]`);
  const message = {
    responseId: conv.responseId,
    session: conv.session,
    query: conv.queryResult.queryText,
    intent: {
      name: (conv.intent ? conv.intent.name : null),
      displayName: (conv.intent ? conv.intent.displayName : null),
    },
    intentDetectionConfidence: conv.intentDetectionConfidence,
    userId: (conv.user ? conv.user.userId : null),
  };
  pubsub.topic(topicName)
      .publish(Buffer.from(JSON.stringify(message)))
      .then((responses) => {
        console.log('Successfully published message ' +
                        `[${conv.responseId}, ${conv.session}] to ` +
                        `topic ${topicName}`);
      })
      .catch((err) => {
        console.error('Error while publishing message ' +
                          `[${conv.responseId}, ${conv.session}] to ` +
                          `topic ${topicName}`);
        console.error(err);
      });
}

/**
 * Log dialogflow conversation
 * @param {object} conv webhook request body
 */
function log(conv) {
  // Perform DLP and write to PubSub topic
  const request = {
    parent: parent,
    deidentifyConfig: deidentifyConfig,
    inspectConfig: {
      infoTypes: infoTypes,
      customInfoTypes: customInfoTypes,
      minLikelihood: minLikelihood,
      includeQuote: includeQuote,
    },
    item: {value: conv.queryResult.queryText},
  };
  dlp.deidentifyContent(request)
      .then((responses) => {
        console.log('Deidentifying successful: ' +
                      `[${conv.responseId}, ${conv.session}]`);
        conv.queryResult.queryText = responses[0].item.value;
        pushToPubSubTopic(conv);
      })
      .catch((err) => {
        console.error(err);
      });
}

/**
 * Conversation Interceptor function
 * Logs the conversation and invokes fulfillment logic
 * to complete the request.
 * NOTE: Only user conversations are logged currently.
 * @param {object} req webhook express request
 * @param {object} res webhook express response
 */
function intercept(req, res) {
  validate(req)
      .then(() => {
        log(req.body);
        fulfill(req, res);
      })
      .catch((err) => {
        res.status(err.statusCode).json(err);
      });
}

/**
 * Use body parser for parsing application/json payloads
 */
app.use(bodyParser.json());

/**
 * Add POST /fulfillment HTTP method
 */
app.route('/fulfillment')
    .post(intercept);

/**
 * Start the HTTP server on the specified port
 */
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

/**
 * Export express server object for unit tests
 */
module.exports = server;
