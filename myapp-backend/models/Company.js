// models/Company.js
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  ship: String,
  networkPackage: String,
  networkStatus: String,
  servicePackage: String,
  topUp: String,
  serviceStatus: String,
  phone: String,
  note: String,
  createdAt: { type: Date, default: Date.now } // Thêm trường createdAt
});

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  subscriptions: [subscriptionSchema]
});

module.exports = mongoose.model('Company', companySchema);
