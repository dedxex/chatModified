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

//a NEW USER IS CONNECTED
io.on('connection', function(socket){
  socket.on('register',function(name) {
    users[name]=socket.id;
    soccerid[socket.id]=name;
    const socketId = users[name];
    console.log("the user socketid is ",socketId)
    io.emit('listchanged',users);
    io.emit('u',users);
  });

  //PASS THE LIST OF ACTIVE USERS TO THE CLIENT
  socket.on('getactiveuserslist',function() {
    io.emit('u',users)
  })

  //USER HAS SELECTED ANOTHER USER, SO PASS IT THE CONVERSATION LIST
  socket.on('getconversationlist',function(data_server) {
    console.log("in the getconversationlist method");
    const socketId = {};
    //get data
    const receiver =data_server.touser;
    const sender = data_server.fromuser;
    let Aconversation = {};
    co(function* () {
      //geting user information
      const re = yield User.findByOrFail('username',receiver);
      const se = yield User.findByOrFail('username',sender);
      console.log("records found from the database for receiver",re);
      console.log("records found from the database for sender",se);
      //create or find the conversation record

      Aconversation = yield Database.from('conversations').where({ 'sender_id': se.id,'receiver_id' : re.id });
      return Aconversation;
    }).then(function (Aconversation) {
      console.log("the conversation found from the database",Aconversation);
    }, function (err) {
      console.error(err.stack);
    });
//if there is a record for conversation then retreive messages
    if(Aconversation.length > 0) {
      const conversation_id = Aconversation.id;

      co(function* () {
        const list = yield Database.from('messages').where('conversation_id',conversation_id);
        return list;
      }).then(function(list){
        console.log("the messages I got from the database is ",list);
      },function (err){
        console.error(err.stack);
      });
      console.log("the conversation list is being send to",users[sender]);
      io.to(users[sender]).emit('conversation',list);
    }

  });
  ///////////////////////////////////////////
  socket.on('messag',function(data_server){
    //get data
    const receiver =data_server.id;
    const sender = data_server.name;
    let Aconversation = {};
    const messageObject = new Message();
    co(function* () {
      //geting user information
      const re = yield User.findByOrFail('username',receiver);
      const se = yield User.findByOrFail('username',sender);
      //create or find the conversation record
      Aconversation = yield Conversation.findOrCreate(
        { sender_id: se.id,receiver_id : re.id },
        { sender_id: se.id,receiver_id : re.id }
      );
      console.log("this is the conversation found when we want to save message",Aconversation.id);
      const Aconversationid = Aconversation.id;
      return Aconversationid;
    }).then(function (Aconversationid) {
      //creating suitable record in the message table
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
    const socketId = users[data_server.id];
    console.log("preparing to send to socketId "+socketId+" of name "+name+" by "+data_server.name);
    socket.broadcast.to(socketId).emit('message', data_server.msg);
  });

  socket.on('disconnect', function () {
    console.log("user with socketid "+this.id+" is disconnected")
    const name = soccerid[this.id];
    delete users[name]
    console.log("user is disconnected,now the list is ",users)
    io.emit('listchanged',users);
  });
});

io.listen(3000);
