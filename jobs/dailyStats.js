// jobs/dailyStats.js
const Subscriber = require('../models/Subscriber');
const bot = require('../bot');

async function sendDailyStats() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  try {
    const total = await Subscriber.countDocuments();
    const subscribedTotal = await Subscriber.countDocuments({ subscribed: true });

    const newUsers = await Subscriber.countDocuments({
      createdAt: { $gte: startOfDay },
    });

    const newSubs = await Subscriber.countDocuments({
      subscribed: true,
      subscribedAt: { $gte: startOfDay },
    });

    const message = `📊 Ежедневный отчёт:\n\n` +
                    `👤 Всего пользователей: ${total}\n` +
                    `✅ Подписаны: ${subscribedTotal}\n` +
                    `🆕 Новые пользователи сегодня: ${newUsers}\n` +
                    `➕ Новые подписки сегодня: ${newSubs}`;

    await bot.telegram.sendMessage(process.env.TELEGRAM_ID, message);
  } catch (err) {
    console.error('Ошибка при отправке ежедневной статистики:', err);
  }
}

module.exports = sendDailyStats;