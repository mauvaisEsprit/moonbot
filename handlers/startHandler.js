const Subscriber = require('../models/Subscriber');

const zodiacSigns = [
  'Овен', 'Телец', 'Близнецы', 'Рак',
  'Лев', 'Дева', 'Весы', 'Скорпион',
  'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
];

module.exports = async (bot, message) => {
  const chatId = message.chat.id;
  const firstName = message.from.first_name || 'Пользователь';

  let user = await Subscriber.findOne({ chatId: chatId.toString() });
  if (!user) {
    user = new Subscriber({ chatId: chatId.toString(), firstName });
    await user.save();
  }

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
