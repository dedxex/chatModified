'use strict'
// the route to reset the password localhost:3333/changepassword/{{key}}
const Tempuser = use('App/Model/TempUser')
const User = use('App/Model/User')
const Key = use('App/Model/Key')
const Hash = use('Hash')
const Mail = use('Mail')
const Database = use('Database');
const Validator = use('Validator')

class RegisterController {
  * index(request, response) {
    //index for resgistration
    yield response.sendView('auth.register')
  }

  * register(request, response) {
    //store the temporary credentials
    let userName = new Tempuser();
    let tempv = {};
    tempv.email = request.input('email')
    tempv.password = request.input('password')
    tempv.username = request.input('username')
    const validation = yield Validator.validate(tempv, User.rules)

    if(!validation) {
      const message = "there is validataion errors in your form." +
        "Email and username should be unique and all fields are required";
      response.sendView('auth.register',message);
    }
    const user = {}
    user.username = request.input('name')
    user.email = request.input('email')
    user.password = yield Hash.make(request.input('password'))

    userName.username = request.input('name')
    userName.email = request.input('email')
    userName.password = yield Hash.make(request.input('password'))
    //saving the initial information in the temp_user table
    yield userName.save()

    //generating a token key
    const token =Math.random().toString(36).slice(-5);
    const key = new Key()
    key.key = token;
    const temp = yield Database.table('temp_users').where('username', userName.username).first();
    console.log("the username is "+temp.username);

    user.key=key.key;
    key.temp_user_id=temp.id;
    key.type="email_verification";
    yield  key.save();
    //sending mail
    yield Mail.send('email.accountActivation',user, (message) => {
      console.log("the token sent is "+user.key)
      message.to(user.email, user.username)
      message.from('postmaster@sandbox9f5a0a5116914f43a08d365a5e353692.mailgun.org')
      message.subject('welcome to chat Applicaion')
    })


    var registerMessage = {
      success: 'Registration Successful! Now go ahead and login'
    }

    yield response.sendView('auth.login', { registerMessage : registerMessage })
  }

  * activate(request, response) {
    const id = request.param('key')
    console.log("the key to activate is "+id)
    const token = yield Key.findByOrFail('key',id)
    console.log(token)
    if(token) {
      console.log("the token key found from the database is "+token.key)
      console.log("we want to activate the "+token.temp_user_id+" user")
      const user_id = token.temp_user_id;
      //creating an instance of user
      let user = new User();
      const tempusers = yield token.temp_users().fetch();
      user.username = tempusers.username;
      user.email = tempusers.email;
      user.password = tempusers.password;
      console.log("relationship is working fine here is the user",user);

      const changestatus = yield Database
        .table('keys')
        .where('id',token.id)
        .delete();

      const affectedRows = yield Database
        .table('temp_users')
        .where('id',user_id)
        .delete();
      yield user.save();


      return response.redirect('/login')
    }
    else {
      console.log("failed")
    }

  }
}

module.exports = RegisterController
