const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const router = express.Router();

router.use(express.json());

router.post("/", async (req, res) => {
  // const { error } = validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).send("User Already Exists!");

  user = new User(_.pick(req.body, ["username", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.send(token);
});

router.get("/", async (req, res) => {
  const users = await User.find().sort("-username").select("username");
  res.send(users);
});

module.exports = router;
