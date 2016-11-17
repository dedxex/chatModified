'use strict'
const User = use('App/Model/User')
const Database = use('Database');
const Key = use('App/Model/Key');
const Hash = use('Hash')
const Mail = use('Mail')
class ForgerpasswordController {
  * index(request,response) {
    //send a form to fill the change password request
    yield request.auth.logout()
    yield response.sendView('forget.entermail')
  }
  //-----------------------------------------------------
  * sendmail(request,response) {
    //send an email to the user with the otp code and the url to change the password

    const email = request.input('email');
    yield request.session.put('email',email)
    console.log("this is the email of the user who requested to change the password",email)
    yield request.session.put('key is',email)
    const temp = yield Database
      .table('users')
      .where('email',email).first()

    console.log("the username is "+temp.username)

    const token =Math.random().toString(36).slice(-5);
    const key = new Key()
    key.key = token;
    yield request.session.put('tokenkey',key.key)
    temp.key=key.key
    key.user_id=temp.id
    key.type="forgot_password"
    yield  key.save()

    yield Mail.send('email.emailforgetpassword',temp, (message) => {
      console.log("the token sent is "+temp.key)
      message.to(email, temp.username)
      message.from('postmaster@sandbox9f5a0a5116914f43a08d365a5e353692.mailgun.org')
      message.subject('Password Change Request')
    })
    yield response.sendView('forget.enterkey',temp)
  }

  //-----------------------------------------------------
  * getcode(request,response) {

    const key = request.input("otp");
    const tempKey = yield request.session.get('tokenkey')
    //console.log("the user "+email+" has requested to change password")
    if(key==tempKey) {
      console.log("the the key in the getmethos metod of the Forgetpasswordcontroller is ",key)
      const token = yield Key.findByOrFail('key',key)
      if(!(token.is_used == 1)) {
        yield response.sendView('forget.changepassword',key)
      }
      else {
        const message = "the key is already used"
        yield response.sendView('auth.login',{ message : message })
      }
    }
    else {
      const message =" the key did not matched";
      yield response.sendView('welcome',{ message : message});
    }

  }
  //-----------------------------------------------------
  * changepassword
  (request,response) {
    //user has submitted its changed password now update it
    console.log("in the verifycode method of the ForgetPassword controller");
    const password = yield Hash.make(request.input('password'))
    console.log("passed password");

    const key1 = yield request.session.get('tokenkey')
    if(key1) {
      console.log("the key to activate is ",key1)
      const token = yield Key.findByOrFail('key',key1)
      console.log(token)
      if (token) {
        console.log("the token key found from the database is " + token.key)
        console.log("we want to change the password for the " + token.user_id + " user")
        const user_id = token.user_id
        const affectedRows = yield Database
          .table('users')
          .where('id', user_id)
          .update('password', password)
        const changestatus = yield Database
          .table('keys')
          .where('id', token.id)
          .update('is_used', '0')
        const message = "the password was successfully changed"
        yield response.sendView('auth.login',{ message : message })
      }
      else {
        console.log("failed")
      }
    }

  }

}

module.exports = ForgerpasswordController
