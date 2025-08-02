module.exports = async function retroCommandHandler(bot, message) {
  const chatId = message.chat.id;

  const text = '🔮 Выберите планету, чтобы узнать её ретроградные периоды:';

  const inlineKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Меркурий', callback_data: 'retro_Меркурий' },
          { text: 'Венера', callback_data: 'retro_Венера' },
          { text: 'Марс', callback_data: 'retro_Марс' }
        ],
        [
          { text: 'Юпитер', callback_data: 'retro_Юпитер' },
          { text: 'Сатурн', callback_data: 'retro_Сатурн' },
          { text: 'Уран', callback_data: 'retro_Уран' }
        ],
        [
          { text: 'Нептун', callback_data: 'retro_Нептун' },
          { text: 'Плутон', callback_data: 'retro_Плутон' }
        ]
      ]
    }
  };

  await bot.sendMessage(chatId, text, inlineKeyboard);
};
