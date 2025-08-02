const fs = require('fs');
const path = require('path');
const { getZodiacName } = require('../utils/zodiacUtils');
const Subscriber = require('../models/Subscriber');

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getToday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

/**
 * Обработчик запроса ретроградного Меркурия
 * Показывает текущий или ближайший период ретрограда и влияние на знак пользователя
 */
module.exports = async function retroMercuryHandler(bot, message) {
  const chatId = message.chat.id;

  try {
    // Найти пользователя и его знак зодиака (латиницей)
    const user = await Subscriber.findOne({ chatId: chatId.toString() });
    if (!user || !user.zodiacSign) {
      return bot.sendMessage(chatId, '⚠️ У вас не установлен знак зодиака. Пожалуйста, используйте /start для выбора знака.');
    }

    // Получить русское имя знака
    const zodiacRu = getZodiacName(user.zodiacSign);

    // Загрузить данные ретроградов из файла
    const filePath = path.join(__dirname, '../data/retrogrades.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Берём данные по Меркурию
    const mercuryPeriods = data["Меркурий"];
    const today = getToday();

    // Найти текущий период ретрограда
    const currentPeriod = mercuryPeriods.find(period => {
      const start = new Date(period.start);
      const end = new Date(period.end);
      return today >= start && today <= end;
    });

    let messageText;

    if (currentPeriod) {
      // Если сейчас ретроград — показать описание и влияние на знак
      const influenceForSign = currentPeriod.influence[zodiacRu] || 'Влияние на ваш знак не описано.';

      messageText =
        `☿ Сейчас *Ретроградный Меркурий* с *${formatDate(currentPeriod.start)}* по *${formatDate(currentPeriod.end)}*.\n\n` +
        `📜 *Описание:* ${currentPeriod.description}\n\n` +
        `🔮 *Влияние на ваш знак (${zodiacRu}):*\n${influenceForSign}`;
    } else {
      // Иначе — найти следующий период ретрограда
      const nextPeriod = mercuryPeriods.find(period => new Date(period.start) > today);
      if (nextPeriod) {
        const influenceForSign = nextPeriod.influence[zodiacRu] || 'Влияние на ваш знак не описано.';

        messageText =
          `☿ Сейчас Меркурий не в ретрограде.\n\n` +
          `Следующий ретроградный период: *${formatDate(nextPeriod.start)}* – *${formatDate(nextPeriod.end)}*.\n\n` +
          `📜 *Описание:* ${nextPeriod.description}\n\n` +
          `🔮 *Влияние на ваш знак (${zodiacRu}):*\n${influenceForSign}`;
      } else {
        messageText = '⚠️ Нет данных о будущих ретроградных периодах Меркурия.';
      }
    }

    await bot.sendMessage(chatId, messageText, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Ошибка в retroMercuryHandler:', error);
    await bot.sendMessage(chatId, '❌ Произошла ошибка при загрузке данных о ретроградном Меркурии.');
  }
};
