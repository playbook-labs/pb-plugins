# Running locally

`npx @google-cloud/functions-framework --target=removeBgHTTP --port 8085`

This will run the cloud function locally at the given port. Use this as your plugin_invocation_url. If running in dip you need to use `http://host.docker.internal:8085/`

Use ngrok to allow tunneling to your local machine.

# Set up

```
gcloud config set project brandify-251201
```

# Deploying

```
gcloud functions deploy remove-bg-http \
  --gen2 \
  --runtime=nodejs20 \
  --region=us-west1 \
  --source=. \
  --entry-point=removeBgHTTP \
  --trigger-http \
  --allow-unauthenticated
```