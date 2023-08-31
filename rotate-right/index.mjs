// Deployment using Google Cloud Functions.
// We need two functions:
//   - Function A to handle the HTTP request, kick off Function B, and return immediately
//   - Function B to do the actual work asynchronously
//
// Google Cloud Deployment instructions at the bottom of this file

import functions from '@google-cloud/functions-framework';
import { PubSub } from '@google-cloud/pubsub';
import plugin from './src/plugin.mjs';

// This is the function that will be called by Playbook when the plugin is invoked.
// All it does is enqueue a separate job to process the assets and returns 200 OK
functions.http('rotateRightInvocationHandler', async (req, res) => {
  // We use pubsub to enqueue a job to process the assets
  const dataBuffer = Buffer.from(JSON.stringify(req.body));
  await new PubSub()
    .topic('ROTATE_RIGHT_TOPIC')
    .publishMessage({ data: dataBuffer });

  // Return quickly so we don't run into an HTTP timeout
  res.status(200).send('OK');
});

// This function does the actual work of the plugin asynchronously
functions.cloudEvent('rotateRightProcessAsync', async (cloudEvent) => {
  const body = JSON.parse(Buffer.from(cloudEvent.data.message.data, 'base64').toString());

  console.log('data', cloudEvent.data.message.data);
  console.log('body', body);

  const { pluginInvocationToken, assets, callbackUrl } = body;

  plugin({ pluginInvocationToken, assets, callbackUrl });
});
