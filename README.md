# Running locally

`npx @google-cloud/functions-framework --target=removeBgHTTP --port 8085`

This will run the cloud function locally at the given port. Use this as your plugin_invocation_url. If running in dip you need to use `http://host.docker.internal:8085/`

Use ngrok to allow tunneling to your local machine.

# Deploying

```
gcloud functions deploy remove-bg-http-dev \
  --gen2 \
  --runtime=nodejs20 \
  --region=us-west1 \
  --source=. \
  --entry-point=removeBgNewGroup \
  --trigger-http \
  --allow-unauthenticated \
  --timeout=600
```

# API

### Invoke Plugin

A user selects 1 or more assets and invokes the plugin. Playbook will then call your invocation_url with data about the assets the user wants your plugin to act on.

Playbook → Dev

```json

{
  "pluginInvocationToken": "PAMwF9P8hxrCGvJJbUPU4zuj",
  "callbackUrl": "https://be.playbook.com/plugins/v1/GXE3rNvUQM1DhDhxdpQekXqX",
  "operationName": "invokePlugin",
  "assets": [
    {
      "token": "XNyx47LXJF4atgi9AYu3ceAy",
      "url": "https://storage.googleapis.com/...",
      "title": "Fancy Picture of a Cat",
      "type": ".png",
    }
  ]
}
```

### Plugin requests creation of placeholder assets

Dev → Playbook

```json
{
  "pluginInvocationToken": "PAMwF9P8hxrCGvJJbUPU4zuj",
  "operationName": "createAssets",
	"assets": [
    {
      "group": "XNyx47LXJF4atgi9AYu3ceAy", -- group with input asset
      "title": "Fancy Picture of a Cat -- modified",
    }
  ]
}
```

Response from Playbook → Dev

```json
{
  "pluginInvocationToken": "PAMwF9P8hxrCGvJJbUPU4zuj",
  "operationName": "createAssets",
  "assets": [
    {
      "token": "PAMwF9P8hxrCGvJJbUPU4zuj",
      "title": "Fancy Picture of a Cat -- modified",
      "uploadUrl": "https://storage.googleapis.com/..."
    }
  ]
}
```

### Plugin downloads the input asset, modifies the asset and uploads to new placeholder asset

Finalize by setting status Dev → Playbook

```json
{
  "pluginInvocationToken": "PAMwF9P8hxrCGvJJbUPU4zuj",
  "status": "success"
}
```