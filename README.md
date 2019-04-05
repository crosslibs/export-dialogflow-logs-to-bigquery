# Export Dialogflow conversations to BigQuery

Export Dialogflow conversations to BigQuery after masking SPII data using DLP API

## Solution Approach

Dialogflow Fulfillment mechanism is used to intercept all the conversations using a webhook (deployed as a GAE app). The conversations are logged asynchronously after masking the PII data using Google App Engine and DLP API to a PubSub topic. From there each conversation is then inserted into BigQuery using Dataflow job. (#streaming inserts to BQ) 

## Architecture

![Export Conversations to BQ](https://user-images.githubusercontent.com/20769938/55611487-4b87fd80-57a3-11e9-975d-7c49ba137b03.png)

## Contributions Welcome

Please feel free to contribute to the code base by submitting a pull request.
