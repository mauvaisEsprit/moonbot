// jobs/hourlyStats.js
const Subscriber = require('../models/Subscriber');
const bot = require('../bot');

async function sendHourlyStats() {
  const now = new Date();
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

  try {
    // Всего пользователей
    const total = await Subscriber.countDocuments({ createdAt: { $lte: now } });

    // Подписанные
    const subscribedTotal = await Subscriber.countDocuments({ subscribed: true });

    // Новые подписки за последние 30 минут
    const newSubs = await Subscriber.countDocuments({
      subscribed: true,
      subscribedAt: { $gte: thirtyMinutesAgo },
    });

    const message = `📊 Статистика за последние 30 минут:\n\n👤 Всего пользователей: ${total}\n✅ Подписаны: ${subscribedTotal}\n🆕 Новых подписок: ${newSubs}`;

    const YOUR_TELEGRAM_ID = process.env.TELEGRAM_ID;
    await bot.sendMessage(YOUR_TELEGRAM_ID, message);
  } catch (err) {
    console.error('Ошибка при отправке статистики:', err);
  }
}

module.exports = sendHourlyStats;
