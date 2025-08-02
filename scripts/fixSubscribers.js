// utils/fixSubscribers.js

require('dotenv').config();
const mongoose = require('mongoose');
const Subscriber = require('../models/Subscriber');

async function fixMissingSubscribedAt() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Подключено к MongoDB');

    const result = await Subscriber.updateMany(
      { subscribedAt: { $exists: false } },
      { $set: { subscribedAt: new Date() } }
    );

    console.log(`🛠 Обновлено ${result.modifiedCount} подписчиков без поля subscribedAt`);
  } catch (err) {
    console.error('❌ Ошибка при обновлении:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Отключено от MongoDB');
  }
}

fixMissingSubscribedAt();

