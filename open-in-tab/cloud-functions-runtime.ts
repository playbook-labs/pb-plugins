// Deployment using Google Cloud Functions.
// We need two functions:
//   - Function A to handle the HTTP request, kick off Function B, and return immediately
//   - Function B to do the actual work asynchronously
//
// Google Cloud Deployment instructions at the bottom of this file

import * as functions from '@google-cloud/functions-framework';
import { PubSub } from '@google-cloud/pubsub';
import plugin from './src/plugin';

// This is the function that will be called by Playbook when the plugin is invoked.
// All it does is enqueue a separate job to process the assets and returns 200 OK
functions.http('split2x2InvocationHandler', async (req, res) => {
  // We use pubsub to enqueue a job to process the assets
  const dataBuffer = Buffer.from(JSON.stringify(req.body));
  await new PubSub()
    .topic('SPLIT_2x2_TOPIC')
    .publishMessage({ data: dataBuffer });

  // Return quickly so we don't run into an HTTP timeout
  res.status(200).send('OK');
});

// This function does the actual work of the plugin asynchronously
functions.cloudEvent('split2x2ProcessAsync', async (cloudEvent: any) => {
  const body = JSON.parse(Buffer.from(cloudEvent.data.message.data, 'base64').toString());

  console.log('data', cloudEvent.data.message.data);
  console.log('body', body);

  const { pluginInvocationToken, assets, callbackUrl } = body;

  plugin({ pluginInvocationToken, assets, callbackUrl });
});

// Set up a google cloud account and set up billing
// Currently offering $300 free -> https://cloud.google.com/free/docs/gcp-free-tier

// Install Google Cloud SDK
// https://cloud.google.com/sdk/docs/install or `brew install google-cloud-sdk`

// Login
// gcloud auth login

// Create and Set Project
// gcloud projects create EXAMPLE_PLUGIN_PROJECT
// gcloud config set project EXAMPLE_PLUGIN_PROJECT

// Create PubSub Topic
// gcloud pubsub topics create SPLIT_2x2_TOPIC

// Deploy Invocation Handler
// gcloud functions deploy split-2x2-invocation-handler \
//   --gen2 \
//   --runtime=nodejs20 \
//   --region=us-west1 \
//   --source=. \
//   --entry-point=split2x2InvocationHandler \
//   --trigger-http \
//   --allow-unauthenticated \
//   --timeout=540

// Deploy Async Processing Function
// gcloud functions deploy split-2x2-process-async \
//   --trigger-topic=SPLIT_2x2_TOPIC \
//   --gen2 \
//   --runtime=nodejs20 \
//   --region=us-west1 \
//   --source=. \
//   --entry-point=split2x2ProcessAsync \
//   --timeout=540
