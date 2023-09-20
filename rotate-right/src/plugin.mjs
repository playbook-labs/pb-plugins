import axios from 'axios';
import sharp from 'sharp';

export default async function ({ pluginInvocationToken, assets, callbackUrl }) {
  console.log('rotate', pluginInvocationToken, JSON.stringify(assets), callbackUrl);

  const inputAsset = assets[0];

  // Create a placeholder asset to upload the result to
  const createdAssets = (await axios({
    method: 'post',
    url: callbackUrl,
    data: {
      pluginInvocationToken,
      operation: 'createAssets',
      assets: [
        {
          title: `${inputAsset.title} - rotated`,
          group: inputAsset.token
        }
      ]
    }
  })).data.assets;

  console.log('created assets', JSON.stringify(createdAssets));

  // TODO: consider using https://github.com/sindresorhus/got, it has a simpler syntax:
  // const imageBuffer = await got(url).buffer();
  const inputImageBuffer = (
    await axios({
      url: inputAsset.url,
      responseType: 'arraybuffer'
    })
  ).data;

  console.log('loaded input asset');

  const outputImageBuffer = await sharp(inputImageBuffer).rotate(90).toBuffer();

  console.log('processed with sharp');

  await axios({
    method: 'put',
    headers: { 'Content-Type': 'image/png' },
    url: createdAssets[0].uploadUrl,
    data: outputImageBuffer
  });

  console.log('uploaded output asset');

  await axios({
    method: 'post',
    url: callbackUrl,
    data: {
      pluginInvocationToken,
      status: 'success'
    }
  });

  console.log('done');
}
