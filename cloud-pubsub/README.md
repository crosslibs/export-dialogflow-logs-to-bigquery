# Cloud PubSub setup

This folder hosts script for setting up Cloud PubSub topic. If a topic with the same name exists, then no action is taken. Otherwise, a new topic with the specified name is created.

## Solution Approach
The script uses `@google-cloud/pubsub` Node.js client libraries to setup a PubSub topic.

## Building and Testing

#### Install dependencies
`> npm install`

## Deploying the service

##### Pre-requisites
* Please ensure that the service account has necessary permissions (at least `Pub/Sub Editor` role is needed) before running the command.
* Please ensure `Cloud PubSub API` is enabled in the GCP project

`> GOOGLE_APPLICATION_CREDENTIALS=<creds> GOOGLE_CLOUD_PROJECT=<project-id> TOPIC_NAME=<topic-name> npm start`
