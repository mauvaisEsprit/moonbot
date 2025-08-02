// scripts/setSubscribedTrue.js
const mongoose = require('mongoose');
const Subscriber = require('../models/Subscriber'); // путь подкорректируй, если нужно
require('dotenv').config();

async function updateAllSubscribers() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB подключена');

    const result = await Subscriber.updateMany(
      {},            // условие — все документы
      { subscribed: true } // обновление
    );

    console.log(`Обновлено документов: ${result.modifiedCount}`);

    await mongoose.disconnect();
    console.log('Подключение закрыто');
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

updateAllSubscribers();
