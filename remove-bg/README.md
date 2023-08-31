# Playbook Plugin Remove BG Example 
This plugin example shows an application that makes a call to an external API (remove.bg), removes the background for an asset, and saves the asset back to Playbook.

For more information about Playbook and Plugins, go [here](https://playbookteam.notion.site/Welcome-to-Playbook-s-Beta-Developer-Program-dc78d1e6321c4dbf949889b1b9d3aa6b)


## Running locally



## Deploying on GCP

see here for more detailed instructions on deploying to GCP


### Deploy Invocation Handler
```
 gcloud functions deploy remove-bg-invocation-handler \
   --gen2 \
   --runtime=nodejs20 \
   --region=us-west1 \
   --source=. \
   --entry-point=removeBgInvocationHandler \
   --trigger-http \
   --allow-unauthenticated \
   --timeout=540
```

### Deploy async processing cloud function
```
 gcloud functions deploy remove-bg-async \
   --trigger-topic=REMOVE_BG_TOPIC \
   --gen2 \
   --runtime=nodejs20 \
   --region=us-west1 \
   --source=. \
   --entry-point=removeBgAsync \
   --timeout=540
```

remember to set the environment variable of your google cloud function with your API Key!