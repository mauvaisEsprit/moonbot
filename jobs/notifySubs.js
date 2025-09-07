// components/subscriptionNotifier.js
const bot = require('../bot');

async function notifySubscriptionChange(subscriber) {
  if (!subscriber || typeof subscriber.subscribed !== 'boolean') {
    console.log("notifySubscriptionChange: некорректный объект subscriber");
    return;
  }

  console.log("notifySubscriptionChange вызвана для", subscriber.chatId, "subscribed =", subscriber.subscribed);

  const YOUR_TELEGRAM_ID = process.env.TELEGRAM_ID;
  const status = subscriber.subscribed ? '✅ Новый подписчик' : '❌ Пользователь отписался';

  const dateFR = subscriber.subscribedAt
    ? subscriber.subscribedAt.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Paris' })
    : '-';

  try {
    await bot.sendMessage(
      YOUR_TELEGRAM_ID,
      `${status}!\n💬 Имя: ${subscriber.firstName || 'Нет данных'}\n🆔 Chat ID: ${subscriber.chatId}\n📅 Дата: ${dateFR}`
    );
    console.log(`Уведомление отправлено: ${status} ${subscriber.chatId}`);
  } catch (err) {
    console.error('Ошибка при отправке уведомления:', err);
  }
}

module.exports = notifySubscriptionChange;