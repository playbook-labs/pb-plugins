const functions = require('@google-cloud/functions-framework')

const removeBgSingleAssetGroup = require('./functions/remove_bg_single_asset_group')
const removeBgMultiAssetNewGroup = require('./functions/remove_bg_multi_asset_new_group')

require('dotenv').config()

functions.http('removeBgSingleAssetGroup', removeBgSingleAssetGroup)
functions.http('removeBgMultiAssetNewGroup', removeBgMultiAssetNewGroup)