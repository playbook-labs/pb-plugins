import {
  PlaybookAPI,
  uploadBufferToUrl,
} from "./lib";

import axios from "axios";

export default async function ({
  pluginInvocationToken,
  callbackUrl,
  assets,
}: PluginInvocationParams) {
  console.log("Invoked plugin", callbackUrl);

  const playbookAPI = new PlaybookAPI({
    pluginInvocationToken,
    callbackUrl,
  });

  const inputAsset = assets[0];

  const inputBuffer = (await axios({ url: "https://img.playbook.com/BZ5cWTaMqd9tP1aTWKWr2Z8I1SI-lx6hI7U0p2EpBr0/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzE4MWI4YzZi/LTU1ZDctNDExZi1i/YTcyLTE4MTk5Mzkw/NGRlOA", responseType: "arraybuffer" })).data as Buffer;

  const response = await playbookAPI.generateAssetPreviewUrl(inputAsset.token, 1201, 1201);

  await uploadBufferToUrl(inputBuffer, response.data.previewUploadUrl)
  await playbookAPI.reportStatus("success");

  console.log("Done");
}
