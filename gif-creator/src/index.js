import { createGif } from "./createGif.js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// Handler
export const handler =  async function (event, context) {
  console.log('Received event');
  const pluginInvocationToken = event.pluginInvocationToken;
  const callbackUrl = event.callbackUrl;
  try {

  const callbackResponse = await createAsset(
    callbackUrl,
    pluginInvocationToken,
    uuidv4() + ".gif"
  );
  console.log('created skeleton asset');

  const uploadUrl = callbackResponse.data.assets[0].uploadUrl;

  const assetUrls = event.assets.map((asset) => asset.url);
  const gifBuffer = await createGif(assetUrls);
  console.log('created gif');

  await uploadImage(uploadUrl, gifBuffer);
  console.log('uploaded gif');

  await reportStatus(callbackUrl, pluginInvocationToken, "success");
  console.log('reported success');

  return;
  } catch (error) {
    console.log('error: ', error);
    await reportStatus(callbackUrl, pluginInvocationToken, "failed");
    console.log('reported failure');
  }
}

async function createAsset(callbackUrl, pluginInvocationToken, title) {
  return await axios.post(callbackUrl, {
    pluginInvocationToken: pluginInvocationToken,
    operation: "createAssets",
    assets: [
      {
        group: null,
        title: title,
        mediaType: "image/gif"
      },
    ],
  });
}

async function uploadImage(uploadUrl, imageBuffer) {
  return await axios({
    method: "put",
    headers: { "Content-Type": "image/gif" },
    url: uploadUrl,
    data: imageBuffer,
  });
}
async function reportStatus(callbackUrl, pluginInvocationToken, status) {
  return await axios({
    method: "post",
    url: callbackUrl,
    data: {
      pluginInvocationToken,
      status,
    },
  });
}
