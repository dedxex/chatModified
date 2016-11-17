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
    yield response.sendView('chat.chathistory');
    return;
  }

  //-------------------------------------------------------------
  *getUsers(request,response){

    var users = yield User.all();

    response.json(users);
    return;

  }

  //-------------------------------------------------------------
  * gethistory(request,response){
    const isLoggedIn = yield request.auth.check()
    if (!isLoggedIn) {
      response.redirect('/login')
    }
    console.log("in the gethistory method of the conversation controller");
    let Aconversation = {};
    let messages = [];

    const todat = request.input('to');//to date
    const fromdat = request.input('from');//from date
    const todate = todat+" 00:00:00";
    const fromdate = fromdat+" 00:00:00";
    console.log("the from date is",fromdate);

    const touser = request.input('touser');
    const fromuser =  yield request.session.get('loggedUser');

    const re = yield User.findByOrFail('username',touser);
    const se = yield User.findByOrFail('username',fromuser);

    const conver = yield Database.table('conversations').where({ 'sender_id': se.id,'receiver_id' : re.id }).first();

    Aconversation = yield Database.from('messages').where({ 'conversation_id': conver.id});
    Aconversation.map((a) => {
      messages.push(a.message);
    });

    console.log("to"+touser+" from "+fromuser);

    console.log("the dates selected are "+todate+" and "+fromdate);
    console.log("the chat history is ",messages);
    yield response.sendView('chat.chathistory',{ messages : messages });
  }

}

module.exports = ConversationController
