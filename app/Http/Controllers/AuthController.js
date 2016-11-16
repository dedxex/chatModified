'use strict'

const User = use('App/Model/User')
const ActiveUser = use('App/Model/Auser')
const Hash = use('Hash')
const Database = use('Database');
class AuthController {

  * index(request, response) {
    yield response.sendView('login')
  }

  * login(request, response)
  {
    const email = request.input('email');
    const password = request.input('password');
//checking validation of the form
    let tempv = {};
    tempv.email = email;
    tempv.password = password;
    const validation = yield Validator.validate(tempv, User.rules)

    if(!validation) {
      const message = "there is validataion errors in your form. Please provide correct email address and password";
      response.sendView('login',message);
    }

    const message = {
      success: 'Logged-in Successfully!',
      error: 'Invalid Credentials'
    }

    // Attempt to login with email and password
    const authCheck = yield request.auth.attempt(email,password);
    if (authCheck) {
      //getting credentials of the logged in user from the database
      const loggedUser = yield Database.from('users').where('email', email).first()

      yield request.session.put('loggedUser',loggedUser.username)
      return response.redirect('/chat')
    }

    yield response.sendView('login', { error: loginMessage.error })
  }

  * logout(request, response) {
    yield request.auth.logout();
    return response.redirect('/');
  }

}

module.exports = AuthController
