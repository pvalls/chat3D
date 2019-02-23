//Here is a simple client which connects with ws server that is open with node js

//A simple client class
function ChatClient(){
	this.url="";
	this.connection = null;
}

ChatClient.prototype.connect = function(url,un){
	this.url = url;

	if(!url)
		throw("You must specify the server URL!");

	window.WebSocket = window.WebSocket || window.MozWebSocket;
	if (!window.WebSocket) {
    	alert("Websockets not supported by your Browser!");
    	return;
  	}
  	var final_url ="ws://"+ url+"/un="+un;

  	this.connection = new WebSocket(final_url);
}

ChatClient.prototype.sendMessage = function(message){ this.connection.send(JSON.stringify(message));}

