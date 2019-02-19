function ChatClient(){
	this.url="";
	//this.cr="";
	this.connection = null;
}

ChatClient.prototype.connect = function(url,un){
	//this.cr = cr;
	this.url = url;

	if(!url)
		throw("You must specify the server URL!");

	window.WebSocket = window.WebSocket || window.MozWebSocket;
	if (!window.WebSocket) {
    	alert("Websockets not supported by your Browser!");
    	return;
  	}

  	//var final_url ="ws://"+ url+"/cr="+cr+"&un="+un+"&av="+a;
  	var final_url ="ws://"+ url+"/un="+un;

  	this.connection = new WebSocket(final_url);
}

ChatClient.prototype.sendMessage = function(message){

	this.connection.send(JSON.stringify(message));

}

