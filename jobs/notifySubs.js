// components/subscriptionNotifier.js
const bot = require('../bot');

/**
 * Отправляет уведомление админу о смене статуса подписки
 * @param {Object} subscriber - { chatId, firstName, subscribed, subscribedAt }
 */
async function notifySubscriptionChange(subscriber) {
  if (!subscriber || typeof subscriber.subscribed !== 'boolean') return;

  const YOUR_TELEGRAM_ID = process.env.TELEGRAM_ID;
  const status = subscriber.subscribed ? '✅ Nouveau abonné' : '❌ Utilisateur désabonné';

  const dateFR = subscriber.subscribedAt
    ? subscriber.subscribedAt.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
    : '-';

  try {
    await bot.sendMessage(
      YOUR_TELEGRAM_ID,
      `${status}!\n💬 Nom: ${subscriber.firstName || 'Non spécifié'}\n🆔 Chat ID: ${subscriber.chatId}\n📅 Date: ${dateFR}`
    );
    console.log(`Notification envoyée: ${status} pour ${subscriber.chatId}`);
  } catch (err) {
    console.error('Erreur lors de l’envoi de la notification:', err);
  }
}

module.exports = notifySubscriptionChange;