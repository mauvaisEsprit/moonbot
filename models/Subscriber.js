// models/Subscriber.js
const mongoose = require('mongoose');
const { bot } = require('../bot');

const subscriberSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true },
  firstName: String,
  zodiacSign: { type: String, default: null },
  subscribed: { type: Boolean, default: true },
  subscribedAt: { type: Date, default: Date.now },
}, { timestamps: true });

/**
 * Уведомление о новом пользователе
 */
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
  } else if (this.isModified && this.isModified('subscribed') && doc.subscribed === true) {
    // Если при сохранении поменяли subscribed → true
    try {
      const message = `✅ Новый подписчик!\n\n` +
                      `💬 Имя: ${doc.firstName || 'Не указано'}\n` +
                      `🆔 Chat ID: ${doc.chatId}\n` +
                      `📅 Подписан: ${doc.subscribedAt.toLocaleString()}`;
      await bot.telegram.sendMessage(process.env.TELEGRAM_ID, message);
    } catch (err) {
      console.error('Ошибка при уведомлении о новой подписке:', err);
    }
  }
});

/**
 * Уведомление о подписке при findOneAndUpdate
 */
subscriberSchema.post('findOneAndUpdate', async function (res) {
  if (!res) return;
  try {
    // Проверяем что updatedDoc.subscribed стал true
    if (res.subscribed === true) {
      const message = `✅ Новый подписчик!\n\n` +
                      `💬 Имя: ${res.firstName || 'Не указано'}\n` +
                      `🆔 Chat ID: ${res.chatId}\n` +
                      `📅 Подписан: ${res.subscribedAt.toLocaleString()}`;
      await bot.telegram.sendMessage(process.env.TELEGRAM_ID, message);
    }
  } catch (err) {
    console.error('Ошибка при уведомлении о новой подписке (findOneAndUpdate):', err);
  }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);