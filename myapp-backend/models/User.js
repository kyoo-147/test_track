// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:    { type: String, required: true },
  role:        { type: String, required: true },
  password:    { type: String, required: true },
  serviceType: { type: String, required: true },
  pkg:         { type: String, required: true },
  activation:  { type: String, required: true },
  createdAt:   { type: Date,   required: true, default: Date.now },
  status:      { type: String, required: true },
  deviceSerial:{ type: String }
});

module.exports = mongoose.model('User', userSchema);
