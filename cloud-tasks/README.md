# Cloud Tasks

This directory contains code for setting up a Cloud Tasks Queue.

This queue will be leveraged by Google App Engine services for Dialogflow fulfillment webhook and Asynchronous log processing service for logging the conversations and performing DLP and streaming them to PubSub respectively.

## Building and Testing
### Install necessary dependencies
`> npm install`

## Deploying to Google Cloud Platform

##### Pre-requisites
* You need to have `gcloud` sdk installed before running the following command.
* Enable `Cloud Tasks API` in the project.
* Assign necessary permissions for the service account (at least, `cloudtasks.queueAdmin` role is needed).

##### Create Cloud Tasks
 `> GOOGLE_APPLICATION_CREDENTIALS=<creds> GCLOUD_PROJECT=<project-id> LOCATION_ID=<location-id> QUEUE_ID=<queue-id> npm start`
