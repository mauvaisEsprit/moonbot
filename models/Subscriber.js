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

// =========================
// pre-save: обновляем subscribedAt при подписке
// =========================
subscriberSchema.pre('save', function(next) {
  if (this.isModified('subscribed') && this.subscribed === true) {
    console.log(`PRE SAVE HOOK: Подписка! Устанавливаем subscribedAt для ${this.chatId}`);
    this.subscribedAt = new Date();
  }
  next();
});

// =========================
// post-save: уведомления о новом пользователе или смене подписки
// =========================
subscriberSchema.post('save', async function(doc) {
  console.log('--- POST SAVE HOOK ---');
  console.log('doc.isNew:', doc.isNew);
  console.log('doc.subscribed:', doc.subscribed);

  try {
    if (doc.isNew) {
      console.log('Отправляем сообщение о новом пользователе');
      await bot.sendMessage(process.env.TELEGRAM_ID,
        `👤 Новый пользователь!\n💬 Имя: ${doc.firstName || 'Не указано'}\n🆔 Chat ID: ${doc.chatId}`
      );
      console.log('Сообщение о новом пользователе отправлено');
    } else if (this.isModified('subscribed')) {
      const status = doc.subscribed ? '✅ Новый подписчик' : '❌ Пользователь отписался';
      console.log('Отправляем сообщение о смене статуса:', status);
      await bot.sendMessage(process.env.TELEGRAM_ID,
        `${status}!\n💬 Имя: ${doc.firstName || 'Не указано'}\n🆔 Chat ID: ${doc.chatId}\n📅 Дата: ${doc.subscribedAt ? doc.subscribedAt.toLocaleString() : '-'}`
      );
      console.log('Сообщение о смене статуса отправлено');
    }
  } catch (err) {
    console.error('Ошибка при уведомлении о подписке/отписке (save):', err);
  }
});

// =========================
// post-findOneAndUpdate: уведомления при обновлении через findOneAndUpdate
// =========================
subscriberSchema.post('findOneAndUpdate', async function(res) {
  console.log('--- POST FINDONEANDUPDATE HOOK ---');
  if (!res) {
    console.log('res пустой, ничего не делаем');
    return;
  }
  console.log('res.subscribed:', res.subscribed);

  try {
    const modified = this.getUpdate();
    console.log('getUpdate():', modified);
    if (!modified) {
      console.log('modified пустой, ничего не делаем');
      return;
    }

    if (modified.subscribed !== undefined) {
      const status = modified.subscribed ? '✅ Новый подписчик' : '❌ Пользователь отписался';
      console.log('Отправляем сообщение о смене статуса через findOneAndUpdate:', status);
      await bot.sendMessage(process.env.TELEGRAM_ID,
        `${status}!\n💬 Имя: ${res.firstName || 'Не указано'}\n🆔 Chat ID: ${res.chatId}\n📅 Дата: ${res.subscribedAt ? res.subscribedAt.toLocaleString() : '-'}`
      );
      console.log('Сообщение через findOneAndUpdate отправлено');
    }
  } catch (err) {
    console.error('Ошибка при уведомлении о подписке/отписке (findOneAndUpdate):', err);
  }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);