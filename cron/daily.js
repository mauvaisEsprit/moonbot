const cron = require('node-cron');
const sendDailyStats = require('../jobs/dailyStats');

function startDailyStatsJob() {
  cron.schedule(
    '30 17 * * *', // каждый день в 18:00
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