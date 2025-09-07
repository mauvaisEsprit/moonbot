// jobs/notifySubs.js
const bot = require('../bot');

/**
 * Отправляет уведомление админу о смене статуса подписки
 * @param {Object} subscriber - { chatId, firstName, subscribed, subscribedAt }
 */
async function notifySubscriptionChange(subscriber) {
  if (!subscriber || typeof subscriber.subscribed !== 'boolean') return;

  const YOUR_TELEGRAM_ID = process.env.TELEGRAM_ID;
  const status = subscriber.subscribed ? '✅ Новый подписчик' : '❌ Пользователь отписался';

  // Французская дата по Парижу
  const dateFR = subscriber.subscribedAt
    ? subscriber.subscribedAt.toLocaleString('fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'short', timeStyle: 'short' })
    : '-';

  const name = subscriber.firstName ? subscriber.firstName : 'Нет данных';

  try {
    await bot.sendMessage(
      YOUR_TELEGRAM_ID,
      status + '!\n💬 Имя: ' + name + '\n🆔 Chat ID: ' + subscriber.chatId + '\n📅 Дата: ' + dateFR
    );
    console.log('Уведомление отправлено: ' + status + ' для ' + subscriber.chatId);
  } catch (err) {
    console.error('Ошибка при отправке уведомления:', err);
  }
}

module.exports = notifySubscriptionChange;