// services/subscriberService.js

const Subscriber = require("../models/Subscriber");

async function subscribe(chatId) {
  const exists = await Subscriber.findOne({ chatId });
  if (exists) return "Вы уже подписаны!";

  const newSubscriber = new Subscriber({ chatId });
  await newSubscriber.save();
  return "Вы успешно подписались!";
}

async function unsubscribe(chatId) {
  const deleted = await Subscriber.findOneAndDelete({ chatId });
  if (deleted) return "Вы отписались.";
  return "Вы не были подписаны.";
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
