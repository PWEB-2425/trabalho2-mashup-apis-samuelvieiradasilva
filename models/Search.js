const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    city: String,
    weather: Number,
    country: String,
    currency: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Search', searchSchema);
