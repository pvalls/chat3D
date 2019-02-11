function ChatClient(){
	this.url="";
	this.cr="";
	this.connection = null;
}

ChatClient.prototype.connect = function(url,cr,un,a){
	this.cr = cr;
	this.url = url;

	// if(this.connection){
	// 	this.connection.onmessege = null;
	// 	this.connection.onclose = null;
	// 	this.connection.close();
	// }

	if(!url)
		throw("You must specify the server URL!");

	window.WebSocket = window.WebSocket || window.MozWebSocket;
	if (!window.WebSocket) {
    	alert("Websockets not supported by your Browser!");
    	return;
  	}

  	var final_url ="ws://"+ url+"/cr="+cr+"&un="+un+"&av="+a;

  	

  	this.connection = new WebSocket(final_url);
  	//Once establishes the connection send immediately the login message
  	//this.connection.onopen = function(event){
  	//	this.connection.send(JSON.stringify(data));
  	//};
  	//this.connection.send(JSON.stringify(data));
  	//this.connection.onmessage = function(e){console.log(e.data)};
  	//this.connection.onopen =() =>this.connection.send(JSON.stringify(data));
  	//console.log("logged");
}

ChatClient.prototype.sendMessage = function(message){

	this.connection.send(JSON.stringify(message));

}

