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

  * history(request,response){

    const isLoggedIn = yield request.auth.check()
    if (!isLoggedIn) {
      response.redirect('/login')
    }
    console.log("in history method")
    const usernames = yield User.all();
    const users = usernames.toJSON();

    const loggedUser =  yield request.session.get('loggedUser');

    console.log("this is the logged user "+loggedUser);

    console.log("this is the list of user in controller",usernames)
    const data = {};
    data.users = users;
    data.loggeduser = loggedUser;
    const hello = "taranjeet"
    console.log("taranjeet sir these are the users",data.users)
    yield response.sendView('chat.chathistory',hello);
    yield response.sendView('login', hello)
  }

  * gethistory(request,response){
    const isLoggedIn = yield request.auth.check()
    if (!isLoggedIn) {
      response.redirect('/login')
    }
    console.log("in the gethistory method of the conversation controller");
    const todate = request.input('to');
    const fromdate = request.input('from');
    const touser = request.input('touser');
    const fromuser =  yield request.session.get('loggedUser');
    //const between = touser.concat(fromuser)
    const between = "ttaranjeet";
    console.log("to"+todate+" from "+fromdate);
    const usernames = yield User.all();
    console.log(usernames);
    const history = yield Database.table('conversations').where('name',between);
    console.log("the dates selected are "+todate+" and "+fromdate);
    console.log(history);
    const data = {};
    data.usernames = usernames;
    data.chathistory = history;
    const loggedUser =  yield request.session.get('loggedUser');
    data.loggeduser = loggedUser;
    //console.log(loggedUser);
    //return response.redirect('/chathistory',data)
    console.log("the chate history is ",data.chathistory);
    yield response.sendView('chat.chathistory',data);
  }

}

module.exports = ConversationController
