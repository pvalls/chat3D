//Variables
//Gifs library
var gifs= [":gif1:","gif/gif1.gif",":gif2:","gif/gif2.gif",":gif3:","gif/gif3.gif"];
//Variables from the DOM
var input = document.querySelector(".sd_msg");
var input_un = document.querySelector(".in_un");
var input_cr = document.querySelector(".in_cr");

var button_send = document.querySelector(".send_btn");
var button_login = document.querySelector(".login_btn");

var div_msg = document.querySelector(".msg");
var div_login = document.querySelector(".loggin");
var div_container = document.querySelector(".container");
var div_header = document.querySelector(".header");
var div_ID = document.querySelector(".user_ID");
//var div_usersconnected = document.querySelector(".users_connected");
var div_numberofusers = document.querySelector(".number_of_users");
var div_usersbox = document.querySelector(".users_box");

//Hide chat during login page
div_container.style.display	='none';

var Usuario;
var server = new ChatClient();

button_login.addEventListener("click",function(event){
	if(checkBox()) login();
});


document.addEventListener("keydown",function(event)
{
	
	if(event.keyCode == 13){
		
		if (div_login.style.display == 'none')
		{
			onSendMessage();
		}
		else
		{
			if(checkBox()) login();
		}	
	}	
});

button_send.addEventListener("click",onSendMessage);

function onSendMessage(){
	if(!input.value == "" && sendGifs()){
		//showMessage("msg_me",input.value);
		//Enviarho al servidor
		var data ={
			type:"message",
			from: input_un.value,
			cr: input_cr.value,
			msg : input.value
		};

		server.sendMessage(data);
		//myChatHistory.push(data);
//		server.storeData(input_cr.value,JSON.stringify(myChatHistory));
		input.value	="";
	}
}

//Sending Gifs Functions
function sendGifs(){
	var index = gifs.indexOf(input.value);
	if(index !=-1){
		// var img = document.createElement("img");
		// img.src = gifs[index+1];
		// img.className = "msg_me";
		// div_msg.appendChild(img);
		// div_msg.scrollTop = 9999999999999;
		
		//Send the image to the server (?)
		var data ={
			type:"img",
			from: input_un.value,
			cr: input_cr.value,
			msg:input.value
		};

		server.sendMessage(data);
		//myChatHistory.push(data);
		//server.storeData(input_cr.value,JSON.stringify(myChatHistory));
		input.value ="";

		return false;
	}
	return true;
}

//Receiving functions
function showMessage(classname,msg){

	var element = document.createElement("div");
	element.innerHTML = msg;
	element.className = classname;
	div_msg.appendChild(element);
	div_msg.scrollTop = 99999999;
}

function showImage(classname,msg){
	var index = gifs.indexOf(msg);
	if(index!=-1){
		var img = document.createElement("img");
		img.src = gifs[index+1];
		img.className = classname;
		div_msg.appendChild(img);
		div_msg.scrollTop = 99999999;
	}
}

//Check input values for the login
function checkBox(){
	if (input_cr.value.length == 0 && input_un.value.length == 0)
	{
		alert("You forgot to choose a Username and a Chat Room");
		return false;
	}
	else if (input_cr.value.length == 0)
	{
		alert("You forgot to choose a Chat Room dumbass");
		return false;
	}
	else if (input_un.value.length == 0)
	{
		alert("You forgot to choose a username dumbass");
		return false;
	}
	return true;
}

function login(){

	//Make Login Page disappear
	div_login.style.display ='none';

	//Make chat appear
	div_container.style.display="block";

	//Usuario = new User(input_un.value,input_cr.value,avatarname);
	//console.log("Username: "+ input_un.value + " Chat room: "+input_cr.value);
	div_header.textContent = "Chatroom \""+ input_cr.value+"\"";

	
	//Connect to the chat room
	server.connect("localhost:9000",input_cr.value, input_un.value, avatarname);

	var data = {
     	type: "notification",
     	msg: "User: "+input_un.value+" has joined in chatroom "+input_cr.value+"!",
     	from: input_un.value,
     	cr: input_cr.value
    };
	server.connection.onopen = function(event){
		server.connection.send(JSON.stringify(data));
	}

	server.connection.onmessage = function ( msg ){
	//data received
	var data = JSON.parse(msg.data);
	console.log(data);

	if(data.type == "message"){

		if (data.from == input_un.value){
		showMessage("msg_me",data.msg);
		}
		else {
			showMessage("msg_user_Username", data.from);
			showMessage("msg_user",data.msg);
		//myChatHistory.push(data);
		}

	}

	if(data.type =="img"){

	//showMessage("msg_user_Username", data.user);
	//showImage("msg_user",data.msg);
	//myChatHistory.push(data);

		if (data.from == input_un.value){
			showImage("msg_me",data.msg);
		}	
		else {
			showMessage("msg_user_Username", data.from);
			showImage("msg_user",data.msg);
		//myChatHistory.push(data);
		}
	}

	if(data.type =="notification"){
		
	//console.log(data);
	//server.clients[data.user_id].name = data.user_name;
		showMessage("msg_notif",data.msg);
	}

	// if(data.type =="synch"){
	// //Make sure that is a new user to be added in the users' list
	// for(var i=0; i<users.length;++i){
	//   if((data.user.username == users[i].username) && (data.user.id == users[i].id))
	//     return
	// }
	// //users.push(data.user_id);
	// users.push(data.user);
	// if(data.msg!=""){
	//   showMessage("msg_notif",data.msg);
	//   myChatHistory.push(data.msg);
	// }
	// onUsersOnline();
	// }

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



//	server.connect("ecv-etic.upf.edu:9000",input_cr.value);
}

function onUsersOnline(){
	//first clear all the information
	while(div_numberofusers.firstChild){
		div_numberofusers.removeChild(div_numberofusers.firstChild);
	}
	while(div_usersbox.firstChild){
		div_usersbox.removeChild(div_usersbox.firstChild);
	}

	//Users online
	//Not working for only one user?
	if(users.length > 1)
		div_numberofusers.innerHTML = "Users Connected: "+ users.length;
	else
		div_numberofusers.innerHTML = "Users Connected: 1";

	//Users list
	for(var i =1; i<users.length;i++){
		var friend = document.createElement("div");
		var img = document.createElement("img");
		var p = document.createElement("p");

		img.src = users[i].avatar;
		img.className = "friend_avatar";
		p.appendChild(document.createTextNode(users[i].username));
		p.className = "friend_id";
		friend.appendChild(img);
		friend.appendChild(p);
		friend.className = "friend";
		div_usersbox.appendChild(friend);

	}


}