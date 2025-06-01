const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },        // Investment amount in USD
  tier: { type: String, enum: ['seed', 'growth', 'expansion'], required: true },
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'Investor', required: true },
  transactionRef: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Investment', investmentSchema);