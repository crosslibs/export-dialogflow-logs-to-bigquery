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
// const dialogflow = require('dialogflow-fulfillment');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const FulfillmentError = require('./error');
const Utils = require('./utils');
const port = 8080;

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
 * Log dialogflow conversation
 * @param {object} conv webhook request body
 */
function log(conv) {
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
