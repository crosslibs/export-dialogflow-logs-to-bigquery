# BigQuery setup

This folder hosts script for setting up BigQuery dataset and tables. If a BQ dataset or table with the same name exists, then no action is taken. Otherwise, a new dataset and/or table with the specified name is created.

## Solution Approach
The script uses `@google-cloud/bigquery` Node.js client libraries to do the necessary configuration.

## Building and Testing

#### Install dependencies
`> npm install`

## Deploying the service

##### Pre-requisites
* Please ensure that the service account has necessary permissions (at least `BigQuery User` role is needed) before running the command.
* Also ensure that `BigQuery` service is enabled in the GCP project

`> GOOGLE_APPLICATION_CREDENTIALS=<creds> GOOGLE_CLOUD_PROJECT=<project-id> LOCATION_ID=<locationId> DATASET_NAME=<dataset-name> TABLE_NAME=<table-name> npm start`
