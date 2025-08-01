const Subscriber = require('../models/Subscriber');

module.exports = async (bot, message) => {
  const chatId = message.chat.id;
  const user = await Subscriber.findOne({ chatId: chatId.toString() });

  if (!user) {
    return bot.sendMessage(chatId, '❌ Вы не подписаны. Напишите /start чтобы начать.');
  }

  const text = `
👤 Ваш профиль:
Имя: ${user.firstName || 'не указано'}
Знак зодиака: ${user.zodiacSign || 'не выбран'}
Подписка: ${user.subscribed ? 'активна' : 'отписан'}
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
};
