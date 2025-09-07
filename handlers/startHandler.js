const Subscriber = require('../models/Subscriber');
const notifySubscriptionChange = require('../jobs/notifySubs');

const zodiacSigns = [
  'Овен', 'Телец', 'Близнецы', 'Рак',
  'Лев', 'Дева', 'Весы', 'Скорпион',
  'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
];

module.exports = async (bot, message) => {
  const chatId = message.chat.id.toString();
  const firstName = message.from.first_name || 'Пользователь';

  try {
    let user = await Subscriber.findOne({ chatId });

    if (!user) {
      // Новый пользователь → создаём и подписываем
      user = new Subscriber({ chatId, firstName, subscribed: true, subscribedAt: new Date() });
      await user.save();
      console.log(`Новый пользователь: ${firstName} (${chatId})`);
      console.log('Test1');
      await notifySubscriptionChange(user);
    } else if (!user.subscribed) {
      // Был отписан → подписываем снова
      user.subscribed = true;
      user.subscribedAt = new Date();
      await user.save();
      console.log(`Пользователь ${firstName} (${chatId}) восстановил подписку`);
      console.log('Test2');
      await notifySubscriptionChange(user);
    }

    // Отправляем пользователю клавиатуру выбора знака зодиака
    const text = `Привет, ${firstName}! Выбери свой знак зодиака:`;

    const keyboard = [];
    for (let i = 0; i < zodiacSigns.length; i += 3) {
      keyboard.push(zodiacSigns.slice(i, i + 3).map(sign => ({
        text: sign,
        callback_data: `zodiac_${sign}`
      })));
    }

    await bot.sendMessage(chatId, text, {
      reply_markup: { inline_keyboard: keyboard }
    });

  } catch (err) {
    console.error('Ошибка в обработчике стартового сообщения:', err);
  }
};