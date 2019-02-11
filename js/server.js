var server = new SillyClient();
var names_ids = [];
var users =[];
var myChatHistory = [];
var printed = false;

server.on_ready = function(id){

  Usuario = new User(input_un.value,input_cr.value,avatarname,id);
  users.push(Usuario);
  showAvatar();

  var log = server.loadData(input_cr.value, function(data){
        if(data!=undefined)
        {
          //Dirty trick to erase the fist login notification
          
          
          var parsed = JSON.parse(data);
            myChatHistory = parsed;
            for(var i=0; i<myChatHistory.length;i++)
            {
              var cn;
              if(myChatHistory[i].type=="message"|| myChatHistory[i].type =="img"){
                cn = "msg_user_Username";
                showMessage(cn,myChatHistory[i].user);
                cn = "msg_user";
                showMessage(cn,myChatHistory[i].msg);
              }
              else if(myChatHistory[i].type=="synch"){
                cn = "msg_notif";
                showMessage(cn,myChatHistory[i].msg);
              } 
            }

            var user_log = {
              type: "synch",
              msg: "User: "+input_un.value+" has joined in chatroom "+input_cr.value+"!",
              user: Usuario
              //user_id : id
            };

            server.sendMessage(user_log);
            myChatHistory.push (user_log);
            server.storeData(input_cr.value,JSON.stringify(myChatHistory));
            showMessage("msg_notif",user_log.msg);
            printed = true;
            if(div_msg.firstChild){
              div_msg.removeChild(div_msg.firstChild);
            }
        }
    });
  //ISSUE FOUND
  if(!printed){
    var user_log = {
    type: "synch",
    msg: "User: "+input_un.value+" has joined in chatroom "+input_cr.value+"!",
    user: Usuario
    //user_id : id
    };
    server.sendMessage(user_log);
    myChatHistory.push (user_log);
    server.sendMessage(user_log);
    showMessage("msg_notif",user_log.msg);
  }
  

};

//this methods receives messages from other users (author_id is an unique identifier per user)
server.on_message = function( author_id, msg ){
  //data received
  var data = JSON.parse(msg);

  if(data.type == "message"){
    showMessage("msg_user_Username", data.user);
  	showMessage("msg_user",data.msg);
    myChatHistory.push(data);
  }

  if(data.type =="img"){
    showMessage("msg_user_Username", data.user);
    showImage("msg_user",data.msg);
    myChatHistory.push(data);
  }

  if(data.type =="notification"){
  	
  	console.log(data);
    server.clients[data.user_id].name = data.user_name;
    showMessage("msg_notif",data.msg);
  }

  if(data.type =="synch"){
    //Make sure that is a new user to be added in the users' list
    for(var i=0; i<users.length;++i){
      if((data.user.username == users[i].username) && (data.user.id == users[i].id))
        return
    }
    //users.push(data.user_id);
    users.push(data.user);
    if(data.msg!=""){
      showMessage("msg_notif",data.msg);
      myChatHistory.push(data.msg);
    }
    onUsersOnline();
  }

  if(data.type =="update"){

    for( var i=0; i<users.length;i++){
      if((data.user.username == users[i].username)&& (data.user.id == users[i].id)){
        users[i] = data.user;
        break;
      }
    }
    onUsersOnline();
  }

  if(data.type =="refresh"){
    onUsersOnline();
  }

}

//this methods is called when a new user is connected
server.on_user_connected = function( user_id ){

	var user_log = {
    type: "synch",
    //msg: "User: "+ input_un.value + " has loged in chatroom: "+ input_cr.value+"!",
    msg : "",
    user: Usuario
    //user_id : user_id
  };
  server.sendMessage(user_log);

}

//this methods is called when a user leaves the room
server.on_user_disconnected = function( user_id ){

  var index;
  for(var i=0; i<users.length;i++){
    if(user_id == users[i].id){
      index = i;
      break;
    }
  }
  var index = names_ids.indexOf(user_id);
  var data = {
    type : "synch",
    msg: "User: "+ users[i].username + " has leaved the chatroom: "+ input_cr.value+"!"
  };
  myChatHistory.push(data);
  server.storeData(input_cr.value,JSON.stringify(myChatHistory));
  showMessage("msg_notif", data.msg);
  users.splice(index,1);
  onUsersOnline();

};

//this methods is called when the server gets closed (it shuts down)
server.on_close = function(){
  console.log("A)");
};


//this method is called when coulndt connect to the server
server.on_error = function(err){

  showMessage("msg_notif", "The chat couldn't establish a connection to the server");


};