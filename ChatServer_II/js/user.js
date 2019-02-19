function User(un){
	this.username = un;
	this.cube = null;
//	this.chatroom = cr;
//	this.avatar = a;
	this.id = -1;

}

User.prototype.setId = function(id){
	this.id = id;
}

User.prototype.setCube = function(p,c){
	this.cube = createCube(p,c);
}

User.prototype.setEnd = function(pos){
	//this.end = pos;
	applyBoundaries(pos)
	this.cube.endpos = pos;
	//this.update = true;
	this.cube.uptime = 0;
	t=0;
	sendEndPos(this.cube.endpos);
	//this.distance = Math.sqrt((this.end.x-this.cube.position.x)*(this.end.x-this.cube.position.x)+(this.end.y-this.cube.position.y)*(this.end.y-this.cube.position.y));
}

function sendEndPos(pos){
	var position = [pos.x, pos.y, pos.z];
	var data ={
			type:"WRLDUPDATE",
			id: Usuario.id,
			pos : position
		};
	server.sendMessage(data);
}

function createCube(p,c){
	//Receives a position and a color for the cube and returns the cube

	//Build the cube
	var geometry = new THREE.BoxGeometry(5,5,5);
	
	//var material = new THREE.MeshBasicMaterial({color: parseInt(c)});
	var material = new THREE.MeshPhongMaterial({color: parseInt(c)});
	

	//The final cube will be builded by its geometry and the material
	var cube = new THREE.Mesh(geometry,material);
	cube.position.set(p[0],p[1],p[2]); // Set the random position

	return cube;
}

//variables for moving the cube
function gotoTarget(cube, target){
	
	var newX = lerp(cube.position.x,target.x,cube.uptime);
	var newY = lerp(cube.position.y,target.y,cube.uptime);
	var newpos = new THREE.Vector3(newX,newY,2.5);
	//console.log("NEW POSITION: "+newpos.x+","+newpos.y);
	return newpos;
}

//Linear interpolation
function lerp(a,b,t){
	return a+(b-a)*t;
}
// function ChangeColor(color,cube){
// 	//Changes the color of the cube
// 	//Replace the #, seems like it needs 0x to set a color in hexadecimal
// 	if(color.includes("#")){
// 		color = color.replace("#","0x");
// 	}
// 	cube.material.color.setHex(color);
// }


// //Avatar icons
// var user_avatar = document.querySelectorAll("#user");
// var man_avatar = document.querySelectorAll("#man");
// var girl_avatar = document.querySelectorAll("#girl");
// var pikachu_avatar = document.querySelectorAll("#pikachu");
// //Divs
// var div_usercontainer = document.querySelector(".user_container");
// var div_userID = document.querySelector(".user_ID");
// var div_modal1 = document.getElementById("modalC");
// var div_modal2 = document.getElementById("modalU");
// //Buttons
// var modal1_btn = document.querySelector(".changeCR_btn");
// var modal2_btn = document.querySelector(".changeUN_btn");
// var OK = document.querySelector(".OK");
// var OK_CR = document.querySelector(".OKchatroom");
// //Default user avatar
// var avatarname = "img/user.png";
// var selectedAvatar = document.querySelectorAll("#user");
// //Input
// var new_CR = document.querySelector(".in_cr_new");
// //span
// var span = document.querySelectorAll(".close");

// modal1_btn.addEventListener("click",function(){
// 	div_modal1.style.display="block";

// });

// modal2_btn.addEventListener("click",function(){
// 	div_modal2.style.display="block";
// 	markAvatar(selectedAvatar);
// });

// span.forEach(function(elem){
// 	elem.addEventListener("click",function(){
// 		div_modal1.style.display="none";
// 		div_modal2.style.display="none";
// 	});
// });

// OK.addEventListener("click",function(){
// 	Usuario.avatar = avatarname;
// 	showAvatar();
// 	var data_modified={
// 		type: "update",
// 		user: Usuario
// 	};
// 	server.sendMessage(data_modified);
// 	div_modal2.style.display="none";
// });

// OK_CR.addEventListener("click",function(event){
// 	if(new_CR!=""){
// 		server.close();
// 		while(div_msg.firstChild) {
//  			div_msg.removeChild(div_msg.firstChild);
// 		}
// 		myChatHistory = [];
// 		users = [];
// 		input_cr.value=new_CR.value;
// 		div_header.textContent = "Chatroom \""+input_cr.value +"\"";
// 		server.connect("ecv-etic.upf.edu:9000",input_cr.value);
// 		onUsersOnline();
// 		div_modal1.style.display="none";
// 	}
// });

// markAvatar(selectedAvatar);

// user_avatar.forEach(function(elem){
// 	elem.addEventListener("click",function(event){
// 		avatarname = "img/user.png";
// 		selectedAvatar = UnmarkandMarkAvatar(selectedAvatar,user_avatar);
// 		markAvatar(selectedAvatar);
// 	});
// });
// man_avatar.forEach(function(elem){
// 	elem.addEventListener("click",function(event){
// 		avatarname = "img/man.png";
// 		selectedAvatar = UnmarkandMarkAvatar(selectedAvatar,man_avatar);
// 		markAvatar(selectedAvatar);
// 	});
// });
// girl_avatar.forEach(function(elem){
// 	elem.addEventListener("click",function(event){
// 		avatarname = "img/girl.png";
// 		selectedAvatar = UnmarkandMarkAvatar(selectedAvatar,girl_avatar);
// 		markAvatar(selectedAvatar);
// 	});
// });
// pikachu_avatar.forEach(function(elem){
// 	elem.addEventListener("click",function(event){
// 		avatarname = "img/pikachu.png";
// 		selectedAvatar = UnmarkandMarkAvatar(selectedAvatar,pikachu_avatar);
// 		markAvatar(selectedAvatar);
// 	});
// });


// function showAvatar(){
// 	//Erase previous elements
// 	while(div_userID.firstChild){
// 		div_userID.removeChild(div_userID.firstChild);
// 	}
// 	//Add news
// 	var img = document.createElement("img");
// 	img.src = Usuario.avatar;
// 	img.className = "user_avatar";
// 	div_userID.appendChild(img);

// 	var p = document.createElement("p");
// 	p.appendChild(document.createTextNode(Usuario.username));
// 	div_userID.appendChild(p);
// }

// function markAvatar(selected){
// 	for(var i=0; i<selected.length;++i){
// 		selected[i].style.border = "5px solid #E8272C";
// 		selected[i].style.borderRadius = "10px";
// 	}
// }

// function UnmarkandMarkAvatar(selected, target){
// 	console.log("HOLA");
// 	for(var i=0; i<selected.length;++i){
// 		selected[i].style= "none";
// 	}
// 	selected = target;
// 	return selected;
// }

