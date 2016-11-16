{% extends 'master' %}
{% block content %}
<!--/////////////////-->
<!--//styles are here-->
<!--/////////////////-->
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font: 13px Helvetica, Arial; }
form { background: #eee; padding: 3px; position: fixed; bottom: 0; width: 50%; }
form input { border: 0; padding: 15px; width: 90%; margin-right: .5%; }
form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
#messages { list-style-type: none; margin: 0; padding: 0; }
#messages li { padding: 5px 10px; }
#messages li:nth-child(odd) { background: #eee; }
</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.7/socket.io.min.js"></script>
  <script>
var socket = io('http://localhost:3000');
</script>
<script src="http://code.jquery.com/jquery-1.11.1.js"></script>
  <!--//////////////////-->
  <!--//javascript script files-->
  <!--//////////////////-->
  <script>
var user_name="{{users.loggedUser}}";
var users = "{{users}}"
console.log("active users are",user_name)
</script>
<script>
$(document).ready(function(){
  var user_name="{{users.loggedUser}}";
  var users = "{{users}}"
  var activeUsers={};
  console.log("the logged user is",user_name);
  socket.emit('register',user_name);
  var data_server;
  $('select').click(function() {
    var data_server = {};
    data_server.fromuser = user_name;
    var selectedUser = $('select').val();
    data_server.touser = selectedUser;
    console.log("user has been selected",selectedUser)
    socket.emit('getconversationlist',data_server);
  })
  $('form').submit(function(){
    var to_user = $('#to').val();
    var test = "{{users}}";
    var msg = $('#m').val();
    //console.log("the form is submitted by " + user_name + " to " + to_user + " and the message is " + msg);
    data_server = {
      id: to_user,
      msg: msg,
      name: user_name
    };
    //console.log("the value of dataserver is ",data_server)
    ////////////////
    socket.emit('messag',data_server);
    $('#m').val('');
    return false;
  });

  socket.on('conversation',function(msgs) {
    console.log("conversation event on client triggred with responce "+msgs);
    $.each(msgs, function(index, value){
      $('#messages').append($('<li>').text(value.message));
      console.log(value);
    })
  })

  socket.on('u',function(activeusers) {
    activeUsers=activeusers;
    $.each(activeUsers, function(index, value){
      console.log("adding")
      $('#to').append($('<option>').text(index));
      console.log(value);
    });
    $.each(activeUsers, function(index, value){
      $('#active').append($('<h2>').text(index));
      console.log(value);
    });
  });
  socket.on('listchanged',function(activeusers) {
    $("option").remove()
    $("h2").remove()
    socket.emit('u')
  });

  socket.on('message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });

  console.log(activeUsers);
});
</script>
<div class="col-xs-6">
  <h3>here is the list of active users users</h3>
<div id="active">

  </div>
  </div>
  <div class="col-xs-6">
  <h3>Conversation</h3>

  <div class="form-group">
  <label for="To">To</label>
  <select class="form-control" id="to">
  {% for user in users %}
<option>{{user.name}}</option>
{% endfor %}
</select>
</div>

<div>
<h4>messages</h4>
<ul id="messages"></ul>
  </div>
  {{ form.open({ action:'ConversationController.store' }) }}
{{ csrfField }}

<input name="message" id="m" autocomplete="off" />
  <input name="to" type="hidden" value={{data_server.id}}/>
<input name="from" type="hidden" value={{data_server.name}}/>
<button type="submit" >send</button>

  {{ form.close() }}

</div>
{% endblock %}
/**
 * Created by taranjeet.s on 11/16/2016.
 */