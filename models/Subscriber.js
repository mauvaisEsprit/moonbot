const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: String,
  zodiacSign: { type: String, default: null },
  subscribed: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Subscriber', subscriberSchema);
