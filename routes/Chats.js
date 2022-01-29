const { Chat, validate } = require("../models/chat");
const express = require("express");
const { User } = require("../models/user");
const authorization = require("../Middleware/Authorization");
const router = express.Router();

router.use(express.json());

router.post("/", async (req, res) => {
  // const { error } = validate(req.body);
  // if (error) return res.status(404).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send("User not found");

  const chat = new Chat({
    user: user,
    message: req.body.text,
  });

  try {
    const result = await chat.save();
    res.send(result);
  } catch (ex) {
    for (field in ex.errors) console.log(ex.errors[field].message);
  }
});

router.get("/", async (req, res) => {
  const chats = await Chat.find().sort("-dateWritten");
  res.send(chats.reverse());
});

module.exports = router;
