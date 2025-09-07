// jobs/dailyStats.js
const Subscriber = require('../models/Subscriber');
const bot = require('../bot');

async function sendDailyStats() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  try {
    // 1️⃣ Статистика
    const total = await Subscriber.countDocuments();
    const subscribedTotal = await Subscriber.countDocuments({ subscribed: true });

    const newUsers = await Subscriber.countDocuments({
      createdAt: { $gte: startOfDay },
    });

    const newSubs = await Subscriber.countDocuments({
      subscribed: true,
      subscribedAt: { $gte: startOfDay },
    });

    const message = `
📊 Ежедневный отчёт:

👤 Всего пользователей: ${total}
✅ Подписаны: ${subscribedTotal}
🆕 Новые пользователи сегодня: ${newUsers}
➕ Новые подписки сегодня: ${newSubs}
`;

    const YOUR_TELEGRAM_ID = process.env.TELEGRAM_ID;
    await bot.sendMessage(YOUR_TELEGRAM_ID, message);

    // 2️⃣ Уведомления о новых подписчиках за сутки
    const newSubscribers = await Subscriber.find({
      subscribed: true,
      subscribedAt: { $gte: startOfDay },
    });

    for (const sub of newSubscribers) {
      console.log(`Отправляем уведомление о новой подписке: ${sub.chatId}`);
      await bot.sendMessage(YOUR_TELEGRAM_ID,
        `✅ Новый подписчик!\n💬 Имя: ${sub.firstName || 'Не указано'}\n🆔 Chat ID: ${sub.chatId}\n📅 Дата подписки: ${sub.subscribedAt.toLocaleString()}`
      );
    }

  } catch (err) {
    console.error('Ошибка при отправке ежедневной статистики:', err);
  }
}

module.exports = sendDailyStats;