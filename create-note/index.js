const functions = require("@google-cloud/functions-framework")
const axios = require("axios")
const Tesseract = require("tesseract.js")

const publishMessage = require("./helpers/publish")

functions.http("extractTextHttp", async (req, res) => {
  await publishMessage("EXTRACT_TEXT_PUBSUB", JSON.stringify(req.body))

  res.status(200).send("OK")
})

functions.cloudEvent("extractTextPubSub", async (cloudEvent) => {
  // The Pub/Sub message is passed as the CloudEvent's data payload.
  const body = JSON.parse(
    Buffer.from(cloudEvent.data.message.data, "base64").toString()
  )

  const { pluginInvocationToken, assets, callbackUrl } = body

  console.log("Invoking extract text plugin", pluginInvocationToken)

  try {
    const asset = assets[0]
    const { title, url } = asset
    const { data } = await Tesseract.recognize(url, "eng")

    await axios({
      method: "post",
      url: callbackUrl,
      data: {
        pluginInvocationToken,
        operation: "createAssets",
        status: "success",
        assets: [
          {
            title: title + " - text",
            group: asset.token,
            type: "note",
            value: data.text,
          },
        ],
      },
    })
  } catch {
    await axios({
      method: "post",
      url: callbackUrl,
      data: {
        pluginInvocationToken,
        status: "failed",
      },
    })
  }

  console.log("finished")
})
