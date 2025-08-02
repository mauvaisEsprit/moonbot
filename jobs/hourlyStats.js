// jobs/hourlyStats.js
const Subscriber = require('../models/Subscriber');
const bot = require('../bot');

async function sendHourlyStats() {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  try {
    const total = await Subscriber.countDocuments({ subscribed: true });
    const newSubs = await Subscriber.countDocuments({
      subscribed: true,
      createdAt: { $gte: oneHourAgo }
    });

    const message = `📊 Статистика за последний час:\n\n👥 Всего подписчиков: ${total}\n🆕 Новых подписок: ${newSubs}`;
    
    // Замените YOUR_TELEGRAM_ID на ваш Telegram ID
    const YOUR_TELEGRAM_ID = process.env.TELEGRAM_ID;
    await bot.sendMessage(YOUR_TELEGRAM_ID, message);
  } catch (err) {
    console.error('Ошибка при отправке статистики:', err);
  }
}

module.exports = sendHourlyStats;
