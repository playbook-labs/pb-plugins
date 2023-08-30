import axios from "axios"

// This is the function that will be called by Playbook when your plugin is invoked
export default async (req, res) => {
  // These are the parameters that Playbook will send to your plugin
  // you'll create a new request to `callbackUrl` and pass back `pluginInvocationToken`
  // `assets` is an array of assets that your plugin will operate on
  const { pluginInvocationToken, assets, callbackUrl } = req.body
  console.log("Invoking removeBg plugin", pluginInvocationToken)

  // Don't store API keys in your source code! Use environment variables
  const removeBGAPIKey = process.env.REMOVE_BG_API_KEY

  // We'll use this status to tell Playbook if the plugin succeeded or failed
  let status = "success"

  // assets is always an array, but if you limit your plugin to a single asset
  // then you can avoid loops by grabbing the first (and only) input asset
  const asset = assets[0]

  // These are the fields we are interested in on the asset
  const { url, title, token } = asset

  // Errors happen, so we'll wrap our code in a try/catch block
  try {
    // We'll use axios to make our API calls
    // We'll make two calls in parallel, so we'll use Promise.all to wait for both to finish

    // https://www.remove.bg/api#remove-background
    const removeBgCall = axios({
      method: "post",
      url: "https://api.remove.bg/v1.0/removebg",
      headers: { "X-Api-Key": removeBGAPIKey },
      responseType: "arraybuffer",
      data: {
        image_url: url,
        size: "full",
        format: "png",
      },
    })

    // We'll need to create a placeholder asset we'll upload to
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

    // We've defined both of our API calls above and we're ready to make them
    const [removeBgResponse, createAssetsResponse] = await Promise.all([
      removeBgCall,
      createAssetsCall,
    ])

    console.log("created our asset and got remove.bg response")

    // We'll need to upload the image to the asset Playbook created for us
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

  // Tell playbook you received the invocation! Don't leave use hanging!
  res.status(200).send()
}
