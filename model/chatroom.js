const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  authUsers: [{
    type: String,
  }],
});

module.exports = mongoose.model("Chatroom", chatroomSchema);