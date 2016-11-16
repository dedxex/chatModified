'use strict'
// the route to reset the password localhost:3333/changepassword/{{key}}
const User = use('App/Model/User')
const Key = use('App/Model/Key')
const Hash = use('Hash')
const Mail = use('Mail')
const Database = use('Database');

class RegisterController {
  * index(request, response) {
    //index for resgistration
    yield response.sendView('register')
  }

  * register(request, response) {
    //store the temporary credentials
    const userName = new User()
    const user = {}
    user.username = request.input('name')
    user.email = request.input('email')
    user.password = yield Hash.make(request.input('password'))
    user.remember_me = "any hash key"
    user.status = 0

    userName.username = request.input('name')
    userName.email = request.input('email')
    userName.password = yield Hash.make(request.input('password'))
    userName.status = 0

    yield userName.save()

    const token =Math.random().toString(36).slice(-5);
    const key = new Key()
    key.key = token;
    //const tid = yield userName.apiKeys().fetch()

    const temp = yield Database
      .table('users')
      .where('username', userName.username).first()
    console.log("the username is "+temp.username)

    console.log("the userid of hte user is "+temp.id)
    user.key=key.key
    key.user_id=temp.id
    key.type="email_verification"
    console.log("The generated key is ",token);
    yield  key.save()

    yield Mail.send('emails.welcome',user, (message) => {
      console.log("the token sent is "+user.key)
      message.to(user.email, user.username)
      message.from('postmaster@sandbox9f5a0a5116914f43a08d365a5e353692.mailgun.org')
      message.subject('welcome to chat Applicaion')
    })


    var registerMessage = {
      success: 'Registration Successful! Now go ahead and login'
    }

    yield response.sendView('login', { registerMessage : registerMessage })
  }

  * activate(request, response) {
    const id = request.param('id')
    console.log("the key to activate is "+id)
    const token = yield Key.findByOrFail('key',id)
    console.log(token)
    if(token) {
      console.log("the token key found from the database is "+token.key)
      console.log("we want to activate the "+token.user_id+" user")
      const user_id = token.user_id
      const affectedRows = yield Database
        .table('users')
        .where('id', user_id)
        .update('status', '1')
      const changestatus = yield Database
        .table('keys')
        .where('id',token.id)
        .update('status', '0')
      return response.redirect('/login')
    }
    else {
      console.log("failed")
    }

  }
}

module.exports = RegisterController
