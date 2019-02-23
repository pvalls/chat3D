//Here we manage all the inputs from the user ( keyboard and mouse )

//KEYBOARD HANDLING -- Movement of the object with the arrow keys
document.addEventListener("keydown",keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

//Moving the object with the arrows keys
function keyDownHandler(event){
	var step = 5;
	var actualpos;
	if(renderuser) actualpos = Usuario.cube.position;
	switch(event.keyCode){
		case 39: //Arrow Right
			Usuario.setEnd(new THREE.Vector3(actualpos.x+step,actualpos.y,actualpos.z));
		break;
		case 37: //Arrow left
			Usuario.setEnd(new THREE.Vector3(actualpos.x-step,actualpos.y,actualpos.z));
		break;
		case 40: //Arrow Down
			Usuario.setEnd(new THREE.Vector3(actualpos.x,actualpos.y-step,actualpos.z));
		break;
		case 38: //Arrow Up
			Usuario.setEnd(new THREE.Vector3(actualpos.x,actualpos.y+step,actualpos.z));
		break;
	}
}

//empty for now
function keyUpHandler(event){}


// MOUSE HANDLING -- Dragging, zoom, moving camera etc... 
// RESOURCE: SIMPLE ORBITAL CAMERA
// LINK: https://andreasrohner.at/posts/Web%20Development/JavaScript/Simple-orbital-camera-controls-for-THREE-js/

//Implementation of Dragging
function drag(deltaX, deltaY) {
    var radPerPixel = (Math.PI / 450),
	    deltaPhi = radPerPixel * deltaX,
	    deltaTheta = radPerPixel * deltaY,
	    pos = camera.position.sub(center),
	    radius = pos.length(),
	    theta = Math.acos(pos.z / radius),
	    phi = Math.atan2(pos.y, pos.x);

	// Subtract deltaTheta and deltaPhi
	theta = Math.min(Math.max(theta - deltaTheta, 0), Math.PI);
	phi -= deltaPhi;

	// Turn back into Cartesian coordinates
	pos.x = radius * Math.sin(theta) * Math.cos(phi);
	pos.y = radius * Math.sin(theta) * Math.sin(phi);
	pos.z = radius * Math.cos(theta);

	camera.position.add(center);
	camera.lookAt(center);
}

//Implementation of Zooming
function zoomIn() { camera.position.sub(center).multiplyScalar(0.9).add(center);}
function zoomOut() { camera.position.sub(center).multiplyScalar(1.1).add(center);}

var Controls = (function(Controls) {
    "use strict";

	// Check for double inclusion
	if (Controls.addMouseHandler)
		return Controls;

	Controls.addMouseHandler = function (domObject, drag, zoomIn, zoomOut) {
		var startDragX = null,
		    startDragY = null;

		function mouseWheelHandler(e) {
			e = window.event || e;
			var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

			if (delta < 0 && zoomOut) {
				zoomOut(delta);
			} else if (zoomIn) {
				zoomIn(delta);
			}

			e.preventDefault();
		}

		//Here we handle two differenct behaviours
		function mouseDownHandler(e) {
			//rightClick -- Moving the camera
			if(e.which==3){
				startDragX = e.clientX;
				startDragY = e.clientY;
			}
			
			//Leftclick -- Moving the object (cube)
			if(e.which == 1){
				var mouse = new THREE.Vector2();
				var rayCaster = new THREE.Raycaster();
				var rect = renderer.domElement.getBoundingClientRect();
				mouse.x = e.pageX-rect.x;
				mouse.y = e.pageY-rect.y;
				//console.log("POINT: "+ mouse.x+","+mouse.y);
				mouse.x = (mouse.x/renderer.domElement.width)*2-1;
				mouse.y=-(mouse.y/renderer.domElement.height)*2+1;
				//console.log("POINT in 3D: "+mouse.x+","+mouse.y);
				rayCaster.setFromCamera(mouse,camera);
				var intersection = rayCaster.intersectObject(plane);
				var pos = intersection[0].point;
				pos.z = 2.5;
				Usuario.setEnd(pos);
			}
			e.preventDefault();
		}

		function mouseMoveHandler(e) {
			if (startDragX === null || startDragY === null)
				return;

			if (drag)
				drag(e.clientX - startDragX, e.clientY - startDragY);

			startDragX = e.clientX;
			startDragY = e.clientY;

			e.preventDefault();
		}

		function mouseUpHandler(e) {
			mouseMoveHandler.call(this, e);
			startDragX = null;
			startDragY = null;

			e.preventDefault();
		}

		domObject.addEventListener("mousewheel", mouseWheelHandler);
		domObject.addEventListener("DOMMouseScroll", mouseWheelHandler);
		domObject.addEventListener("mousedown", mouseDownHandler);
		domObject.addEventListener("mousemove", mouseMoveHandler);
		domObject.addEventListener("mouseup", mouseUpHandler);
	};
	return Controls;
}(Controls || {}));

Controls.addMouseHandler(renderer.domElement, drag, zoomIn, zoomOut);
