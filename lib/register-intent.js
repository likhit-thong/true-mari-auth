
'use strict'

const {
  SignIn ,
  Image ,
  SimpleResponse ,
  BasicCard ,
  Button
} = require('actions-on-google')
const {verifyAuthToken} = require('./verify-token')

function registerAuthIntent(intentMap = new Map() , agent ) {
  /** Get Permission */
  intentMap.set('Start Signin' , () => {
    let conv = agent.conv() ;
    conv.ask(new SignIn('To personalize'))
    agent.add(conv)
  })
  intentMap.set('Get Signin' , () => {
      let conv = agent.conv()
      conv.ask('ยืนยันตัวตนเสร็จแล้วค่ะ ให้มะลิบริการอะไรดีคะ')
      agent.add(conv)
  })
  intentMap.set('register-required-intent' , () => {
      let conv = agent.conv()
      conv.ask(new SimpleResponse({
          text : 'ขออภัยค่ะ คุณยังไม่ได้ลงทะเบียนใช้งาน คุณต้องลงทะเบียนก่อน "โอเคร" ไหม' ,
          speech : 'ขออภัยค่ะ คุณยังไม่ได้ลงทะเบียนใช้งาน คุณต้องลงทะเบียนก่อน ok ไหม'
      }))
      agent.add(conv)
  })
  intentMap.set('cfm-no-register-intent' , () => {
      let conv = agent.conv()
      conv.ask('โอเคค่ะ ให้มะลิบริการอะไรดีคะ')
      agent.add(conv)
  })
  intentMap.set('cfm-yes-register-intent' , async () => {
      let conv = agent.conv()
      let auth = await verifyAuthToken(conv.user.profile.token)
      conv.ask(new SimpleResponse({
          text : 'โอเครค่ะ กรุณากดปุ่มด้านล่างเพื่อทำการลงทะเบียน ได้เลยค่ะ',
          speech : 'โอเครค่ะ กรุณากดปุ่มด้านล่างเพื่อทำการลงทะเบียน ได้เลยค่ะ'
      }))
      conv.close(new BasicCard({
          text: '\n',
          title: "",
          buttons: new Button({
              title: 'ลงทะเบียน',
              url: `${process.env.URL_REGISTER_WEB}/${auth.email}` ,
          }),
          display: "CROPPED"
      }))
      agent.add(conv)
  })
}

exports.registerAuthIntent = registerAuthIntent