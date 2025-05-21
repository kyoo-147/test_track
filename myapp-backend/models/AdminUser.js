const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  username:   { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  role:       { type: String, enum: ['Admin', 'Tech', 'Sales'], required: true },
  company:    { type: mongoose.Schema.Types.ObjectId, ref: 'Company' } // chỉ dùng cho Tech
}, { timestamps: true });

module.exports = mongoose.model('AdminUser', adminUserSchema);