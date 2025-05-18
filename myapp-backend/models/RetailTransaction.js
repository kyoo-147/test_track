const mongoose = require('mongoose');

const RetailTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true }, // Số tiền giao dịch
  status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RetailTransaction', RetailTransactionSchema);