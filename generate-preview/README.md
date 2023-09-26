# Generate Preview (Playbook Plugin)

An example plugin that generates a preview for an asset. The asset cannot be an image, color, or note.

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
gcloud pubsub topics create GENERATE_PREVIEW_TOPIC

# Deploy Invocation Handler
gcloud functions deploy generate-preview-invocation-handler \
  --gen2 \
  --runtime=nodejs20 \
  --region=us-west1 \
  --source=. \
  --entry-point=generatePreviewInvocationHandler \
  --trigger-http \
  --allow-unauthenticated \
  --timeout=540

# Deploy Async Processing Function
gcloud functions deploy generate-preview-process-async \
  --trigger-topic=GENERATE_PREVIEW_TOPIC \
  --gen2 \
  --runtime=nodejs20 \
  --region=us-west1 \
  --source=. \
  --entry-point=generatePreviewProcessAsync \
  --timeout=540
```