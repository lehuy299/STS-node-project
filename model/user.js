const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    avatarUrl: String,
    email: String,
    firstName: String,
    lastName: String,
    dateOfBirth: String,
    role: { type: String, default: 'User' },
    timestamp: Date,
  },
  { collection: 'users' },
);

const model = mongoose.model('UserSchema', UserSchema);

module.exports = model;
