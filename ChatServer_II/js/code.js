//Variables from the DOM
var input = document.querySelector(".sd_msg");
var input_un = document.querySelector(".in_un");
//var input_cr = document.querySelector(".in_cr");

//var button_send = document.querySelector(".send_btn");
var button_login = document.querySelector(".login_btn");

var div_msg = document.querySelector(".msg");
var div_login = document.querySelector(".loggin");
var div_container = document.querySelector(".container");
var div_header = document.querySelector(".header");

//Chat connection to the server
var server = new ChatClient();

//User
var Usuario = null;
var renderuser = false;

//Hide chat during login page
div_container.style.display	='none';

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

//button_send.addEventListener("click",onSendMessage);

function onSendMessage(){
	if(!input.value == ""){

		position = [Usuario.cube.position.x, Usuario.cube.position.y, Usuario.cube.position.z];
		//Enviarho al servidor
		var data ={
			type:"message",
			from: input_un.value,
			pos: position,
			//cr: input_cr.value,
			msg : input.value
		};

		server.sendMessage(data);
		input.value	="";
	}
}

//Receiving functions
function showMessage(classname,msg){

	var element = document.createElement("div");
	element.innerHTML = msg;
	element.className = classname;
	div_msg.appendChild(element);
	div_msg.scrollTop = 99999999;
}

//Check input values for the login
function checkBox(){
	if (input_un.value.length == 0)
	{
		alert("You forgot to choose a username dumbass");
		return false;
	}
	return true;
}

//Logs the user in and opens the callbacks for the websockets
function login(){

	//Make Login Page disappear
	div_login.style.display ='none';

	//Make chat appear
	div_container.style.display="block";
	//div_header.textContent = "Chatroom 2";

	//Connect to the chat room
	server.connect("localhost:9026",input_un.value);
	//server.connect("ecv-etic.upf.edu:9026",input_un.value);

	//Creating user, gives it a cube and adding to the scene
	Usuario = new User(input_un.value);
	//renderuser = true;
	// var position = getRandomPosition();
	// var color = getRandomColor();
	// Usuario.setCube(position,color);
	// scene.add(Usuario.cube);

	var data = {
     	type: "notification",
     	msg: "User: "+input_un.value+" has joined",//input_cr.value+"!",
     	from: input_un.value
     	//cr: input_cr.value
    };

    //The first thing when extablishes connection. It sends the user information to the server
	server.connection.onopen = function(event){
		server.connection.send(JSON.stringify(data));
	}

	//When we receive a message from the server
	server.connection.onmessage = function ( msg ){

		//data received
		var data = JSON.parse(msg.data);
		//console.log(data);

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

		if(data.type =="notification"){
			//A notification is received when someone new connects to the chatroom
			//This means that we need to render a new cube
			showMessage("msg_notif",data.msg);
			if(Usuario.id!=data.id){
				cubes[data.id] = createCube(data.p,data.c);
				cubes[data.id].uptime = 1.2;
				scene.add(cubes[data.id]);
				//redraw();
			}
		}

		//Receive data about your cube when login
		if(data.type =="LOG"){
			Usuario.setId(data.id);
			Usuario.setCube(data.p,data.c);
			scene.add(Usuario.cube);

			renderuser = true;

			//redraw();

		}

		if(data.type=="USERS"){
			//the message with type USERS is received when we logged in the websocket server
			//Here we are going to render all the users that are already in the chat
			if(Usuario.id != data.id){
				cubes[data.id] = createCube(data.p,data.c);
				cubes[data.id].uptime = 1.2;
				scene.add(cubes[data.id]); // add cube to the scene
				//redraw();
			}
		}
		if(data.type=="WRLDUPDATE"){
			console.log("Received new position yey");
			if(Usuario.id != data.id){
				//cubes[data.id].position.set(data.pos[0], data.pos[1], data.pos[2]);
				cubes[data.id].endpos = new THREE.Vector3(data.pos[0],data.pos[1],data.pos[2]);
				cubes[data.id].uptime = 0;
				//redraw();
			}	
		}

		
	}
}
