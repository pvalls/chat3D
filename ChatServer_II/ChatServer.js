//NodeJS code on server side // 

//Include 'websocket' and 'http' NodeJS modules
var WebSocketServer = require('websocket').server;
var http = require('http');
var url = require('url');
var fs = require('fs');

//Global Variables
//Dictionaries to store the users and messages from a certain chatroom ( key )
//var dict_Connections ={}; //Stores the Connections of the users that are inside the chatroom ( key)
//var dict_Messages = {}; //Stores all the messages of the chatroom (key)
//var dict_Clients = {}; //Stores all the Users with a certain chatroom (key)
//var chatrooms = [];

//var chatHistory = [];
var connections = [];
var clients = [];
var minDist = 15;

//Client object
function Client(username,connection,id,p,c){
    this.username = username;
    this.connection = connection;
    this.userID = id;
    this.position = p;
    this.c = c;
}

//Create HTTP Server - Since we are using WebSockets, we do not need to use HTTP Requests/Responses
var server = http.createServer(function(request, response) {
    var q = url.parse(request.url,true);
   // console.log("Looking for: "+q.pathname);
    fs.readFile("."+q.pathname,function(err,data){
        if(err){
            response.writeHead(404,{'Content-Type':'text/html'});
            return response.end("404 Not Found");
        }
        if(q.pathname.includes(".html")){
            response.writeHead(200,{'Content-Type':'text/html'});
        }
        else if(q.pathname.includes(".css")){
            response.writeHead(200,{'Content-Type':'text/css'});
        }
        else if(q.pathname.includes(".js")){
            response.writeHead(200,{'Content-Type':'text/javascript'});
        }
        else if(q.pathname.includes(".jpg")){
            response.writeHead(200,{'Content-Type':'image/jpeg'});
        }
        response.write(data);
        return response.end();
    })
    //console.log((new Date()) + ' Received request for ' + request.url);
});
server.listen(9026, function() {
    console.log((new Date()) + "Server is listening on port 9026");
});


//Web Socket Server
ws = new WebSocketServer({
    httpServer: server
});

//Everytime someone tries to connect to the websocket server
ws.on("request", function(request) {
    
    //console.log(request);
    var connection = request.accept(null, request.origin);

    //Pathname format will be /un="Username"
    var pathname = request.resourceURL["pathname"];
    var username = parsePath(pathname);

    //Send all the users online that the servers handles
    if(clients.length!=0)
        for(var i=0; i<clients.length;i++)
            connection.sendUTF(JSON.stringify({type:"USERS",id:clients[i].userID,
                p:clients[i].position,c:clients[i].c}));
    

    var id = connections.push(connection) - 1; // ID of the connected user
    
    //Values of the cube
    var position = getRandomPosition();
    var c = getRandomColor();
    var client = new Client(username, connection,id,position,c);
    clients.push(client);

    //Server console notification
    console.log("["+new Date() + "]: New connection from user: "+client.username+ " with id: " + client.userID);

    //Send all the chat history to the current User
    // if(chatHistory.length !=0){
    //     connection.sendUTF( JSON.stringify({type:"HIST",msg: chatHistory}) );
    // }

    //Send the user's ID, cubes's position and color
    connection.sendUTF(JSON.stringify({type:"LOG", id: client.userID, p: client.position,c: client.c}));

    //Messages from the user
    connection.on('message', function(message) {
        //Check if it's utf8 type and resend it to all the users (broadcast)
        if (message.type === 'utf8') {
            //Store the data to the dictionary
            var data = JSON.parse(message.utf8Data);
            //chatHistory.push(data); 
            console.log("Received message " + JSON.stringify(data));

            //Check Distance to decide to whom send broadcast of message
            if(data.type == "message"){
                for(var i = 0; i < clients.length ; i++){
                    if(Distance(clients[i].position, data.pos) < minDist){
                        clients[i].connection.sendUTF(JSON.stringify(data));
                    }
                } 
            }

            //if the data received is a notification we need to resend it with the cube position and color
            if(data.type =="notification"){
                data.id = id;
                data.p = client.position;
                data.c = client.c;
                doBroadcast(data);
            }

            // When a client moved a cube we update clients
            if(data.type=="WRLDUPDATE"){
            	console.log("[USERMOVED] ID: "+data.id+" new coord:["+data.pos[0]+","+data.pos[1]+","+data.pos[2]+"]");
                //Search for the client
                for(var i = 0; i < clients.length ; i++){
                    if (clients[i].userID == data.id){
                        clients[i].position = data.pos;
                        break;
                    }
                }
                doBroadcast(data);
            }
        }
    });

    //User disconnected
    connection.on('close', function(connection) {
        //console.log("disconnected");
        console.log(connection.remoteAddress);
    });
});


function Distance(pos1, pos2){
	//console.log("Positions compared are" + pos1 + "and" + pos2);
	return Math.sqrt(Math.pow((pos1[0]-pos2[0]), 2) + Math.pow((pos1[1]-pos2[1]), 2) + Math.pow((pos1[2]-pos2[2]), 2));
}

function doBroadcast(data){
    //Send the data to all the users ( Broadcast )
    for(var i=0; i<connections.length;i++){
        //console.log('Message Sent!')
        connections[i].sendUTF(JSON.stringify(data));
    }
}

function parsePath(path){
    return path.split("=")[1];
}

function getRandomColor(){
    //Returns a random hexadecimal color
    var letters = "0123456789ABCDEF";
    var color="0x";
    for(var i =0; i<6;i++)
        color+=letters[Math.floor(Math.random()*16)];
    //console.log(color);
    return color;

}

function getRandomPosition(){
    //Returns an array of random x,y,z coordinates between 0-9
    var x = Math.floor(Math.random()*50);
    var y = Math.floor(Math.random()*35);
    //var z = Math.floor(Math.random()*); 
    var z = 2.5;
    var position = [x,y,z];
    return position;
}
