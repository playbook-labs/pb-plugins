import {
  PlaybookAPI,
} from "./lib";

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

  await playbookAPI.openUrl(inputAsset.url)
  await playbookAPI.reportStatus("success");

  console.log("Done");
}
