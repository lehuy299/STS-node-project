const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chatroom",
  },
  user: {
    type: String,
    required: "User is required!",
    ref: "User",
  },
  message: {
    type: String,
    required: "Message is required!",
  },
  seenList: [{
    type: String,
  }],
  sentTime: {
    type: String,
  }
});

module.exports = mongoose.model("Message", messageSchema);