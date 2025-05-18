// models/Speed.js
const mongoose = require('mongoose');

const speedSchema = new mongoose.Schema({
  upRate:       { type: Number, required: true },   // Mbps
  downRate:     { type: Number, required: true },   // Mbps
  burst:        { type: String },                   // e.g. "8M/8M"
  description:  { type: String, trim: true },
  note:         { type: String, trim: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('SpeedSetting', speedSchema);
