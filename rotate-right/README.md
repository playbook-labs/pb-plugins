# Rotate Right (Playbook Plugin)

An example plugin that rotates PNGs right by 90°.

For more information about Playbook and Plugins, check out our [wiki](https://playbookteam.notion.site/Welcome-to-Playbook-s-Beta-Developer-Program-dc78d1e6321c4dbf949889b1b9d3aa6b).

Edit `src/plugin.mjs` to change the behavior of the plugin. Try making it rotate left!

## Running locally

1. [Follow this guide](https://www.notion.so/playbookteam/Quickstart-How-to-build-a-Plugin-868719686cea43879e7b290472e7767f?pvs=4) to set up a Sandbox Plugin.
2. Run the server on port 3000:
  
   ```
   yarn dev
   ```

3. Install [ngrok](https://ngrok.com/docs/getting-started/) and run it to generate a public Forwarding URL for your local server:

   ```ngrok http 3000 --subdomain=rotate-right```

4. On the Plugins tab at https://www.playbook.com/account, edit your Plugin Invocation URL to your ngrok Forwarding URL.

![Screenshot 2023-08-29 at 2 56 40 PM](https://github.com/playbook-labs/playbook-plugin-aws-example/assets/1311091/03db0ace-6e34-406f-b429-5d6d463d7d08)

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
gcloud pubsub topics create ROTATE_RIGHT_TOPIC

# Deploy Invocation Handler
 gcloud functions deploy rotate-right-invocation-handler \
   --gen2 \
   --runtime=nodejs20 \
   --region=us-west1 \
   --source=. \
   --entry-point=rotateRightInvocationHandler \
   --trigger-http \
   --allow-unauthenticated \
   --timeout=540

# Deploy Async Processing Function
 gcloud functions deploy rotate-right-process-async \
   --trigger-topic=ROTATE_RIGHT_TOPIC \
   --gen2 \
   --runtime=nodejs20 \
   --region=us-west1 \
   --source=. \
   --entry-point=rotateRightProcessAsync \
   --timeout=540
```
