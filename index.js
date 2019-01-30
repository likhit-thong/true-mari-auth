
'use strict'

const {verifyAuthToken} = require('./lib/verify-token')
const {requirePermissionAccess} = require('./lib/permission-access')

exports.verifyAuthToken = verifyAuthToken
exports.requirePermissionAccess = requirePermissionAccess 
