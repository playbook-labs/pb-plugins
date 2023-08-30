import functions from '@google-cloud/functions-framework'

import publishMessage from './functions/helpers/publish.js'

import removeBgSingleAssetGroup from './functions/remove_bg_single_asset_group.js'
import removeBgMultiAssetNewGroup from './functions/remove_bg_multi_asset_new_group.js'
import removeBgPubSub from './functions/remove_bg_pubsub.js'


import dotenv from 'dotenv'
dotenv.config()

functions.http('removeBgSingleAssetGroup', removeBgSingleAssetGroup)
functions.http('removeBgMultiAssetNewGroup', removeBgMultiAssetNewGroup)

functions.http('removeBgHttp', async (req, res) => {
  await publishMessage('REMOVE_BG_PUBSUB', JSON.stringify(req.body))

  res.status(200).send('OK')
})

functions.cloudEvent('removeBgPubSub', removeBgPubSub)