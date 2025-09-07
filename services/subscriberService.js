// services/subscriberService.js

const Subscriber = require("../models/Subscriber");
const notifySubscriptionChange = require('../components/subscriptionNotifier');

/**
 * Подписка пользователя
 * @param {string} chatId
 * @param {string} firstName
 */
async function subscribe(chatId, firstName = "Utilisateur") {
  let user = await Subscriber.findOne({ chatId });

  if (user) {
    if (user.subscribed) {
      return "Вы уже подписаны!";
    } else {
      user.subscribed = true;
      user.subscribedAt = new Date();
      await user.save();

      await notifySubscriptionChange(user); // уведомление о подписке
      return "Вы успешно подписались!";
    }
  }

  // Если нет пользователя — создаём нового
  user = new Subscriber({
    chatId,
    firstName,
    subscribed: true,
    subscribedAt: new Date()
  });
  await user.save();

  await notifySubscriptionChange(user); // уведомление о новой подписке
  return "Вы успешно подписались!";
}

/**
 * Отписка пользователя
 * @param {string} chatId
 */
async function unsubscribe(chatId) {
  const user = await Subscriber.findOne({ chatId });

  if (!user || !user.subscribed) {
    return "Вы не были подписаны.";
  }

  user.subscribed = false;
  await user.save();

  await notifySubscriptionChange(user); // уведомление об отписке
  return "Вы отписались.";
}

/**
 * Сохраняет знак зодиака пользователя
 * @param {string} chatId
 * @param {string} zodiacSign
 */
async function setZodiacSign(chatId, zodiacSign) {
  const updated = await Subscriber.findOneAndUpdate(
    { chatId },
    { $set: { zodiacSign } },
    { new: true }
  );

  if (updated) return `Знак зодиака ${zodiacSign} сохранён.`;
  return "Пользователь не найден.";
}

/**
 * Получить всех подписчиков (с фильтром)
 */
async function getAllSubscribers(filter = {}) {
  return Subscriber.find(filter);
}

/**
 * Проверить, подписан ли пользователь
 */
async function isSubscribed(chatId) {
  const user = await Subscriber.findOne({ chatId });
  return !!user?.subscribed;
}

module.exports = {
  subscribe,
  unsubscribe,
  setZodiacSign,
  getAllSubscribers,
  isSubscribed
};