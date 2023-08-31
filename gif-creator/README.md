# GIF Creator (Playbook Plugin)
This plugin example is a GIF creator that takes multiple assets and stitches them together into a GIF. It can be run locally as well as deployed on AWS API Gateway and Lambda.

For more information about Playbook and Plugins, check out our [wiki](https://playbookteam.notion.site/Welcome-to-Playbook-s-Beta-Developer-Program-dc78d1e6321c4dbf949889b1b9d3aa6b).
## Running locally

1. [Follow this guide](https://www.notion.so/playbookteam/Quickstart-How-to-build-a-Plugin-868719686cea43879e7b290472e7767f?pvs=4) to set up a Sandbox Plugin.
2. Run the server on port 3000:
  
   ```yarn dev```
3. Install [ngrok](https://ngrok.com/docs/getting-started/) and run it to generate a public Forwarding URL for your local server:

   ```ngrok http 3000 --subdomain=gif-creator-example```

4. On the Plugins tab at https://www.playbook.com/account, edit your Plugin Invocation URL to your ngrok Forwarding URL.

![Screenshot 2023-08-29 at 2 56 40 PM](https://github.com/playbook-labs/playbook-plugin-aws-example/assets/1311091/03db0ace-6e34-406f-b429-5d6d463d7d08)

## Deploying on AWS 

Requirements
- An AWS account with CLI configured
- Docker

### Step 1. Build the docker image

```docker build -t gif-creator .```

### Step 2. Upload to ECR 
```
docker tag <image_tag> xxx.dkr.ecr.us-east-2.amazonaws.com/<ecr_repo>:plugin-latest
docker push xxx.dkr.ecr.us-east-2.amazonaws.com/<ecr_repo>:plugin-latest
```

### Step 3. Set up AWS Lambda + API Gateway

Follow [How to Deploy your Plugin using AWS Lambda](https://www.notion.so/playbookteam/How-to-Deploy-your-Plugin-using-AWS-Lambda-08119e7db92c4419978d38752585d429?pvs=4) to get set up.


