const cron = require('node-cron');
const subscriberService = require('../services/subscriberService');
const { getZodiacName } = require('../utils/zodiacUtils');
const bot = require('../bot');
const { getLongPhraseForSign } = require('../utils/getRotatedPhrase');

function startDailyBroadcast() {
  cron.schedule(
    '0 8 * * *', // каждый день в 08:00 по московскому времени
    async () => {
      console.log('Запуск ежедневной рассылки...');
      try {
        const subscribers = await subscriberService.getAllSubscribers({ subscribed: true });

        for (const sub of subscribers) {
          if (!sub.zodiacSign) continue;

          const zodiacName = getZodiacName(sub.zodiacSign);
          const phrase = getLongPhraseForSign(sub.zodiacSign);

          const message = `🌙 Лунный совет для знака *${zodiacName}*:\n\n${phrase}`;

          await bot.sendMessage(sub.chatId, message, { parse_mode: 'Markdown' });
        }

        console.log('Рассылка завершена');
      } catch (error) {
        console.error('Ошибка в рассылке:', error);
      }
    },
    {
      timezone: 'Europe/Moscow',
    }
  );
}

module.exports = { startDailyBroadcast };
