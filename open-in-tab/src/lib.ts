// Helper functions to work with the Playbook API

import axios from "axios";

export async function downloadFileToBuffer(url: string): Promise<Buffer> {
  const response = await axios({
    url: url,
    responseType: "arraybuffer",
  });
  return response.data;
}

export async function uploadBufferToUrl(
  buffer: Buffer,
  uploadUrl: string
): Promise<void> {
  await axios({
    method: "put",
    headers: { "Content-Type": "image/png" },
    url: uploadUrl,
    data: buffer,
  });
}

export class PlaybookAPI {
  callbackUrl: string;
  pluginInvocationToken: string;

  constructor({
    pluginInvocationToken,
    callbackUrl,
  }: PlaybookAPIConstructorParams) {
    this.callbackUrl = callbackUrl;
    this.pluginInvocationToken = pluginInvocationToken;
  }

  // Create skeleton assets (assets with no data, only titles).
  // After the assets are created, fill in their file data by
  // uploading to the `uploadUrl` in the response.
  async createSkeletonAssets(
    assets: CreateSkeletonAssetType[]
  ): Promise<SkeletonAssetType[]> {
    const response = await axios({
      method: "post",
      url: this.callbackUrl,
      data: {
        pluginInvocationToken: this.pluginInvocationToken,
        operation: "createAssets",
        assets,
      },
    });
    return response.data.assets;
  }

  // Always call this at the end of your plugin's run to mark
  // the invocation as complete
  async reportStatus(status: "success" | "failure") {
    await axios({
      method: "post",
      url: this.callbackUrl,
      data: {
        pluginInvocationToken: this.pluginInvocationToken,
        status,
      },
    });
  }
}
