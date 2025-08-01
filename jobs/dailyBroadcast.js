const cron = require('node-cron');
const subscriberService = require('../services/subscriberService');
const { getAdviceForZodiac, getZodiacName } = require('../utils/zodiacUtils');
const bot = require('../bot'); // Импорт единого экземпляра бота

function startDailyBroadcast() {
  cron.schedule(
    '* * * * *', // каждый день в 09:00 по ПАРИЖСКОМУ времени
    async () => {
      console.log('Запуск ежедневной рассылки...');
      try {
        const subscribers = await subscriberService.getAllSubscribers({ subscribed: true });
        for (const sub of subscribers) {
          if (!sub.zodiacSign) continue;

          const advice = getAdviceForZodiac(sub.zodiacSign);
          const zodiacName = getZodiacName(sub.zodiacSign);

          await bot.sendMessage(
            sub.chatId,
            `🌙 Лунный совет для знака ${zodiacName}:\n\n${advice}`
          );
        }
        console.log('Рассылка завершена');
      } catch (error) {
        console.error('Ошибка в рассылке:', error);
      }
    },
    {
      timezone: 'Europe/Paris', // важная настройка!
    }
  );
}

module.exports = { startDailyBroadcast };
