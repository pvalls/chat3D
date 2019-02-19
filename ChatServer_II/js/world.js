
var speed = 1;
var elapsed = 1;
//Variables from DOM
var div_world = document.querySelector(".world");

//BASIC ELEMENTS OF THREE.JS

//Initilize renderer
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(1280,648);


//Variables for the 3D Enviroment
var scene = new THREE.Scene();
var center = new THREE.Vector3();
var camera = new THREE.PerspectiveCamera(75,renderer.domElement.width/renderer.domElement.height,0.1,1000 );

camera.position.set(0,-20,80);
camera.up = new THREE.Vector3(0, 0, 1);
camera.lookAt(center);

div_world.appendChild(renderer.domElement);

//SCENE OBJECTS//
var cubes = {}; // Dictionary where key is the user and the value will be the cube


//AMBIENT LIGHT
var color = new THREE.Color(0.6, 0.6, 0.6);
var ambient = new THREE.AmbientLight(color.getHex());
scene.add(ambient);

//POINT LIGHT
// var pointLight = new THREE.PointLight(0xFFFFFF);
// pointLight.position.x = camera.position.x - 10;
// pointLight.position.y = camera.position.y - 10;
// scene.add(pointLight);

//AXIS HELPER
//var axisHelper = new THREE.AxisHelper(5);
//scene.add(axisHelper);

//CUBE
//Vertices and faces of the Box
// var geometry = new THREE.BoxGeometry(5,5,5);
// //Material of the the box
// var material = new THREE.MeshPhongMaterial({color: new THREE.Color('red')});
// //The final cube will be builded by its geometry and the material
// var cube = new THREE.Mesh(geometry,material);
// cube.position.set(0, 0, 2.5);
// scene.add(cube); //by default it will be added at 0,0,0

//PLANE
var planeWidth = 100;
var planeHeight = 70;
var geometry = new THREE.PlaneGeometry( planeWidth, planeHeight);
var texture = new THREE.TextureLoader().load('/img/chess.jpg');
//var texture = new THREE.TextureLoader().load( '/img/texture1.jpg' );
var material = new THREE.MeshBasicMaterial( { map: texture } );
//var material = new THREE.MeshBasicMaterial( {color: 0xC0C0C0, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( geometry, material );
plane.side = THREE.DoubleSide;

scene.add( plane );


var texture = new THREE.TextureLoader().load( '/img/login-background.jpg' );
scene.background = texture;

//Variables to draw the movement
var step = 1/120;
var t = 1.2;
function redraw() {
	//cancelAnimationFrame(frameId);
	requestAnimationFrame(redraw);

	if(renderuser){
		if(Usuario.cube.uptime<=1){
			var newpos = gotoTarget(Usuario.cube,Usuario.cube.endpos);
			//applyBoundaries(newpos);
			Usuario.cube.position.set(newpos.x,newpos.y,newpos.z);
			Usuario.cube.uptime+=step;
		}
		Usuario.cube.rotation.z+=0.01;
	}

	for(var id in cubes){
		if(cubes[id].uptime <= 1){
			var newpos = gotoTarget(cubes[id],cubes[id].endpos);

			cubes[id].position.set(newpos.x,newpos.y,newpos.z);
			cubes[id].uptime+=step;
		}
		cubes[id].rotation.z+=0.01;
		cubes[id].rotation.z+=0.01;
	}

	renderer.render(scene,camera);

}

redraw();

function applyBoundaries(pos){
	if(pos.x < -planeWidth/2+5) pos.x = -planeWidth/2 + 5;
	if(pos.x > planeWidth/2-5) pos.x = planeWidth/2-5; 
	if(pos.y > planeHeight/2-5) pos.y = planeHeight/2-5;
	if(pos.y < -planeHeight/2+5) pos.y = -planeHeight/2+5;
}







