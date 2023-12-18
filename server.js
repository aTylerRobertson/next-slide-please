// Set up express.js server
var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
app.use(express.static('static'));
app.set('view engine', 'pug');

var server = require("http").createServer(app, {
  cors: {
    origin: `https://${process.env.PROJECT_DOMAIN}.glitch.me`,
    methods: ["GET", "POST"]
  }
});

// Get ready for Socket.io connections
var io = require("socket.io")(server);

// Keep a list of active "rooms" where presentations happen
var activeRooms = [];

// Render pages when requested (using the Pug.js view engine)
app.get("/", (req, res) => {
  res.render('index');
});

app.get("/presenter", (req, res) => {
  res.render('presenter');
});

app.get("/viewer", (req, res) => {
  res.render('viewer');
});

// When someone connects to the server
io.on("connection", socket => {
  // Create a new room for a new presentation
  socket.on("createRoom", data => {
    let code = makeRoomCode();
    while (thereIsARoomWithThisCode(code)) {
      code = makeRoomCode();
    }
    activeRooms.push({
      code: code,
      people: 1
    });
    socket.join(code);
    socket.emit("goToRoom", {
      code: code
    });
    console.log("Active Rooms:", activeRooms.length);
  });
  
  // Join existing room
  socket.on("joinRoom", data=> {
    let code = data.code.trim().toUpperCase();
    if (thereIsARoomWithThisCode(code) ) {
      socket.join(code);
      let newRoom = activeRooms.find(room => room.code == code);
      newRoom.people++;
      socket.emit("goToRoom", {
        code: code
      });
    } else {
      socket.emit("noRoomWithCode");
    }
  });
  
  // Advance slides
  socket.on("nextSlide", data => {
    socket.to(data.code).emit("nextSlide");
  });
  
  // Retreat slides
  socket.on("prevSlide", data => {
    socket.to(data.code).emit("prevSlide");
  });

  // Track disconnects to clean up empty rooms
  socket.on('disconnecting', () => {
    socket.rooms.forEach(conn => {
      let leaving = activeRooms.find(room => room.code == conn);
      if (leaving) leaving.people--;
    });
    cleanUpRooms();
  });
});

// Every room uses a four-letter code as an identifier, this function makes those codes
const makeRoomCode = () => {
  const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    let code = "";
    for (let i=0; i < 4; i++) {
      code += alphabet[Math.floor(Math.random()*alphabet.length)];
    }
  return code;
}

// Check to see if there is an active room with the given code identifier
const thereIsARoomWithThisCode = (code) => {
  let matchingRooms = activeRooms.filter(room => room.code == code);
  return matchingRooms.length > 0;
}

// When a room is empty, remove it from the list to free up its code
const cleanUpRooms = () => {
  activeRooms = activeRooms.filter(room => room.people > 0);
  console.log("Active Rooms:", activeRooms.length);
}

// Start listening for requests
server.listen(port, () => {
  console.log("Your app is listening on port %d", port);
});
