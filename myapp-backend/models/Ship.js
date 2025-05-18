// models/Ship.js
const mongoose = require('mongoose');

const shipSchema = new mongoose.Schema({
  shipName: { type: String, required: true },
  code: { type: String, required: true },
  ip: { type: String, required: true },
  company: { type: String, required: true },
  networkPackage: String,
  activation: String,
  servicePackage: String,
  status: String,
  note: String
});

module.exports = mongoose.model('Ship', shipSchema);
