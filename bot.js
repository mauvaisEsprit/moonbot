const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

const URL = process.env.WEBHOOK_URL;
bot.setWebHook(`${URL}/bot${process.env.BOT_TOKEN}`);




module.exports = bot;
