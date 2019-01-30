
'use strict'

const {WebhookClient} = require('dialogflow-fulfillment') ,
      {verifyAuthToken} = require('./verify-token') ,
      User = require("mongoose").model("User")

function findUserByEmail(_email=''){
  return new Promise((resolve ,reject)=>{
    User.findOne({email : _email} , (err, user) => {
      if(err) reject(err)
      return resolve(user)
    })
  })
}

async function isRegistered(email=''){
  let result = {
    success: false ,
    data : null
  }
  try{
    let user = await findUserByEmail(email)
    if( ! user ){
      return result
    }else{
      result.success = true 
      result.data = user
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
              conv.add('ขออภัยค่ะ แอฟไม่ตอบสนอง กรุณาเข้าใช้งานใหม่อีกครั้งนะคะ')
              agent.add(conv) ;
              return ;
          }else{
              let isRegis = await isRegistered(profile.email)
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

