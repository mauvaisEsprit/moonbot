const Subscriber = require('../models/Subscriber');
const { getZodiacName } = require('../utils/zodiacUtils');
const retroPlanetHandler = require('./retroPlanetHandler');


const ruToEnZodiac = {
  'Овен': 'aries',
  'Телец': 'taurus',
  'Близнецы': 'gemini',
  'Рак': 'cancer',
  'Лев': 'leo',
  'Дева': 'virgo',
  'Весы': 'libra',
  'Скорпион': 'scorpio',
  'Стрелец': 'sagittarius',
  'Козерог': 'capricorn',
  'Водолей': 'aquarius',
  'Рыбы': 'pisces'
};

module.exports = async (bot, callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data.startsWith('retro_')) {
  return await retroPlanetHandler(bot, callbackQuery);
}


  if (data.startsWith('zodiac_')) {
    // Пользователь выбрал знак зодиака
    const signRu = data.split('_')[1];
    const signEn = ruToEnZodiac[signRu];
    if (!signEn) {
      await bot.answerCallbackQuery(callbackQuery.id, { text: 'Ошибка: знак не распознан.' });
      return;
    }

    await Subscriber.findOneAndUpdate(
      { chatId: chatId.toString() },
      { zodiacSign: signEn },
      { new: true }
    );

    await bot.answerCallbackQuery(callbackQuery.id, { text: `Вы выбрали знак: ${signRu}` });
    return sendProfile(bot, chatId);
  }

  if (data === 'change_zodiac') {
    await bot.answerCallbackQuery(callbackQuery.id);
    // Отправляем заново выбор знака
    const zodiacSigns = Object.keys(ruToEnZodiac);

    const keyboard = [];
    for (let i = 0; i < zodiacSigns.length; i += 3) {
      keyboard.push(zodiacSigns.slice(i, i + 3).map(sign => ({
        text: sign,
        callback_data: `zodiac_${sign}`
      })));
    }

    await bot.sendMessage(chatId, 'Выберите новый знак зодиака:', {
      reply_markup: { inline_keyboard: keyboard }
    });
    return;
  }

  if (data === 'edit_name') {
    await bot.answerCallbackQuery(callbackQuery.id);
    await bot.sendMessage(chatId, 'Введите новое имя для профиля:');

    global.userStates = global.userStates || {};
    global.userStates[chatId] = 'awaiting_name';
    return;
  }

  if (data === 'subscribe') {
    await Subscriber.findOneAndUpdate({ chatId: chatId.toString() }, { subscribed: true });
    await bot.answerCallbackQuery(callbackQuery.id, { text: 'Вы подписались' });
    return sendProfile(bot, chatId);
  }

  if (data === 'unsubscribe') {
    await Subscriber.findOneAndUpdate({ chatId: chatId.toString() }, { subscribed: false });
    await bot.answerCallbackQuery(callbackQuery.id, { text: 'Вы отписались' });
    return sendProfile(bot, chatId);
  }
};

async function sendProfile(bot, chatId) {
  const user = await Subscriber.findOne({ chatId: chatId.toString() });
  if (!user) {
    return bot.sendMessage(chatId, 'Профиль не найден. Используйте /start');
  }

  // Русское имя знака
  const zodiacRu = getZodiacName(user.zodiacSign);

  const text = `
👤 Профиль:
💬 Имя: ${user.firstName || 'не указано'}
♉ Знак зодиака: ${zodiacRu || 'не выбран'}
📅 Подписка: ${user.subscribed ? 'активна' : 'отписан'}
  `.trim();

  const buttons = [
    [{ text: '✏️ Изменить имя', callback_data: 'edit_name' }],
    [{ text: '♉ Изменить знак зодиака', callback_data: 'change_zodiac' }],
  ];

  if (user.subscribed) {
    buttons.push([{ text: '🚫 Отписаться', callback_data: 'unsubscribe' }]);
  } else {
    buttons.push([{ text: '✅ Подписаться', callback_data: 'subscribe' }]);
  }

  await bot.sendMessage(chatId, text, {
    reply_markup: { inline_keyboard: buttons }
  });
}
