const cron = require('node-cron');
const subscriberService = require('../services/subscriberService');
const { getZodiacName } = require('../utils/zodiacUtils');
const bot = require('../bot');
const { getLongPhraseForSign } = require('../utils/getRotatedPhrase');

function startDailyBroadcast() {
  cron.schedule(
    '0 9 * * *', // каждый день в 08:00 по московскому времени
    async () => {
      console.log('Запуск ежедневной рассылки...');
      try {
        const subscribers = await subscriberService.getAllSubscribers({ subscribed: true });

        let count = 0;

        for (const sub of subscribers) {
          if (!sub.zodiacSign) continue;

          const zodiacName = getZodiacName(sub.zodiacSign);
          const phrase = getLongPhraseForSign(sub.zodiacSign);

          const message = `🌙 Лунный совет для знака *${zodiacName}*:\n\n${phrase}`;
          try {
          await bot.sendMessage(sub.chatId, message, { parse_mode: 'Markdown' });
          count++;
          console.log(`Рассылка завершена. Отправлено сообщений: ${count}`);
          } catch (error) {
            console.error(`Ошибка при отправке сообщения пользователю ${sub.chatId}:`, error);
          }
        }

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
