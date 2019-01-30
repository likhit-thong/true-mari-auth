
'use strict'

const {WebhookClient} = require('dialogflow-fulfillment') ,
      {verifyAuthToken} = require('./verify-token')

      

function isRegistered(email=''){
  let result = {success: false ,data : null} ,
      email_demo = process.env.EMAIL_DEMO || 'demo@gmail.com'
  try{
    if( email == email_demo ){
      result.success = true 
      result.data = user
      return result
    }else{
      return result
    }

  }catch(e){
    return result
  }
}

async function requirePermissionAccess( agent=new WebhookClient({request:new Request , response : new Response()})){
  let ctx_authorized = agent.context.get('ctx_authorized')
  if( !ctx_authorized ){
      let conv = agent.conv()
      let token =  conv.user.profile.token
      if(token){
          let profile = await verifyAuthToken(token)
          if(!profile){
            agent.setFollowupEvent('evt_token_fail')
          }else{
              let isRegis = isRegistered(profile.email)
              if( isRegis.success ){
                  agent.context.set({
                      name : 'ctx_authorized' ,
                      lifespan : 99 ,
                      parameters: {
                          profile : profile
                      }
                  }) ;
                  return ;
              }else{
                  agent.setFollowupEvent('evt_ask_for_register')
              }
          }
      }else{
          agent.setFollowupEvent('evt_start_signin')
      }
  }else{
      console.log('>>> Authorized !!')
      return ;
  }   
}

module.exports = {
  requirePermissionAccess
}