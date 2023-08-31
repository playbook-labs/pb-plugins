# Remove BG (Playbook Plugin)
This plugin example shows an application that makes a call to an external API (remove.bg), removes the background for an asset, and saves the asset back to Playbook.


For more information about Playbook and Plugins, check out our [wiki](https://playbookteam.notion.site/Welcome-to-Playbook-s-Beta-Developer-Program-dc78d1e6321c4dbf949889b1b9d3aa6b).

## Running locally

1. [Follow this guide](https://www.notion.so/playbookteam/Quickstart-How-to-build-a-Plugin-868719686cea43879e7b290472e7767f?pvs=4) to set up a Sandbox Plugin.
2. Create a [remove.bg](https://www.remove.bg/) account and generate an API key.
3. Run the server on port 3000:
  
   ```
   export REMOVE_BG_API_KEY=xxxx
   yarn dev
   ```

4. Install [ngrok](https://ngrok.com/docs/getting-started/) and run it to generate a public Forwarding URL for your local server:

   ```ngrok http 3000 --subdomain=remove-bg-example```

5. On the Plugins tab at https://www.playbook.com/account, edit your Plugin Invocation URL to your ngrok Forwarding URL.

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
gcloud pubsub topics create REMOVE_BG_TOPIC

# Deploy Invocation Handler
 gcloud functions deploy remove-bg-invocation-handler \
   --gen2 \
   --runtime=nodejs20 \
   --region=us-west1 \
   --source=. \
   --entry-point=removeBgInvocationHandler \
   --trigger-http \
   --allow-unauthenticated \
   --timeout=540

# Deploy Async Processing Function
 gcloud functions deploy remove-bg-async \
   --trigger-topic=REMOVE_BG_TOPIC \
   --gen2 \
   --runtime=nodejs20 \
   --region=us-west1 \
   --source=. \
   --entry-point=removeBgAsync \
   --timeout=540
```

Set the environment variable of your google cloud function with your API Key:

<img width="572" alt="Screenshot 2023-08-30 at 5 46 49 PM" src="https://github.com/playbook-labs/pb-plugins/assets/1311091/294ed09f-8919-40c6-afb6-57237123970a">
