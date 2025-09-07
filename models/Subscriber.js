// models/Subscriber.js
const mongoose = require('mongoose');
const bot  = require('../bot');

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
subscriberSchema.pre('save', function(next) {
  // Если меняется на подписку, ставим дату
  if (this.isModified('subscribed') && this.subscribed === true) {
    this.subscribedAt = new Date();
  }
  next();
});

subscriberSchema.post('save', async function(doc) {
  try {
    if (doc.isNew) {
      await bot.telegram.sendMessage(process.env.TELEGRAM_ID,
        `👤 Новый пользователь!\n💬 Имя: ${doc.firstName || 'Не указано'}\n🆔 Chat ID: ${doc.chatId}`
      );
    } else if (this.isModified('subscribed')) {
      const status = doc.subscribed ? '✅ Новый подписчик' : '❌ Пользователь отписался';
      await bot.telegram.sendMessage(process.env.TELEGRAM_ID,
        `${status}!\n💬 Имя: ${doc.firstName || 'Не указано'}\n🆔 Chat ID: ${doc.chatId}\n📅 Дата: ${doc.subscribedAt ? doc.subscribedAt.toLocaleString() : '-'}`);
    }
  } catch (err) {
    console.error('Ошибка при уведомлении о подписке/отписке:', err);
  }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);