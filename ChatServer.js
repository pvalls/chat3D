//## ChatServer.js ##//¡
//NodeJS code on server side // 

//Include 'websocket' and 'http' NodeJS modules
var WebSocketServer = require('websocket').server;
var http = require('http');

//Global Variables
//Dictionaries to store the users and messages from a certain chatroom ( key )
var dict_Connections ={}; //Stores the Connections of the users that are inside the chatroom ( key)
var dict_Messages = {}; //Stores all the messages of the chatroom (key)
var dict_Clients = {}; //Stores all the Users with a certain chatroom (key)
var chatrooms = [];


//Client object
function Client(username,chatroom,avatar,id){
    this.username = username;
    this.chatroom = chatroom;
    this.avatar = avatar;
    this.userID = id;
}

//Create HTTP Server - Since we are using WebSockets, we do not need to use HTTP Requests/Responses
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
});
server.listen(9000, function() {
    console.log((new Date()) + "Server is listening on port 9000");
});


//Web Socket Server
ws = new WebSocketServer({
    httpServer: server
});

//Everytime someone tries to connect to the websocket server
ws.on("request", function(request) {
    //console.log(request);
    var connection = request.accept(null, request.origin);

    //console.log(request.resourceURL);
    //Pathname format will be /cr="chatroom"&un="Username"&av="avatarimagepath"
    var pathname = request.resourceURL["pathname"];
    var parameters = parsePath(pathname);

    //Initilalize and Fill Dictionaries
    if(chatrooms.indexOf(parameters[0]) == -1) chatrooms.push(parameters[0]); // adding the chatroom

    if(dict_Connections[parameters[0]]==undefined) dict_Connections[parameters[0]]=[];
    var id = dict_Connections[parameters[0]].push(connection) - 1; // ID of the connected user

    var client = new Client(parameters[1],parameters[0],parameters[2],id);
    if(dict_Clients[parameters[0]]==undefined) dict_Clients[parameters[0]]=[];
    dict_Clients[parameters[0]].push(client);
    
    //To check something - CAN BE DEPRACATED
    for(var key in dict_Clients){
        var usario = dict_Clients[key];
        console.log("Room "+ key + " USER " + JSON.stringify(usario));
    }
    //Server notification
    console.log(("["+new Date()) + "]: New connection from user: "+client.username+ " with id: " + client.userID +
        " in chatroom: "+client.chatroom);

    //Send all the chat history to the current User
    if(dict_Messages[parameters[0]] !=undefined){
        connection.sendUTF(
            JSON.stringify({type:"History",msg: dict_Messages[parameters[0]]})
            );
    }
    else{
        dict_Messages[parameters[0]] = [];
    }
    //Messages from the user
    connection.on('message', function(message) {
        //Check if it's utf8 type and resend it to all the users (broadcast)
        if (message.type === 'utf8') {
            //message is a stringified JSON object which contains:
            //type - Type of message
            //from - From who is sended
            //cr - Chatroom
            //msg - Message
            console.log('Received Data: ' + message.utf8Data);

            //Store the data to the dictionary
            var data = JSON.parse(message.utf8Data);
            dict_Messages[data.cr].push(data); 

            //Send the data to all the users ( Broadcast )
            for(var i=0; i<dict_Connections[data.cr].length;i++){
               // console.log('Message Sent!')
                dict_Connections[data.cr][i].sendUTF(message.utf8Data);
            }
        }
    });

    //User disconnected
    connection.on('close', function(connection) {
        console.log(connection);
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function parsePath(path){
    var parameters = [];
    var splitted = path.split("&");
    parameters[0]=splitted[0].split("=")[1]; //Chatroom
    parameters[1]=splitted[1].split("=")[1]; //User name
    parameters[2]=splitted[2].split("=")[1]; //Avatar
    return parameters;
}

//Falta enviar imatges al client