const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  winston.add(new winston.transports.File({ filename: "error.log" }));
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost/chatApp",
      level: "info",
    })
  );
};
