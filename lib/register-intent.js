
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
    conv.ask(new SignIn())
    agent.add(conv)
  })
  intentMap.set('Get Signin' , () => {
      let conv = agent.conv()
      conv.ask('มะลิทำการตรวจสอบสิทธิ์การใช้บริการเรียบร้อยแล้วค่ะ ให้มะลิบริการอะไรดีคะ')
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
      conv.ask('ไม่เป็นไรค่ะ คุณสามารถสอบถามบริการพื้นฐาน กับมะลิได้นะคะ')
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
  intentMap.set('token-fail-intent' , () => {
    let conv = agent.conv()
    conv.close('ขออภัยค่ะ แอฟไม่ตอบสนอง กรุณาเข้าใช้งานใหม่อีกครั้งนะคะ')
    agent.add(conv) ;
  })
  
}

exports.registerAuthIntent = registerAuthIntent