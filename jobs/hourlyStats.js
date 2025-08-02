// jobs/hourlyStats.js
const Subscriber = require('../models/Subscriber');
const bot = require('../bot');

async function sendHourlyStats() {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  try {
    // Всего активных подписчиков
    const total = await Subscriber.countDocuments({ subscribed: true });

    // Новые подписки за последний час
    const newSubs = await Subscriber.countDocuments({
      subscribed: true,
      subscribedAt: { $gte: oneHourAgo },
    });

    const message = `📊 Статистика за последний час:\n\n👥 Всего подписчиков: ${total}\n🆕 Новых подписок: ${newSubs}`;

    const YOUR_TELEGRAM_ID = process.env.TELEGRAM_ID;
    await bot.sendMessage(YOUR_TELEGRAM_ID, message);
  } catch (err) {
    console.error('Ошибка при отправке статистики:', err);
  }
}

module.exports = sendHourlyStats;
