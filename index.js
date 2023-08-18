const functions = require('@google-cloud/functions-framework')

const removeBgGroup = require('./functions/remove_bg_group')
const removeBgNewGroup = require('./functions/remove_bg_new_group')

require('dotenv').config()

functions.http('removeBgGroup', removeBgGroup)
functions.http('removeBgNewGroup', removeBgNewGroup)