// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:    { type: String, required: true },
  role:        { type: String, required: true },
  password:    { type: String, required: true },
  ship:        { type: mongoose.Schema.Types.ObjectId, ref: 'Ship', required: true },
  serviceType: { type: String, required: true },
  pkg:         { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  volumeLimit: { type: String, required: true },
  usedVolume:  { type: String, required: true, default: '0G' },
  activation:  { type: String, required: true },
  createdAt:   { type: Date,   required: true, default: Date.now },
  updatedAt:   { type: Date,   default: null },
  createdBy:   { type: String, required: true },
  status:      { type: String, required: true }
}, {
  versionKey: false
});

module.exports = mongoose.model('User', userSchema);
