
## Chat with 3D environment


Web based chat with a 3D environment for user interaction made for UPF's subject *Entorns de comicació virtual (ECV)* with Client & Server side to learn JavaScript/NodeJS and Three.js.

### Features

- Login Page to choose username
- A 3D environment has been added to the previous chat assignment with the following features:
	- Every User is represented as a cube which is marked with a red Cone
	- Users can move within the plane with arrow keys or by doing left-clicks with the mouse
	- Users can change the Cube color or the User's name by selecting the edition icon (in the top-left side)
	- Every User can receive a message depending on the distance, if you are too far from another user you cannot receive 		his message
- Node Server which handles:
	- Websocket + HTTP server listening to the port 9026
	- Random positions and color for every new user
	- Broadcast of chat messages depending on the distance
- Skybox
- Responsive website behaviour
- Simple Orbital Camera (drag with right-click) + Zoom (scroll or pinch)
- etc

**Screenshots**
<br>
<a href="https://github.com/pvalls/chat3D/raw/master/media_examples/Login%20Page.png"><img src="https://github.com/pvalls/chat3D/raw/master/media_examples/Login%20Page.png" title="Login Page" alt="Login Page" width="400"></a>
<br>
<a href="https://github.com/pvalls/chat3D/raw/master/media_examples/Parelel-users.png"><img src="https://github.com/pvalls/chat3D/raw/master/media_examples/Parelel-users.png" title="Parelel-users.png" alt="Parelel-users.png" width="400"></a>
<br>
<!--<a href="https://github.com/pvalls/chat3D/raw/master/media_examples/User%20Edition.png"><img src="https://github.com/pvalls/chat3D/raw/master/media_examples/User%20Edition.png" title="User Edition" alt="User Edition" width="200"></a>-->

### RUN chat on LOCALHOST

- Install [npm and nodeJS](https://www.npmjs.com)
- Git clone this repository on any directory and change directory to source<br>
```$ git clone https://github.com/pvalls/chat3D ```
```$ cd chat3D/source```

- Install dependencies using provided package.json<br>
```$ npm install```

- Start server<br>
```$ node ChatServer.js```

- Go to browser and open the url<br>
```http://localhost:9026/index.html```


### Authors
@Jinanggd @pvalls<br>
<a href="mailto:lie9762@gmail.com">lie9762@gmail.com</a> <a href="mailto:polvallsrue@gmail.com">polvallsrue@gmail.com</a>

### Pending to implement
- 2D Label Text for the users name and messages
- User avatars (implemented in previous version)
- changing between a fixed camera to first person camera
- clicking other users cube


