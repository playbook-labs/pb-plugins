import {
  PlaybookAPI,
  downloadFileToBuffer,
  uploadBufferToUrl
} from "./lib";
import sharp from "sharp";

const outputs = [
  {
    name: "top left",
    leftOffset: 0,
    topOffset: 0,
  },
  {
    name: "top right",
    leftOffset: 0.5,
    topOffset: 0,
  },
  {
    name: "bottom left",
    leftOffset: 0,
    topOffset: 0.5,
  },
  {
    name: "bottom right",
    leftOffset: 0.5,
    topOffset: 0.5,
  },
];

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
  const inputImageBuffer = await downloadFileToBuffer(inputAsset.url);

  console.log("loaded input asset");

  const { width, height } = await sharp(inputImageBuffer).metadata();
  console.log("size", width, height);

  if (!width || !height || width < 2 || height < 2) {
    console.log("failure", width, height);
    playbookAPI.reportStatus("failure");
    return;
  }

  const skeletonAssets = await playbookAPI.createSkeletonAssets(
    outputs.map((output) => ({
      title: `${inputAsset.title} - ${output.name}`,
      group: inputAsset.token,
    }))
  );

  console.log("created skeleton assets");

  for (let i = 0; i < outputs.length; i++) {
    const outputImageBuffer = await sharp(inputImageBuffer)
      .extract({
        left: outputs[i].leftOffset * width,
        top: outputs[i].topOffset * height,
        width: width / 2,
        height: height / 2,
      })
      .toBuffer();

    console.log(`processed image ${i+1} with sharp`);

    await uploadBufferToUrl(outputImageBuffer, skeletonAssets[i].uploadUrl);

    console.log(`uploaded image ${i+1}`);
  }

  playbookAPI.reportStatus("success");

  console.log("done");
}
