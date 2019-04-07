# Dialogflow (v2) Fulfillment Webhook

This folder hosts a sample webhook for fulfillment. This is a simple node.js app and can be deployed to Google App Engine.

## Solution Approach
This webhook queues the conversation and the session details to Cloud Tasks for asynchronously processing them.

## Building and Testing

#### Install dependencies
`> npm install`

#### Run unit tests
`> npm test`

#### Submitting the coverage data to coveralls
`> COVERALLS_REPO_TOKEN=<token-here> npm run coverage`

## Deploying the service

#### Local environment
`> npm start` to run the service locally

#### Google App Engine (GAE)
* ```You need to have gcloud sdk installed before running the following command and have necessary permissions (at least App Engine Admin, Storage Object Admin and Cloud Build Editor roles are needed).```
* ```If you already have GAE services running in the project, ensure that you provide a service name in the app.yaml file (by uncommenting the relevant lines)```


 `> GOOGLE_APPLICATION_CREDENTIALS=<creds> gcloud app deploy --project=<project-id>` to deploy to GAE standard.
