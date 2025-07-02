const mongoose = require('mongoose');

const SearchSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  city: String,
  weather: Number,
  country: String,
  currency: String
}, {
  timestamps: true // ← isso ativa o createdAt/updatedAt automaticamente
});

module.exports = mongoose.model('Search', SearchSchema);
