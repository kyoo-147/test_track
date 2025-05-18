// models/Package.js
const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name:          { type: String, required: true },     // Tên gói
  type:          { type: String, required: true },     // Loại gói
  category:      { type: String, required: true },     // Phân loại
  price:         { type: Number, required: true },     // Giá
  duration:      { type: Number, required: true },     // Thời gian (ngày)
  volume:        { type: String, required: true },     // Dung lượng (e.g. "50G")
  speed:         { type: String, required: true },     // Tốc độ (e.g. "10/10 Mbps")
  shipName:      { type: String, required: true },     // Tên tàu
  note:          { type: String }                      // Ghi chú
}, {
  timestamps: true
});

module.exports = mongoose.model('Package', packageSchema);
