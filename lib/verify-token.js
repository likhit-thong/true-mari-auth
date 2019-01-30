
'use strict'

const {OAuth2Client} = require('google-auth-library')

async function verifyAuthToken( token='' ){
  const client_id = process.env.GOOGLE_CLIENT_ID
  try{
    const client = new OAuth2Client(client_id)
    let tiket = await client.verifyIdToken({
      token : token ,
      audience : client_id
    })
    return tiket.getPayload() ;
  }catch(e){
    return null
  }
}

module.exports = {
  verifyAuthToken
}
