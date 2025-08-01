const cron = require('node-cron');
const subscriberService = require('../services/subscriberService');
const { getZodiacName } = require('../utils/zodiacUtils');
const bot = require('../bot');
const { getPhraseForSign } = require('../utils/getRotatedPhrase');

function startDailyBroadcast() {
  cron.schedule(
    '* * * * *', // каждый день в 09:00 по Парижскому времени
    async () => {
      console.log('Запуск ежедневной рассылки...');
      try {
        const subscribers = await subscriberService.getAllSubscribers({ subscribed: true });

        for (const sub of subscribers) {
          if (!sub.zodiacSign) continue;

          const zodiacName = getZodiacName(sub.zodiacSign);
          const phrase = getPhraseForSign(sub.zodiacSign);

          const message = `🌙 Лунный совет для знака *${zodiacName}*:\n\n${phrase}`;

          await bot.sendMessage(sub.chatId, message, { parse_mode: 'Markdown' });
        }

        console.log('Рассылка завершена');
      } catch (error) {
        console.error('Ошибка в рассылке:', error);
      }
    },
    {
      timezone: 'Europe/Paris',
    }
  );
}

module.exports = { startDailyBroadcast };
