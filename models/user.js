const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 5,
    max: 10,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 120,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("user", userSchema);

function validateUser(user) {
  const Schema = {
    username: Joi.string().min(5).max(10).required(),
    password: Joi.string().min(8).max(120).required(),
  };

  return Joi.validate(user, Schema);
}

exports.User = User;
exports.validate = validateUser;
