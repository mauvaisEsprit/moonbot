const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

const URL = process.env.WEBHOOK_URL;
bot.setWebHook(`${URL}/bot${process.env.BOT_TOKEN}`);


bot.setMyCommands([
  { command: 'start', description: '🚀 Запустить бота' },
  { command: 'profile', description: '👤 Показать профиль' },
  { command: 'phrase', description: '🧘 Фраза дня' },
  { command: 'onecard', description: '🃏 Случайная карта Таро' },
  { command: 'threecards', description: '🔮 3 карты Таро (расклад)' }
]);





module.exports = bot;
