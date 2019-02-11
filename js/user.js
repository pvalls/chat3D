function User(un,cr,a,id){
	this.username = un;
	this.chatroom = cr;
	this.avatar = a;
	this.id = id;
}
//Avatar icons
var user_avatar = document.querySelectorAll("#user");
var man_avatar = document.querySelectorAll("#man");
var girl_avatar = document.querySelectorAll("#girl");
var pikachu_avatar = document.querySelectorAll("#pikachu");
//Divs
var div_usercontainer = document.querySelector(".user_container");
var div_userID = document.querySelector(".user_ID");
var div_modal1 = document.getElementById("modalC");
var div_modal2 = document.getElementById("modalU");
//Buttons
var modal1_btn = document.querySelector(".changeCR_btn");
var modal2_btn = document.querySelector(".changeUN_btn");
var OK = document.querySelector(".OK");
var OK_CR = document.querySelector(".OKchatroom");
//Default user avatar
var avatarname = "img/user.png";
var selectedAvatar = document.querySelectorAll("#user");
//Input
var new_CR = document.querySelector(".in_cr_new");
//span
var span = document.querySelectorAll(".close");

modal1_btn.addEventListener("click",function(){
	div_modal1.style.display="block";

});

modal2_btn.addEventListener("click",function(){
	div_modal2.style.display="block";
	markAvatar(selectedAvatar);
});

span.forEach(function(elem){
	elem.addEventListener("click",function(){
		div_modal1.style.display="none";
		div_modal2.style.display="none";
	});
});

OK.addEventListener("click",function(){
	Usuario.avatar = avatarname;
	showAvatar();
	var data_modified={
		type: "update",
		user: Usuario
	};
	server.sendMessage(data_modified);
	div_modal2.style.display="none";
});

OK_CR.addEventListener("click",function(event){
	if(new_CR!=""){
		server.close();
		while(div_msg.firstChild) {
 			div_msg.removeChild(div_msg.firstChild);
		}
		myChatHistory = [];
		users = [];
		input_cr.value=new_CR.value;
		div_header.textContent = "Chatroom \""+input_cr.value +"\"";
		server.connect("ecv-etic.upf.edu:9000",input_cr.value);
		onUsersOnline();
		div_modal1.style.display="none";
	}
});

markAvatar(selectedAvatar);

user_avatar.forEach(function(elem){
	elem.addEventListener("click",function(event){
		avatarname = "img/user.png";
		selectedAvatar = UnmarkandMarkAvatar(selectedAvatar,user_avatar);
		markAvatar(selectedAvatar);
	});
});
man_avatar.forEach(function(elem){
	elem.addEventListener("click",function(event){
		avatarname = "img/man.png";
		selectedAvatar = UnmarkandMarkAvatar(selectedAvatar,man_avatar);
		markAvatar(selectedAvatar);
	});
});
girl_avatar.forEach(function(elem){
	elem.addEventListener("click",function(event){
		avatarname = "img/girl.png";
		selectedAvatar = UnmarkandMarkAvatar(selectedAvatar,girl_avatar);
		markAvatar(selectedAvatar);
	});
});
pikachu_avatar.forEach(function(elem){
	elem.addEventListener("click",function(event){
		avatarname = "img/pikachu.png";
		selectedAvatar = UnmarkandMarkAvatar(selectedAvatar,pikachu_avatar);
		markAvatar(selectedAvatar);
	});
});


function showAvatar(){
	//Erase previous elements
	while(div_userID.firstChild){
		div_userID.removeChild(div_userID.firstChild);
	}
	//Add news
	var img = document.createElement("img");
	img.src = Usuario.avatar;
	img.className = "user_avatar";
	div_userID.appendChild(img);

	var p = document.createElement("p");
	p.appendChild(document.createTextNode(Usuario.username));
	div_userID.appendChild(p);
}

function markAvatar(selected){
	for(var i=0; i<selected.length;++i){
		selected[i].style.border = "5px solid #E8272C";
		selected[i].style.borderRadius = "10px";
	}
}

function UnmarkandMarkAvatar(selected, target){
	console.log("HOLA");
	for(var i=0; i<selected.length;++i){
		selected[i].style= "none";
	}
	selected = target;
	return selected;
}

