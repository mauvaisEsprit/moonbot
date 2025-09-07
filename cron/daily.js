const cron = require('node-cron');
const sendDailyStats = require('../jobs/dailyStats');

function startDailyStatsJob() {
  cron.schedule(
    '0 0 * * *', // каждый день в 00:00
    () => {
      console.log('⏰ Запуск статистики за сутки...');
      sendDailyStats();
    },
    {
      timezone: 'Europe/Paris', // обязательно укажем Париж
    }
  );
}

module.exports = startDailyStatsJob;