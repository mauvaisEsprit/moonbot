// handlers/retroPlanetHandler.js
const fs = require('fs');
const path = require('path');
const Subscriber = require('../models/Subscriber');
const { getZodiacName } = require('../utils/zodiacUtils');

module.exports = async (bot, callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (!data.startsWith('retro_')) return;

  const planet = data.replace('retro_', '');

  try {
    const user = await Subscriber.findOne({ chatId: chatId.toString() });
    if (!user || !user.zodiacSign) {
      await bot.sendMessage(chatId, '⚠️ У вас не выбран знак зодиака. Используйте /start для выбора знака.');
      await bot.answerCallbackQuery(callbackQuery.id);
      return;
    }

    const zodiacRu = getZodiacName(user.zodiacSign);

    const retroData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/retrogrades.json'), 'utf-8'));
    const periods = retroData[planet];

    if (!periods) {
      await bot.sendMessage(chatId, `Нет данных по планете ${planet}.`);
      await bot.answerCallbackQuery(callbackQuery.id);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentPeriod = periods.find(p => {
      const start = new Date(p.start);
      const end = new Date(p.end);
      return today >= start && today <= end;
    }) || periods.find(p => new Date(p.start) > today);

    if (!currentPeriod) {
      await bot.sendMessage(chatId, `⚠️ Нет ближайших ретроградных периодов для ${planet}.`);
      await bot.answerCallbackQuery(callbackQuery.id);
      return;
    }

    const influence = currentPeriod.influence[zodiacRu] || 'Нет специфической информации для вашего знака.';

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    const messageText = `♻️ *${planet}*\n` +
      `Период: *${formatDate(currentPeriod.start)}* - *${formatDate(currentPeriod.end)}*\n\n` +
      `📜 *Описание:* ${currentPeriod.description}\n\n` +
      `🔮 *Влияние на вас (${zodiacRu}):*\n${influence}`;

    await bot.sendMessage(chatId, messageText, { parse_mode: 'Markdown' });
    await bot.answerCallbackQuery(callbackQuery.id);
  } catch (err) {
    console.error('retroPlanetHandler error:', err);
    await bot.sendMessage(chatId, '❌ Произошла ошибка при получении данных.');
    await bot.answerCallbackQuery(callbackQuery.id);
  }
};
