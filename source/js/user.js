//Here we handle all what is related with user's modification -- Setting id, moving the cube etc

//User class
function User(un){
	this.username = un;
	this.cube = null;
	this.id = -1;

}

//methods
User.prototype.setun = function(un){
	this.username = un;
}
User.prototype.setId = function(id){
	this.id = id;
}
//Create Cube
User.prototype.setCube = function(p,c){
	this.cube = createCube(p,c);
	input_newun.placeholder = this.username;
	input_newc.value = "#"+this.cube.material.color.getHexString();
}
//Create cone
User.prototype.setCone = function(p){
	var geometry = new THREE.ConeGeometry( 1, 3, 3);
	var material = new THREE.MeshBasicMaterial( {color: "red"} );
	var cone = new THREE.Mesh( geometry, material );
	cone.position.set(p[0],p[1],p[2] + 5);
	cone.rotation.set(-Math.PI / 2, 0, 0);
	this.cone = cone;
}

//setting an endpoint ( destination ) for the user
User.prototype.setEnd = function(pos){
	applyBoundaries(pos)
	this.cube.endpos = pos;
	this.cube.uptime = 0; //Starts the lerp
	sendEndPos(this.cube.endpos);
}

//Send the endpoint to the server -- Server needs to update the new position from every cube
function sendEndPos(pos){
	var position = [pos.x, pos.y, pos.z];
	var data ={
			type:"WRLDUPDATE",
			id: Usuario.id,
			pos : position
		};
	server.sendMessage(data);
}
//Receives a position and a color for the cube and returns the cube
function createCube(p,c){
	//Build the cube
	var geometry = new THREE.BoxGeometry(5,5,5);
	
	//var material = new THREE.MeshBasicMaterial({color: parseInt(c)});
	var material = new THREE.MeshPhongMaterial({color: parseInt(c)});
	

	//The final cube will be builded by its geometry and the material
	var cube = new THREE.Mesh(geometry,material);
	cube.position.set(p[0],p[1],p[2]); // Set the random position

	return cube;
}

//Moving the cube
function gotoTarget(cube, target){
	var newX = lerp(cube.position.x,target.x,cube.uptime);
	var newY = lerp(cube.position.y,target.y,cube.uptime);
	var newpos = new THREE.Vector3(newX,newY,2.5);
	//console.log("NEW POSITION: "+newpos.x+","+newpos.y);
	return newpos;
}



//PENDING
function ChangeColor(color,cube){
	//Changes the color of the cube
	//Replace the #, seems like it needs 0x to set a color in hexadecimal
	if(color.includes("#")){
		color = color.replace("#","0x");
	}
	cube.material.color.setHex(color);
}


////////////////////////////////////////////////////////////////////////////////
//Modal

var modal = document.querySelector(".modal");
var btn_modal = document.querySelector(".btn");
var span = document.querySelector(".close");
var save_btn = document.querySelector(".save_btn");
var input_newun = document.querySelector(".in_modal_un");
var input_newc = document.querySelector(".modal_color");

btn_modal.addEventListener("click",function(event){
	modal.style.display="block";
})

span.addEventListener("click",function(event){
	modal.style.display="none";
})

save_btn.addEventListener("click",function(event){
	
	if(input_newun.value.length!=0) Usuario.setun(input_newun.value);
	ChangeColor(input_newc.value,Usuario.cube);

	var data ={
		type:"EDIT",
		id: Usuario.id,
		newun: input_newun.value,
		newc: input_newc.value
	}
	server.sendMessage(data);
	modal.style.display="none";
})
//UTILITIES

//Linear interpolation
function lerp(a,b,t){
	return a+(b-a)*t;
}