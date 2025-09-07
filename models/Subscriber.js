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

// Если меняется на подписку, ставим дату
subscriberSchema.pre('save', function(next) {
  if (this.isModified('subscribed') && this.subscribed === true) {
    this.subscribedAt = new Date();
  }
  next();
});

// Хук для save()
subscriberSchema.post('save', async function(doc) {
  try {
    if (doc.isNew) {
      // Новый пользователь
      await bot.telegram.sendMessage(process.env.TELEGRAM_ID,
        `👤 Новый пользователь!\n💬 Имя: ${doc.firstName || 'Не указано'}\n🆔 Chat ID: ${doc.chatId}`
      );
    } else if (this.isModified('subscribed')) {
      // Подписка/отписка
      const status = doc.subscribed ? '✅ Новый подписчик' : '❌ Пользователь отписался';
      await bot.telegram.sendMessage(process.env.TELEGRAM_ID,
        `${status}!\n💬 Имя: ${doc.firstName || 'Не указано'}\n🆔 Chat ID: ${doc.chatId}\n📅 Дата: ${doc.subscribedAt ? doc.subscribedAt.toLocaleString() : '-'}`
      );
    }
  } catch (err) {
    console.error('Ошибка при уведомлении о подписке/отписке:', err);
  }
});

// Хук для findOneAndUpdate (апдейты через upsert)
subscriberSchema.post('findOneAndUpdate', async function(res) {
  if (!res) return;
  try {
    const modified = this.getUpdate();
    if (!modified) return;

    // Проверяем, что изменилось поле subscribed
    if (modified.subscribed !== undefined) {
      const status = modified.subscribed ? '✅ Новый подписчик' : '❌ Пользователь отписался';
      await bot.telegram.sendMessage(process.env.TELEGRAM_ID,
       `${status}!\n💬 Имя: ${res.firstName || 'Не указано'}\n🆔 Chat ID: ${res.chatId}\n📅 Дата: ${res.subscribedAt ? res.subscribedAt.toLocaleString() : '-'}`
      );
    }
  } catch (err) {
    console.error('Ошибка при уведомлении о подписке/отписке (findOneAndUpdate):', err);
  }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);