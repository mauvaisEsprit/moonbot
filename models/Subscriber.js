// models/Subscriber.js
const mongoose = require('mongoose');
const bot = require('../bot');

const subscriberSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true },
  firstName: String,
  zodiacSign: { type: String, default: null },
  subscribed: { type: Boolean, default: true },
  subscribedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Уведомление о новом пользователе
subscriberSchema.post('save', async function (doc) {
  if (doc.isNew) {
    try {
      const message = `👤 Новый пользователь!\n\n` +
                      `💬 Имя: ${doc.firstName || 'Не указано'}\n` +
                      `🆔 Chat ID: ${doc.chatId}\n` +
                      `📅 Зарегистрирован: ${doc.createdAt.toLocaleString()}`;
      await bot.telegram.sendMessage(process.env.TELEGRAM_ID, message);
    } catch (err) {
      console.error('Ошибка при уведомлении о новом пользователе:', err);
    }
  }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);