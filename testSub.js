// testSubscriber.js
require('dotenv').config();
const mongoose = require('mongoose');
const Subscriber = require('./models/Subscriber');
const bot = require('./bot'); // твой node-telegram-bot-api бот

async function test() {
  try {
    // 1. Подключаемся к MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB подключена');

    // 2. Создаём нового пользователя
    console.log('Создаём нового пользователя...');
    const newUser = await Subscriber.create({
      chatId: '1234567890', // можно любой тестовый chatId
      firstName: 'Vlad',
    });
    console.log('Новый пользователь создан:', newUser.chatId);

    // 3. Отписка
    console.log('Делаем отписку...');
    newUser.subscribed = false;
    await newUser.save(); // → должно прийти ❌ "Пользователь отписался"

    // 4. Подписка
    console.log('Делаем повторную подписку...');
    newUser.subscribed = true;
    await newUser.save(); // → должно прийти ✅ "Новый подписчик"

    // 5. Через findOneAndUpdate
    console.log('Обновляем через findOneAndUpdate...');
    await Subscriber.findOneAndUpdate(
      { chatId: '1234567890' },
      { subscribed: true },
      { new: true }
    );

    console.log('✅ Тест завершён');
    process.exit(0);
  } catch (err) {
    console.error('Ошибка в тесте:', err);
    process.exit(1);
  }
}

test();