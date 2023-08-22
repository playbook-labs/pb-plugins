const axios = require("axios")

module.exports = async (cloudEvent) => {
  // The Pub/Sub message is passed as the CloudEvent's data payload.
  const body = JSON.parse(Buffer.from(cloudEvent.data.message.data, 'base64').toString())

  const { pluginInvocationToken, assets, callbackUrl } = body

  console.log("Invoking removeBg plugin", pluginInvocationToken)

  let status = "success"

  // assets is always an array, but if you limit your plugin to a single asset
  // then you can avoid loops by grabbing the first (and only) input asset
  const asset = assets[0]
  const { url, title, token } = asset

  try {
    const removeBgCall = axios({
      method: "post",
      url: "https://api.remove.bg/v1.0/removebg",
      headers: { "X-Api-Key": process.env.REMOVE_BG_API_KEY },
      responseType: "arraybuffer",
      data: {
        image_url: url,
        size: "full",
        format: "png",
      },
    })

    const createAssetsCall = axios({
      method: "post",
      url: callbackUrl,
      data: {
        pluginInvocationToken,
        operation: "createAssets",
        assets: [
          {
            title: `${title} - no background`,
            group: token,
          },
        ],
      },
    })

    // Resolve these both in parallel to be faster
    const [removeBgResponse, createAssetsResponse] = await Promise.all([
      removeBgCall,
      createAssetsCall,
    ])

    console.log("created our asset and got remove.bg response")

    const uploadUrl = createAssetsResponse.data.assets[0].uploadUrl

    await axios({
      method: "put",
      headers: { "Content-Type": "image/png" },
      url: uploadUrl,
      data: removeBgResponse.data,
    })

    console.log("uploaded to Playbook")
  } catch (error) {
    status = "failed"
    console.log(error)
  }

  // Ensure you have resolved all promises before updating status!
  // If you have outstanding unresolved promises your plugin users may see broken images
  await axios({
    method: "post",
    url: callbackUrl,
    data: {
      pluginInvocationToken,
      status,
    },
  })

  console.log("finished")
}
