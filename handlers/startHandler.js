const Subscriber = require('../models/Subscriber');
const notifySubscriptionChange = require('../jobs/notifySubs'); // <-- твоя функция уведомлений

const zodiacSigns = [
  'Овен', 'Телец', 'Близнецы', 'Рак',
  'Лев', 'Дева', 'Весы', 'Скорпион',
  'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
];

module.exports = async (bot, message) => {
  const chatId = message.chat.id.toString();
  const firstName = message.from.first_name || 'Пользователь';

  // Ищем пользователя в базе
  let user = await Subscriber.findOne({ chatId });

  if (!user) {
    // Создаём нового пользователя и сохраняем
    user = new Subscriber({ chatId, firstName, subscribed: true, subscribedAt: new Date() });
    await user.save();

    // 🔥 Уведомляем сразу о новой подписке
    await notifySubscriptionChange(user);
  } else if (!user.subscribed) {
    // Пользователь был отписан, но нажал "подписаться"
    user.subscribed = true;
    user.subscribedAt = new Date();
    await user.save();

    // 🔥 Уведомляем о подписке
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
};