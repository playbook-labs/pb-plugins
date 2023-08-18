const axios = require("axios")

module.exports = async (req, res) => {
  const { pluginInvocationToken, assets, callbackUrl } = req.body

  console.log("Invoking removeBg plugin", pluginInvocationToken)

  let status = "success"

  // assets is always an array, if you limit your plugin to a single asset, you can avoid this loop

  const assetsToCreate = assets.map((asset) => {
    const { title } = asset

    return {
      title: `${title} - no background`,
      group: "new",
    }
  })

  const createdAssets = await axios({
    method: "post",
    url: callbackUrl,
    data: {
      pluginInvocationToken,
      operation: "createAssets",
      assets: assetsToCreate,
    },
  })

  const promises = assets.map(async (asset, index) => {
    const { url } = asset
    const { uploadUrl } = createdAssets.data.assets[index]
    console.log("about to hit remove bg ", index)
    return axios({
      method: "post",
      url: "https://api.remove.bg/v1.0/removebg",
      headers: { "X-Api-Key": process.env.REMOVE_BG_API_KEY },
      responseType: "arraybuffer",
      data: {
        image_url: url,
        size: "full",
        format: "png",
      },
    }).then((removeBgResponse) => {
      console.log("about to upload ", index)
      return axios({
        method: "put",
        headers: { "Content-Type": "image/png" },
        url: uploadUrl,
        data: removeBgResponse.data,
      }).then(() => {
        console.log("uploaded ", index)
      })
    })
  })

  try {
    await Promise.all(promises)
  } catch (error) {
    console.log(error)
    status = "failure"
  }

  console.log("status: ", status)

  await axios({
    method: "post",
    url: callbackUrl,
    data: {
      pluginInvocationToken,
      status,
    },
  })

  // Return 200 so Playbook does not retry
  res.status(200).send()
}
