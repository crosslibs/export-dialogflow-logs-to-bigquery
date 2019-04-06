/**
 * Copyright 2019 Chaitanya Prakash N <chaitanyaprakash.n@gmail.com>
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
 * chai and chai-http packages for expect style assertions
 */
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;

/**
 * Import express server from the app for testing
 */
const server = require('../src/app');

/**
 * Tests for webhook
 */
describe('webhook', () => {
  /**
   * Tests for POST /fulfillment method
   */
  describe('POST /fulfillment', () => {
    /**
     * Verify that the HTTP endpoint exists
     */
    it('exists', () => {
      chai.request(server)
          .post('/fulfillment')
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).not.to.have.status(404);
          });
    });

    /**
     * Verify that the fulfillment endpoint returns error when the request
     * body is null
     */
    it('returns 400 error when request body is null', () => {
      chai.request(server)
          .post('/fulfillment')
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
          });
    });

    /**
     * Verify that the fulfillment endpoint returns error when the request
     * body is empty
     */
    it('returns 400 error when request body is empty', () => {
      chai.request(server)
          .post('/fulfillment')
          .set('content-type', 'application/json')
          .send({})
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
          });
    });

    /**
     * Verify that the fulfillment endpoint returns error when the request
     * body has no responseId
     */
    it('returns 400 error when request body has no response id', () => {
      chai.request(server)
          .post('/fulfillment')
          .set('content-type', 'application/json')
          .send({responseId: null, queryResult: {queryText: 'hi'},
            session: 'session-id'})
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
          });
    });

    /**
     * Verify that the fulfillment endpoint returns error when the request
     * body has an empty responseId
     */
    it('returns 400 error when request body has empty response id', () => {
      chai.request(server)
          .post('/fulfillment')
          .set('content-type', 'application/json')
          .send({queryResult: {queryText: 'hi'},
            session: 'session-id', responseId: ''})
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
          });
    });

    /**
     * Verify that the fulfillment endpoint returns error when the request
     * body has an no session
     */
    it('returns 400 error when request body has no session', () => {
      chai.request(server)
          .post('/fulfillment')
          .send({queryResult: {queryText: 'hi'},
            responseId: 'response-id', session: null})
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
          });
    });


    /**
     * Verify that the fulfillment endpoint returns error when the request
     * body has an empty session
     */
    it('returns 400 error when request body has empty session', () => {
      chai.request(server)
          .post('/fulfillment')
          .set('content-type', 'application/json')
          .send({queryResult: {queryText: 'hi'},
            session: '', responseId: 'response-id'})
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
          });
    });

    /**
     * Verify that the fulfillment endpoint returns error when the request
     * body has an no queryResult
     */
    it('returns 400 error when request body has no queryResult', () => {
      chai.request(server)
          .post('/fulfillment')
          .set('content-type', 'application/json')
          .send({session: 'session', queryResult: null,
            responseId: 'response-id'})
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
          });
    });


    /**
     * Verify that the fulfillment endpoint returns error when the request
     * body has an empty queryResult
     */
    it('returns 400 error when request body has empty session', () => {
      chai.request(server)
          .post('/fulfillment')
          .set('content-type', 'application/json')
          .send({queryResult: {},
            session: 'session', responseId: 'response-id'})
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
          });
    });

    /**
     * Verify that the fulfillment endpoint returns error when the request
     * body has an no queryText
     */
    it('returns 400 error when request body has no query text', () => {
      chai.request(server)
          .post('/fulfillment')
          .set('content-type', 'application/json')
          .send({queryResult: {params: {}, queryText: null},
            responseId: 'response-id', session: 'session'})
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
          });
    });


    /**
     * Verify that the fulfillment endpoint returns error when the request
     * body has an empty queryText
     */
    it('returns 400 error when request body has empty query text', () => {
      chai.request(server)
          .post('/fulfillment')
          .set('content-type', 'application/json')
          .send({queryResult: {queryText: ''},
            session: 'session', responseId: 'response-id'})
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
          });
    });

    /**
     * Verify that the fulfillment function is invoked
     * when the request body validation is successful
     */
    it('fulfillment function is invoked when request body is valid', () => {
      chai.request(server)
          .post('/fulfillment')
          .set('content-type', 'application/json')
          .send(JSON.stringify({queryResult: {queryText: 'query text'},
            session: 'session', responseId: 'response-id'}))
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
          });
    });
  });
});

/**
 * Root level after all hook
 * Closes the express server gracefully
 */
after(() => {
  server.close();
});
