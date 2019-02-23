//Here we create and renders the 3D Scene

//Global Variables
var div_world = document.querySelector(".world"); //Variables from DOM
var renderer;
var scene;
var camera;
var cubes = {}; // Dictionary where key is the user and the value will be the cube
var ambient;
var spotLight;
var plane;
var planeWidth = 100;
var planeHeight = 70;
var center = new THREE.Vector3();
var canvas; 

//Variable to draw the movement-- Indicates the steps in the lerp of the movement
var step = 1/120;

init_world()
redraw();
function init_world(){
	renderer = new THREE.WebGLRenderer({antialias:true});
	//renderer.setSize(div_world.offsetWidth,div_world.offsetHeight);
	scene = new THREE.Scene();
	div_world.appendChild(renderer.domElement);
	canvas = renderer.domElement;

	//Camera
	//camera.aspect = renderer.domElement.width/renderer.domElement.height;
	camera = new THREE.PerspectiveCamera(75,renderer.domElement.width/renderer.domElement.height,0.1,1000);
	camera.position.set(0,-20,80);
	camera.up = new THREE.Vector3(0,0,1);
	camera.lookAt(center);

	//Light
	var color = new THREE.Color(0.6, 0.6, 0.6);
	ambient = new THREE.AmbientLight(color.getHex());
	scene.add(ambient);

	spotLight = new THREE.SpotLight( 0xffffff );
	spotLight.position.set( 100, 1000, 100 );
	spotLight.castShadow = true;
	spotLight.angle = Math.PI/2;

	scene.add( spotLight );


	//Plane
	var geometry = new THREE.PlaneGeometry( planeWidth, planeHeight);
	// var material = new THREE.TextureLoader().load('/img/chess.jpg');
	var material = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( '/img/chess.jpg' ) });
	//var material = new THREE.MeshPhongMaterial( { color:"grey"} );
	plane = new THREE.Mesh( geometry, material );
	plane.side = THREE.DoubleSide;
	scene.add( plane );

	//Background Texture
	skybox();
	//var texture = new THREE.TextureLoader().load( '/img/login-background.jpg' );
	//scene.background = texture;
}

//Animation
function redraw() {
	requestAnimationFrame(redraw);
	resizeDisplay();
	//Rendering User's cube
	if(renderuser){ renderUser(); }
	//Rendering other's cubes
	renderCubes();
}

//UTILITIES 

//Applying boundaries 
//Here we force the position being inside the plane.
//If the position surpasses the limits we set them to the limit
function applyBoundaries(pos){
	if(pos.x < -planeWidth/2+5) pos.x = -planeWidth/2 + 5;
	if(pos.x > planeWidth/2-5) pos.x = planeWidth/2-5; 
	if(pos.y > planeHeight/2-5) pos.y = planeHeight/2-5;
	if(pos.y < -planeHeight/2+5) pos.y = -planeHeight/2+5;
}

//Resizing the display
function resizeDisplay(){
	var canvas = renderer.domElement;
	var w = canvas.clientWidth;
	var h = canvas.clientHeight;
	if(canvas.width !==w || canvas.height !==h){
		renderer.setSize(w,h,false);
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
	}
}

//Adds an skybox to the scene background
function skybox(){
	var materialArray = [];
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'img/sky2/nebula_px.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'img/sky2/nebula_nx.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'img/sky2/nebula_py.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'img/sky2/nebula_ny.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'img/sky2/nebula_pz.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'img/sky2/nebula_nz.jpg' ) }));

	for (var i = 0; i < 6; i++) 
	   materialArray[i].side = THREE.BackSide;

	var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyboxGeom = new THREE.CubeGeometry( 500, 500, 500);
	var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
	scene.add( skybox );
}

// RENDERING

//The movement of each cube is done by:
//1- Set an endpoint (destination) of the cube
//2- The movement will be the lerp from the startpoint to the endpoint
//2.1- Starts the lerp by setting uptime =0
//2.2- Compute new position with gotoTarget (lerp)
//2.3- ++ uptime with the steps
function renderUser(){
	if(Usuario.cube.uptime<=1){
		var newpos = gotoTarget(Usuario.cube,Usuario.cube.endpos);
		Usuario.cube.position.set(newpos.x,newpos.y,newpos.z);
		Usuario.cube.uptime+=step;
		Usuario.cone.position.set(newpos.x,newpos.y, Usuario.cone.position.z);

		//spotLight.position.set( newpos.x,newpos.y, Usuario.cone.position.z+6 );
	}
	spotLight.position.set(Usuario.cone.position.x,Usuario.cone.position.y,Usuario.cone.position.z+6);
	spotLight.target = Usuario.cube;
	Usuario.cube.rotation.z+=0.01;
	Usuario.cone.rotation.y+=0.01;
}

function renderCubes(){
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