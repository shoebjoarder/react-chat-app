const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const nicknames = new Map();

io.on("connection", (socket) => {
  console.log(`a user connected with id ${socket.id}`);

  socket.on("register nickname", (nickname) => {
    nicknames.set(socket.id, nickname);
    socket.broadcast.emit("chat message", {
      nickname: "Server",
      message: `User ${nickname} has connected`,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const nickname = nicknames.get(socket.id);
    if (nickname) {
      io.emit("chat message", {
        nickname: "Server",
        message: `User ${nickname} has disconnected`,
      });
      nicknames.delete(socket.id);
    }
  });

  socket.on("chat message", (message) => {
    const nickname = nicknames.get(socket.id) || "Anonymous";
    io.emit("chat message", { nickname, message });
    // Send the message to all clients except the one that triggered the event
    // socket.broadcast.emit("chat message", { nickname, message });
  });
});

// io.on("connection", (socket) => {
//   socket.on("chat message", (msg) => {
//     io.emit("chat message", msg);
//   });
// });

server.listen(3000, () => {
  console.log("listening on *:3000");
});
