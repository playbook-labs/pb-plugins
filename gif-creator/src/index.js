import { createGif } from "./createGif.js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// Handler
export async function handler(event, context) {
  const pluginInvocationToken = event.pluginInvocationToken;
  const callbackUrl = event.callbackUrl;

  const assetUrls = event.assets.map((asset) => asset.url);
  const gifBuffer = await createGif(assetUrls);

  const callbackResponse = await createAsset(
    callbackUrl,
    pluginInvocationToken,
    uuidv4() + ".gif"
  );

  const uploadUrl = callbackResponse.data.assets[0].uploadUrl;

  await uploadImage(uploadUrl, gifBuffer);
  reportStatus(callbackUrl, pluginInvocationToken, "success");

  return;
}

async function createAsset(callbackUrl, pluginInvocationToken, title) {
  return await axios.post(callbackUrl, {
    pluginInvocationToken: pluginInvocationToken,
    operation: "createAssets",
    assets: [
      {
        group: null,
        title: title,
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
