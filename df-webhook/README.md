# Dialogflow (v2) Fulfillment Webhook

This folder hosts a sample webhook for fulfillment. This is a simple node.js app and can be deployed to Google App Engine.

## Solution Approach
This webhook queues the conversation and the session details to Cloud Tasks for asynchronously processing them.

## Building and Testing

#### Install dependencies
`npm install`

#### Run unit tests
`npm test`

#### Submitting the coverage data to coveralls
`COVERALLS_REPO_TOKEN=<token-here> npm run coverage`

## Deploying the service

#### Local environment
`npm start` to run the service locally

#### Google App Engine (GAE)
 _Please note that you need to have gcloud sdk installed before running the following command and have necessary permissions (at least App Engine Deployment Admin role is needed)._

 `GOOGLE_APPLICATION_CREDENTIALS=<creds> gcloud app deploy --project=<project-id>` to deploy to GAE standard.
