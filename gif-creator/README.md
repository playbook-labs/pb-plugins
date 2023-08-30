# Playbook Plugin Example on AWS
This plugin example is a GIF creator that takes multiple assets and stitches them together into a GIF. It can be run locally as well as deployed on AWS API Gateway and Lambda.

For more information about Playbook and Plugins, go [here](https://playbookteam.notion.site/Welcome-to-Playbook-s-Beta-Developer-Program-dc78d1e6321c4dbf949889b1b9d3aa6b)

## Architecture

Playbook plugins in production require an invocation handler and a processing step. 

For local dev, we use a lightweight express server that calls our processing code asynchronously (using ngrok to expose the endpoint to Playbook)


![Screenshot 2023-08-29 at 3 23 18 PM](https://github.com/playbook-labs/playbook-plugin-aws-example/assets/1311091/6ae07cad-afb2-46ee-8263-9d5b7bab9ac3)


For Production, we deploy an API using AWS API Gateway, which can asynchronously call the processing step via a Lambda function


![Screenshot 2023-08-29 at 3 22 17 PM](https://github.com/playbook-labs/playbook-plugin-aws-example/assets/1311091/84ac8898-3f50-44f8-b48a-a1c3c44ad666)


## Testing locally

Requirements
- `node`
- `ngrok` you will need to sign up for a free account

### Step 1. Follow the sandbox instructions ([here](https://playbookteam.notion.site/Quickstart-How-to-build-a-Plugin-868719686cea43879e7b290472e7767f)) to get started with a playbook plugin
- For this plugin, be sure to set the maximum number of assets to something high

### Step 2. run the server 

```yarn dev```

This will start the server on port 3000

### Step 3. run ngrok

In order for the Playbook app to hit your plugin locally, you need to make it discoverable. You can use `ngrok` to get a public invocation url

```ngrok http 3000 --subdomain=gif-creator-example```

### Step 4. Edit your plugin invocation url to your ngrok url

![Screenshot 2023-08-29 at 2 56 40 PM](https://github.com/playbook-labs/playbook-plugin-aws-example/assets/1311091/03db0ace-6e34-406f-b429-5d6d463d7d08)

## Deploying on AWS 

Requirements
- an AWS account with cli configured
- Docker

### Step 1. Build the docker image

```docker build -t gif-creator .```

### Step 2. Upload to ECR 
```
docker tag <image_tag> xxx.dkr.ecr.us-east-2.amazonaws.com/<ecr_repo>:plugin-latest
docker push xxx.dkr.ecr.us-east-2.amazonaws.com/<ecr_repo>:plugin-latest
```

### Step 3. Set up AWS Infra to get an API that calls an async Lambda

Follow instructions [here](https://playbookteam.notion.site/Plugin-Examples-92cbcc68bf1a43ef8db40889a62836cb#541df81cc2344e8e9e118c91d217ba0a) to get set up

### Step 4. Edit the invocation url of your plugin to be the url of your AWS API


