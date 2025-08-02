const cron = require('node-cron');
const sendHourlyStats = require('../jobs/hourlyStats');

function startHourlyStatsJob() {
  cron.schedule('0 * * * *', () => {
    console.log('⏰ Запуск статистики за час');
    sendHourlyStats();
  });
}

module.exports = startHourlyStatsJob;
