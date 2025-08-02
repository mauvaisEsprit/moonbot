const express = require("express");
const startHandler = require("../handlers/startHandler");
const callbackHandler = require("../handlers/callbackHandler");
const profileHandler = require("../handlers/profileHandler");
const phraseHandler = require("../handlers/phraseHandler");
const Subscriber = require("../models/Subscriber");
const tarotHandler = require("../handlers/tarotHandler");
const retroCommandHandler = require('../handlers/retroCommandHandler');

function registerRoutes(app, bot) {
  app.use(express.json());

  app.post(`/bot${process.env.BOT_TOKEN}`, async (req, res) => {
    const update = req.body;

    try {
      if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text;

        // Проверяем, ожидаем ли имя
        global.userStates = global.userStates || {};

        if (global.userStates[chatId] === "awaiting_name") {
          // Обновляем имя
          await Subscriber.findOneAndUpdate(
            { chatId: chatId.toString() },
            { firstName: text }
          );

          global.userStates[chatId] = null;

          await bot.sendMessage(chatId, `Имя обновлено на: ${text}`);

          // Показываем обновленный профиль
          const profileHandlerModule = require("../handlers/profileHandler");
          await profileHandlerModule(bot, update.message);
        } else if (text === "/start") {
          await startHandler(bot, update.message);
        } else if (text === "/profile") {
          await profileHandler(bot, update.message);
        } else if (text === "/phrase") {
          await phraseHandler(bot, update.message);
        } else if (["/onecard", "/threecards"].includes(text)) {
          await tarotHandler(bot, update.message);
        } else if (text === "/retro") {
          await retroCommandHandler(bot, update.message);
        }
      } else if (update.callback_query) {
        await callbackHandler(bot, update.callback_query);
      }

      res.sendStatus(200);
    } catch (error) {
      console.error("Ошибка обработки update:", error);
      res.sendStatus(500);
    }
  });
}

module.exports = { registerRoutes };
