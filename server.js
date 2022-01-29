// credits to https://www.youtube.com/watch?v=kOJEWNPYBUo&t=978s //
const express = require("express");
const winston = require("winston");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require("path");
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const chats = require("./routes/Chats");
const users = require("./routes/Users");
const auth = require("./routes/auth");

require("./startup/logging");
require("./startup/db")();
require("./startup/config")();

app.use(express.json());
app.use(express.static(path.join(__dirname + "/public")));
app.use("/chatroom/chats", chats);
app.use("/chatroom/users", users);
app.use("/chatroom/auth", auth);
app.use(cors(corsOptions));
// app.use(error);

io.on("connection", function (socket) {
  socket.on("newUser", function (username) {
    socket.broadcast.emit("update", username + " " + "joined the coversation");
  });
  socket.on("exituser", function (username) {
    socket.broadcast.emit("update", username + " " + "left the coversation");
  });
  socket.on("chat", function (message) {
    socket.broadcast.emit("chat", message);
  });
});

const port = process.env.PORT || 5000;

server.listen(port, () => winston.info(`Listening on port ${port}..`));

module.exports = server;
