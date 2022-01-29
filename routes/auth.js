const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.use(express.json());

router.post("/", async (req, res) => {
  // const { error } = validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Invalid User or Password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid User or Password");

  const token = user.generateAuthToken();

  res.send(token);
});

router.get("/", async (req, res) => {
  const users = await User.find().sort("-username").select("_id username");
  res.send(users);
});

function validate(req) {
  const Schema = {
    username: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, Schema);
}

module.exports = router;
