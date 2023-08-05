const axios = require('axios')
const functions = require('@google-cloud/functions-framework')

require('dotenv').config()

functions.http('removeBgHTTP', async (req, res) => {
  const { pluginInvocationToken, assets, callbackUrl } = req.body
  const { url, title } = assets[0]

  console.log('Invoking removeBg plugin', pluginInvocationToken)

  try {
    const removeBgCall = axios({
      method: 'post',
      url: 'https://api.remove.bg/v1.0/removebg',
      headers: { 'X-Api-Key': process.env.REMOVE_BG_API_KEY },
      responseType: 'arraybuffer',
      data: {
        image_url: url,
        size: 'full',
        format: 'png',
      },
    })

    const createAssetsCall = axios({
      method: 'post',
      url: callbackUrl,
      data: {
        pluginInvocationToken,
        operation: 'createAssets',
        assets: [
          {
            title: `${title} - no background`,
            type: 'png',
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
      method: 'put',
      headers: { 'Content-Type': 'image/png' },
      url: uploadUrl,
      data: removeBgResponse.data,
    })

    await axios({
      method: 'post',
      url: callbackUrl,
      data: {
        pluginInvocationToken,
        status: 'success',
      },
    })
  } catch (error) {
    console.log(error)
    await axios({
      method: 'post',
      url: callbackUrl,
      data: {
        pluginInvocationToken,
        status: 'error',
      },
    })
  }

  console.log('success')

  // Return 200 so Playbook does not retry
  res.status(200).send()
})
