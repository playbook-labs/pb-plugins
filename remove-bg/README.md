# Playbook Plugin Remove BG Example 
This plugin example shows an application that makes a call to an external API (remove.bg), removes the background for an asset, and saves the asset back to Playbook.

For more information about Playbook and Plugins, go [here](https://playbookteam.notion.site/Welcome-to-Playbook-s-Beta-Developer-Program-dc78d1e6321c4dbf949889b1b9d3aa6b)


## Running locally

`npx @google-cloud/functions-framework --target=removeBgHttp --port 8085`

This will run the cloud function locally at the given port. Use this as your plugin_invocation_url. If running in dip you need to use `http://host.docker.internal:8085/`

Use ngrok to allow tunneling to your local machine.

## Deploying

HTTP

```
gcloud functions deploy remove-bg-http-dev \
  --gen2 \
  --runtime=nodejs20 \
  --region=us-west1 \
  --source=. \
  --entry-point=removeBgHttp \
  --trigger-http \
  --allow-unauthenticated \
  --timeout=540
```

PubSub

`gcloud pubsub topics create REMOVE_BG_PUBSUB`

```
gcloud functions deploy remove-bg-pub-sub \
  --trigger-topic=REMOVE_BG_PUBSUB \
  --gen2 \
  --runtime=nodejs20 \
  --region=us-west1 \
  --source=. \
  --entry-point=removeBgPubSub \
  --timeout=540
```