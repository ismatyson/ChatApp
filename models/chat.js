const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const chatSchema = new mongoose.Schema({
  user: {
    type: new mongoose.Schema({
      username: {
        type: String,
        required: true,
      },
    }),
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  dateWritten: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Chat = mongoose.model("chat", chatSchema);

function validateChat(chat) {
  const Schema = Joi.object({
    user: Joi.objectId().required(),
    message: Joi.string().required(),
    dateWritten: Joi.date().required(),
  });

  return Joi.validate(chat, Schema);
}

exports.Chat = Chat;
exports.validate = validateChat;
