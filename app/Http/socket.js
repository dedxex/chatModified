const http = require('http');
const server = http.createServer();
const io = use('socket.io')(server);
var co = require('co');
const Conversation = use("App/Model/Conversation");
const User = use('App/Model/User');
const Message = use('App/Model/Message');
const Database = use('Database');
const users = {};
const soccerid={};

//a NEW USER IS CONNECTED//============================================================
io.on('connection', function(socket){
  socket.on('register',function(name) {
    users[name]=socket.id;
    soccerid[socket.id]=name;
    const socketId = users[name];
    console.log("the user socketid is ",socketId)
    io.emit('listchanged',users);
    io.emit('u',users);
  });

  //PASS THE LIST OF ACTIVE USERS TO THE CLIENT//=========================================
  socket.on('getactiveuserslist',function() {
    io.emit('u',users)
  })

  //USER HAS SELECTED ANOTHER USER, SO PASS IT THE CONVERSATION LIST//=====================
  socket.on('getconversationlist',function(data_server) {
    console.log("in the getconversationlist method");
    const socketId = {};
    //get data
    const receiver =data_server.touser;
    const sender = data_server.fromuser;
    let Aconversation = {};
    let messagesj = [];
    co(function* () {
      //geting user information//==========================================================
      let re = yield User.findByOrFail('username',receiver);
      let se = yield User.findByOrFail('username',sender);
      //interchanging
      if(re.id>se.id){
        let temp = {};
        temp = re;
        re = se;
        se = temp;
      }
      console.log("records found from the database for receiver",re);
      console.log("records found from the database for sender",se);
      //create or find the conversation record//=============================================
      const conver = yield Database.table('conversations').where({ 'sender_id': se.id,'receiver_id' : re.id }).first();
      console.log('covner is this',conver.id);
      co(function* () {
           Aconversation = yield Database.from('messages').where({ 'conversation_id': conver.id});
        Aconversation.map((a) => {
          messagesj.push(a.message);
        });
      }).then(function(response) {
        console.log('the messages are ',messagesj);
        io.to(users[sender]).emit('conversation',messagesj);
        io.to(users[receiver]).emit('conversation',messagesj);
      },function(err){
        console.error(err.stack);
      })
    }).then(function (A) {
    }, function (err) {
      console.error(err.stack);
    });
    console.log("the messages are these ",messagesj);
    console.log("the conversation list is being send to",users[sender]);
  });

  ///////////////////////////////////////////==============================================

  socket.on('messag',function(data_server){
    //get data
    const receiver =data_server.id;
    const sender = data_server.name;
    let Aconversation = {};
    const messageObject = new Message();
    co(function* () {
      //geting user information
      let re = yield User.findByOrFail('username',receiver);
      let se = yield User.findByOrFail('username',sender);
      //interchanging
      if(re.id>se.id){
        let temp = {};
        temp = re;
        re = se;
        se = temp;
      }
      //create or find the conversation record
      Aconversation = yield Conversation.findOrCreate(
        { sender_id: se.id,receiver_id : re.id },
        { sender_id: se.id,receiver_id : re.id }
      );
      console.log("this is the conversation found when we want to save message",Aconversation.id);
      const Aconversationid = Aconversation.id;
      return Aconversationid;
    }).then(function (Aconversationid) {

//=============//creating suitable record in the message table//=================

      co(function* () {
        messageObject.conversation_id = Aconversationid;
        messageObject.message = data_server.msg;
        yield messageObject.save();
      }).then(function(response) {

      },function (err) {
        console.error(err.stack);
      });
    }, function (err) {
      console.error(err.stack);
    });
    console.log("messag event triggered");
    console.log("message"+data_server.msg+" is sent to " + data_server.id + ","  + " from" + data_server.name);

    const name = data_server.id;
    //const fromtaranjeet = data_server.name;
    const socketId = users[data_server.id];
    const socketId2 = users[data_server.name];
    console.log("preparing to send to socketId "+socketId+" of name "+name+" by "+data_server.name);
    //socket.broadcast.to(socketId).emit('message', data_server.msg);
    io.to(socketId).emit('message', data_server);
    io.to(socketId2).emit('message', data_server);
  });

//==============================================================

  socket.on('disconnect', function () {
    console.log("user with socketid "+this.id+" is disconnected")
    const name = soccerid[this.id];
    delete users[name]
    console.log("user is disconnected,now the list is ",users)
    io.emit('listchanged',users);
  });
});

io.listen(3000);
