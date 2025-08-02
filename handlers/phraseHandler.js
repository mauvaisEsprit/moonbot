const { getPhraseForSign, phrases } = require('../utils/getRotatedPhrase');
const { getZodiacName } = require('../utils/zodiacUtils');
const Subscriber = require('../models/Subscriber');

module.exports = async (bot, message) => {
  const chatId = message.chat.id;
  
  
  // Найдем пользователя в БД
  const user = await Subscriber.findOne({ chatId: chatId.toString() });
  
  if (!user) {
    return bot.sendMessage(chatId, '❌ Вы не зарегистрированы. Напишите /start для начала.');
  }
  
  if (!user.zodiacSign) {
    return bot.sendMessage(chatId, '⚠️ Вы ещё не выбрали знак зодиака. Используйте /start чтобы выбрать.');
  }

  // Получаем русский знак и фразу для знака
  const zodiacRu = getZodiacName(user.zodiacSign);
  const phrase = getPhraseForSign(user.zodiacSign);

  const text = `🔮 Фраза дня для знака *${zodiacRu}*:\n\n${phrase}`;

  await bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
};
