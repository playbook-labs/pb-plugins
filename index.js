const functions = require('@google-cloud/functions-framework')

const publishMessage = require('./functions/helpers/publish')

const removeBgSingleAssetGroup = require('./functions/remove_bg_single_asset_group')
const removeBgMultiAssetNewGroup = require('./functions/remove_bg_multi_asset_new_group')
const removeBgPubSub = require('./functions/remove_bg_pubsub')

require('dotenv').config()

functions.http('removeBgSingleAssetGroup', removeBgSingleAssetGroup)
functions.http('removeBgMultiAssetNewGroup', removeBgMultiAssetNewGroup)

functions.http('removeBgHttp', async (req, res) => {
  await publishMessage('REMOVE_BG_PUBSUB', JSON.stringify(req.body))

  res.status(200).send('OK')
})

functions.cloudEvent('removeBgPubSub', removeBgPubSub)