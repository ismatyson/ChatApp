const express = require("express");
const chats = require("../routes/Chats");
const users = require("../routes/Users");
const auth = require("../routes/auth");
const { error } = require("../Middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use(express.static(path.join(__dirname + "/public")));
  app.use("/chatroom/chats", chats);
  app.use("/chatroom/users", users);
  app.use("/chatroom/auth", auth);
  app.use(error);
};
