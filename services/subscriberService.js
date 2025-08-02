// services/subscriberService.js

const Subscriber = require("../models/Subscriber");

async function subscribe(chatId) {
  const user = await Subscriber.findOne({ chatId });

  if (user) {
    if (user.subscribed) {
      return "Вы уже подписаны!";
    } else {
      user.subscribed = true;
      user.subscribedAt = new Date();
      await user.save();
      return "Вы успешно подписались!";
    }
  }

  // Если нет пользователя — создаём нового
  const newSubscriber = new Subscriber({ chatId, subscribed: true, subscribedAt: new Date() });
  await newSubscriber.save();
  return "Вы успешно подписались!";
}

async function unsubscribe(chatId) {
  const user = await Subscriber.findOne({ chatId });

  if (!user || !user.subscribed) {
    return "Вы не были подписаны.";
  }

  user.subscribed = false;
  await user.save();
  return "Вы отписались.";
}

async function setZodiacSign(chatId, zodiacSign) {
  const updated = await Subscriber.findOneAndUpdate(
    { chatId },
    { $set: { zodiacSign } },
    { new: true }
  );
  if (updated) return `Знак зодиака ${zodiacSign} сохранён.`;
  return "Пользователь не найден.";
}

async function getAllSubscribers(filter = {}) {
  return Subscriber.find(filter);
}


async function isSubscribed(chatId) {
  const user = await Subscriber.findOne({ chatId });
  return !!user;
}


module.exports = {
  subscribe,
  unsubscribe,
  setZodiacSign,
  getAllSubscribers,
  isSubscribed
};
