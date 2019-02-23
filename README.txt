
## Assignment 2: Chat with 3D environment##


Emails
	pol.valls02@estudiant.upf.edu
	lie.jin01@estudiant.upf.edu

*INFO*

The chat has been created from the Assignment 1's chat application, threrefore there are some 
implementations that are the same as the model.

*NEW FEATURES*

	-A 3D environment has been added to the chat with the following features:
		-Every User is represented as a cube which is marked with a red Cone
		-Users can move within the plane with arrow keys or by doing left-clicks with the mouse
		-Users can change the Cube color or the User's name by selecting the edition icon (in the top-left side)
		-Every User can receive a message depending on the distance, if you are too far from another user you cannot receive his message
	-Node Server which handles:
		-Websocket + HTTP server listening to the port 9026
		-Random positions and color for every new user
		-Broadcast of chat messages depending on the distance
	-Skybox
	-Responsive website
	-Simple Orbital Camera (drag with right-click) + Zoom (scroll or pinch)

*CONNECTING TO THE CHAT*

In order to connect to the chat we need to start the server by doing <node ChatServer.js> and open in the browser the following 
url: http://ecv-etic.upf.edu:9026/index.html

*ISSUES*

*THINGS PENDING*
	-2D Label Text for the users' name and messages
	-changing between a fixed camera to first person camera
	-clicking other users cube






