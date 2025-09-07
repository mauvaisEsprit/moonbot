// components/subscriptionNotifier.js
const bot = require('../bot');

/**
 * Отправляет уведомление админу о смене статуса подписки
 * @param {Object} subscriber - { chatId, firstName, subscribed, subscribedAt }
 */
async function notifySubscriptionChange(subscriber) {
  if (!subscriber || typeof subscriber.subscribed !== 'boolean') return;

  const YOUR_TELEGRAM_ID = process.env.TELEGRAM_ID;
  const status = subscriber.subscribed ? '✅ Новый подписчик' : '❌ Пользователь отписался';

  try {
    await bot.sendMessage(
      YOUR_TELEGRAM_ID,
      `${status}!\n💬 Имя: ${subscriber.firstName || 'Не указано'}\n🆔 Chat ID: ${subscriber.chatId}\n📅 Дата: ${subscriber.subscribedAt ? subscriber.subscribedAt.toLocaleString() : '-'}`
    );
    console.log(`Уведомление отправлено: ${status} для ${subscriber.chatId}`);
  } catch (err) {
    console.error('Ошибка при отправлении уведомления:', err);
  }
}

module.exports = notifySubscriptionChange;