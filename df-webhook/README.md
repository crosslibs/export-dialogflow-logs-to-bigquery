# Dialogflow (v2) Fulfillment Webhook

This folder hosts a sample webhook for fulfillment. This is a simple node.js app and can be deployed to Google App Engine.

## Solution Approach
This webhook queues the conversation after de-identifying (masking) into a PubSub topic.

## Building and Testing

#### Install dependencies
`> npm install`

#### Run unit tests
`> npm test`

#### Submitting the coverage data to coveralls
`> COVERALLS_REPO_TOKEN=<token-here> npm run coverage`

## Deploying the service

#### Local environment
`> GOOGLE_APPLICATION_CREDENTIALS=<creds> GOOGLE_CLOUD_PROJECT=<project-id> TOPIC_NAME=<topic-name> npm start` to run the service locally

#### Google App Engine (GAE)
##### Pre-requisites
* You need to have `gcloud` sdk installed before running the following command and have necessary permissions (at least `App Engine Admin`, `Storage Object Admin`, `Cloud Build Editor`. `Service Usage Consumer`, `Pub/Sub Publisher` roles are needed).
* If you already have GAE services running in the project, ensure that you provide a service name in the `app.yaml` file.
* Also ensure that `Cloud DLP API` is enabled in the GCP project.

##### Deploy to Google Cloud Platform
`> GOOGLE_APPLICATION_CREDENTIALS=<creds> GOOGLE_CLOUD_PROJECT=<project-id> TOPIC_NAME=<topic-name> gcloud app deploy --project=<project-id>` to deploy to GAE standard.
