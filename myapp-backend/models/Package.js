// // models/Package.js
// const mongoose = require('mongoose');

// const packageSchema = new mongoose.Schema({
//   name:          { type: String, required: true },     // Tên gói
//   type:          { type: String, required: true },     // Loại gói
//   category:      { type: String, required: true },     // Phân loại
//   price:         { type: Number, required: true },     // Giá
//   duration:      { type: Number, required: true },     // Thời gian (ngày)
//   volume:        { type: String, required: true },     // Dung lượng (e.g. "50G")
//   speed:         { type: String, required: true },     // Tốc độ (e.g. "10/10 Mbps")
//   shipName:      { type: String, required: true },     // Tên tàu
//   note:          { type: String }                      // Ghi chú
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('Package', packageSchema);

// models/Package.js
const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name:        { type: String, required: true }, // Tên gói
  radius:      { type: String },                 // ls Radius
  limitType:   { type: String, enum: ['Time Limit', 'Data Limit', 'Both Limit'], required: true },
  bandwidth:   { type: String, required: true }, // Bandwidth (dropdown)
  validity:    { type: Number, required: true }, // Package Validity (số)
  unit:        { type: String, enum: ['1hour', 'day', '1w', '1 tháng'], required: true },
  price:       { type: Number, required: true }, // Package Price
  sharedUsers: { type: Number, min: 1, max: 10, required: true },
  vessel:      { type: mongoose.Schema.Types.ObjectId, ref: 'Ship', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
