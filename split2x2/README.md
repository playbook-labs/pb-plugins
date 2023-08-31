# Split 2x2 (Playbook Plugin)

An example plugin that splits a 2x2 gallery-style image into 4 separate images.

## Development

Edit `src/plugin.mjs` to change the behavior of the plugin.

Development works out of the box with a Node server and ngrok.

```
yarn dev # starts a server listening at localhost:3000

ngrok http 3000 # exposes port 3000 to the internet, giving you a public invocation URL
```

When you create your Sandbox plugin from https://www.playbook.com/account, set your
`ngrok` URL as the invocation URL. You can develop your plugin by triggering it from
your Playbook workspace with any test files you've uploaded.

## Deploying on Google Cloud

Set up a google cloud account and set up billing
Currently offering $300 free -> https://cloud.google.com/free/docs/gcp-free-tier

Install Google Cloud SDK
https://cloud.google.com/sdk/docs/install or `brew install google-cloud-sdk`

```bash
# Login
gcloud auth login

# Create and Set Project
gcloud projects create EXAMPLE_PLUGIN_PROJECT
gcloud config set project EXAMPLE_PLUGIN_PROJECT

# Create PubSub Topic
gcloud pubsub topics create SPLIT_2x2_TOPIC

# Deploy Invocation Handler
gcloud functions deploy split-2x2-invocation-handler \
  --gen2 \
  --runtime=nodejs20 \
  --region=us-west1 \
  --source=. \
  --entry-point=split2x2InvocationHandler \
  --trigger-http \
  --allow-unauthenticated \
  --timeout=540

# Deploy Async Processing Function
gcloud functions deploy split-2x2-process-async \
  --trigger-topic=SPLIT_2x2_TOPIC \
  --gen2 \
  --runtime=nodejs20 \
  --region=us-west1 \
  --source=. \
  --entry-point=split2x2ProcessAsync \
  --timeout=540
```