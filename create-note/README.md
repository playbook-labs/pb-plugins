# Extract Text to Note (Playbook Plugin)

This example shows using [tesseract.js](https://github.com/naptha/tesseract.js) to extract text from an image and create a new in note Playbook with that text.

For more information about Playbook and Plugins, check out our [wiki](https://playbookteam.notion.site/Welcome-to-Playbook-s-Beta-Developer-Program-dc78d1e6321c4dbf949889b1b9d3aa6b).

## Deploying on Google Cloud

See [How to Deploy your Plugin using Google Cloud Functions](https://www.notion.so/playbookteam/How-to-Deploy-your-Plugin-using-Google-Cloud-Functions-1fe3a5c98bd3449aa2406d6f2bc7d8ca?pvs=4) to deploy through the UI, or read on to deploy using the CLI.

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
gcloud pubsub topics create EXTRACT_TEXT_PUBSUB

# Deploy Invocation Handler
gcloud functions deploy extract-text-http \
  --gen2 \
  --runtime=nodejs20 \
  --region=us-west1 \
  --source=. \
  --entry-point=extractTextHttp \
  --trigger-http \
  --allow-unauthenticated \
  --timeout=540

# Deploy Async Processing Function
gcloud functions deploy extract-text-pub-sub \
  --trigger-topic=EXTRACT_TEXT_PUBSUB \
  --gen2 \
  --runtime=nodejs20 \
  --region=us-west1 \
  --source=. \
  --entry-point=extractTextPubSub \
  --timeout=540
```