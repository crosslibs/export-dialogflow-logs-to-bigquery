# Dataflow job

This document provides information on how to setup the Dataflow job to migrate data from Cloud Pub/Sub Topic to BigQuery.

## Deploying dataflow job from template

##### Pre-requisites
* You need to have `gcloud` sdk installed before running the following command and have necessary permissions.
* Create a folder in GCP bucket and for temporary workspace for Dataflow..

##### Deploy to Google Cloud Platform
`> gcloud dataflow jobs run --zone=asia-south1-c --region=asia-northeast1 --staging-location=gs://<TEMP_FOLDER_PATH> --gcs-location gs://dataflow-templates/latest/PubSub_Subscription_to_BigQuery --parameters inputSubscription=<subscriptionName> outputTableSpec=<project-id>:<dataset-name>.<table-name>`
