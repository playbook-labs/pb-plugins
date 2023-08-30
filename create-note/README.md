# Extract Text to Note

This example shows using [tesseract.js](https://github.com/naptha/tesseract.js) to extract text from an image and create a new in note Playbook with that text.

## Deploying

HTTP

```
gcloud functions deploy extract-text-http \
  --gen2 \
  --runtime=nodejs20 \
  --region=us-west1 \
  --source=. \
  --entry-point=extractTextHttp \
  --trigger-http \
  --allow-unauthenticated \
  --timeout=540
```

PubSub

`gcloud pubsub topics create EXTRACT_TEXT_PUBSUB`

```
gcloud functions deploy extract-text-pub-sub \
  --trigger-topic=EXTRACT_TEXT_PUBSUB \
  --gen2 \
  --runtime=nodejs20 \
  --region=us-west1 \
  --source=. \
  --entry-point=extractTextPubSub \
  --timeout=540
```