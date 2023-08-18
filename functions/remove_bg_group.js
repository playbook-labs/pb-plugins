const axios = require("axios")

module.exports = async (req, res) => {
  const { pluginInvocationToken, assets, callbackUrl } = req.body

  console.log("Invoking removeBg plugin", pluginInvocationToken)

  let status = "success"

  // assets is always an array, if you limit your plugin to a single asset, you can avoid this loop
  await assets.forEach(async (asset) => {
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
              group: token
            },
          ],
        },
      })

      // Resolve these both in parallel to be faster
      const [removeBgResponse, createAssetsResponse] = await Promise.all([
        removeBgCall,
        createAssetsCall,
      ])

      const uploadUrl = createAssetsResponse.data.assets[0].uploadUrl

      await axios({
        method: "put",
        headers: { "Content-Type": "image/png" },
        url: uploadUrl,
        data: removeBgResponse.data,
      })
    } catch (error) {
      status = "failure"
      console.log(error)
    }
  })

  await axios({
    method: "post",
    url: callbackUrl,
    data: {
      pluginInvocationToken,
      status,
    },
  })

  console.log("success")

  // Return 200 so Playbook does not retry
  res.status(200).send()
}
