const cron = require('node-cron');
const sendHourlyStats = require('../jobs/hourlyStats');

function startHourlyStatsJob() {
  cron.schedule('* * * * *', () => {
    console.log('⏰ Запуск статистики за час');
    sendHourlyStats();
  });
}

module.exports = startHourlyStatsJob;
