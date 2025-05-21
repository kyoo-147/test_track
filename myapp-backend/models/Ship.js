// models/Ship.js
const mongoose = require('mongoose');

const shipSchema = new mongoose.Schema({
  shipName: { type: String, required: true },
  mmsi: { type: String, required: true },
  ip: { type: String, required: true },
  shipType: { type: String, required: true },
  installationDate: { type: Date, required: true },
  deviceType: { type: String, required: true },
  starlinkStatus: {
    type: String,
    required: true,
    enum: ['Online', 'Offline', 'Maintenance', 'Unknown']
  },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  networkPackage: { type: String, required: true },
  servicePackage: { type: String, required: true },
  note: { type: String }
});

module.exports = mongoose.model('Ship', shipSchema);
