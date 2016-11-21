'use strict'

const User = use('App/Model/User')
const Hash = use('Hash')
const Database = use('Database');
const Validator = use('Validator')
class AuthController {

  * index(request, response) {
    yield response.sendView('auth.login')
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
      response.sendView('auth.login',message);
    }

    const message = {
      success: 'Logged-in Successfully!',
      error: 'Invalid Credentials'
    }

    try {
      // Attempt to login with email and password
      const authCheck = yield request.auth.attempt(email,password);
    }catch(err) {
      const message = " username or password is not correct";
      yield response.sendView('auth.login',{ message : message });
    }

    // if(!authCheck) {
    //   const message = "username or password is not correct";
    //   yield request.sendView('auth.login',{ message : message });
    // }
    const authCheck = yield request.auth.attempt(email,password);
    if (authCheck) {
      //getting credentials of the logged in user from the database
      const s = message.success;
      const loggedUser = yield Database.from('users').where('email', email).first()

      yield request.session.put('loggedUser',loggedUser.username)
      return response.redirect('/chat');
    }

    yield response.sendView('auth.login',message.error)
  }

  * logout(request, response) {
    yield request.auth.logout();
    return response.redirect('/');
  }

}

module.exports = AuthController
