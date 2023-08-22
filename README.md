# Playbook Plugins

### What is Playbook?

[Playbook](https://www.playbook.com) is the coolest way to organize, share, and collaborate on creative files and projects with your clients and team.

### What is a Playbook Plugin?

A plugin is a little bit of functionality that allows a third party developer to add extra functionality to the Playbook platform. Playbook has a beta plugin system that relies on webhooks. A plugin defines an `invocation_url` that can accept API calls from playbook that allow a developer to download Playbook assets, synthesize new assets, then upload those new assets directly into the Playbook platform.

### That sounds sick, I want to build a plugin!

[Contact us](mailto:) to get involved in our beta developer program.

Let's start with a small amount of Playbook vocabulary:

- Asset: Basically a file plus its metadata.
- Group: A small collection of associated assets. Might be variations or different formats.
- Board: A larger group of assets. Might be all photos from a photoshoot, or all the illustrations to use for a marketing campaign.
- Playbook: A collection of boards and users with permissions to those boards. Could be a team, an organization or just a personal workspace.
- User: Nothing tricky here.

Now some specific plugin terms:

- Plugin: We already defined this above, pay attention.
- Plugin Invocation: When a user selects an asset and invokes the plugin, we create a record of this transaction. We'll use this token as an identifier so that Playbook and the plugin are on the same page.
- Callback Url: This is the url on Playbook that a plugin will make API calls to.

### What does it look like though?

A user can browse our directory and install a plugin to their playbook. Then any user in that Playbook can select 1 or more assets and invoke the plugin through the UI. Playbook will then call your invocation_url with data about the assets the user wants your plugin to act on. That API call looks like this:

### Invoke Plugin

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
      "type": ".jpeg",
    }
  ]
}
```

Great, now the plugin can download the file using the signed url and use that file for... well pretty much whatever you can think of. Our example plugin removes the background of images by calling out to [Remove.bg](https://www.remove.bg) and uploading the result to Playbook. In order to upload, a plugin first must request the creation of a new asset. We need a title for the new asset, and we (probably) want it grouped with source asset, so we pass that token back in the `group` field.


### Plugin requests creation of placeholder assets

Dev → Playbook

```json
{
  "pluginInvocationToken": "PAMwF9P8hxrCGvJJbUPU4zuj",
  "operationName": "createAssets",
	"assets": [
    {
      "group": "XNyx47LXJF4atgi9AYu3ceAy", -- group with input asset
      "title": "Fancy Picture of a Cat -- no background",
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

Awesome, so we have a signed upload url that we can upload our new asset to. We'll *do our special plugin work* and then upload that result to this url. Now we want the user to know that their new asset is ready, so we finalize by setting the status of the plugin invocation

Dev → Playbook

```json
{
  "pluginInvocationToken": "PAMwF9P8hxrCGvJJbUPU4zuj",
  "status": "success"
}
```

## What does the plugin system not do?

This plugin system should be considered Beta v1. We want to add more operations in the future, but for now we only support `createAssets`. Here are some things you might want to do, that you can't (yet)

- No updating existing assets.
- No parameters, plugins are invoked in a single button press.
- No creating new boards.

## I'm ready to write some code!

We are going to show some examples using Google Cloud Functions and NodeJS, but since the plugin system is implemented via webhooks, you can use any technology you'd like that can respond to an HTTP request (within 10 seconds!). All processing is done asynchronously.

You *can* do all your work within a single reb request, but you might timeout.


## Example plugins

You're on the repo right now. Our examples are all using Google Cloud Platform, but can be adapted to AWS lambda or self-hosted.

## Running locally

`npx @google-cloud/functions-framework --target=removeBgHTTP --port 8085`

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