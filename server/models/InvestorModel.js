const mongoose = require('mongoose');

const investorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  investments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Investment' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Investor', investorSchema);