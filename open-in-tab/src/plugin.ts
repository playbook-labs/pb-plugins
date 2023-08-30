import {
  PlaybookAPI,
} from "./lib";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default async function ({
  pluginInvocationToken,
  callbackUrl,
  assets,
}: PluginInvocationParams) {
  console.log("invoked plugin");

  const playbookAPI = new PlaybookAPI({
    pluginInvocationToken,
    callbackUrl,
  });

  const inputAsset = assets[0];

  console.log("sleeping on", inputAsset.token)

  await sleep(10_000)

  console.log("awake");

  playbookAPI.reportStatus("success");

  console.log("done");
}
