
'use strict'

const {verifyAuthToken} = require('./lib/verify-token')
const {requirePermissionAccess} = require('./lib/permission-access')
const {registerAuthIntent} = require('./lib/register-intent')

module.exports = { 
  registerAuthIntent ,
  verifyAuthToken ,
  requirePermissionAccess
}