'use strict'
const User = use('App/Model/User')
const Database = use('Database');
class ConversationController {
  * index(request, response) {
    const isLoggedIn = yield request.auth.check()
    if (!isLoggedIn) {
      response.redirect('/login')
    }
    const usertest = yield User.all();
    const users = usertest.toJSON();
    const loggedUser = yield request.session.get('loggedUser');
    users.loggedUser = loggedUser;
    console.log("the logged user is " + users.loggedUser);
    users.loggedUser = loggedUser;
    yield response.sendView('chat.chat', {users: users});
  }
}
module.exports = ConversationController
