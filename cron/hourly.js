const cron = require('node-cron');
const sendHourlyStats = require('../jobs/hourlyStats');

function startHourlyStatsJob() {
  cron.schedule('0,30 * * * *', () => {
    console.log('⏰ Запуск статистики за полчаса...');
    sendHourlyStats();
  });
}

module.exports = startHourlyStatsJob;
