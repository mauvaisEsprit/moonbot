require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const bot = require('./bot');
const { registerRoutes } = require('./routes/registerRoutes');
const { startDailyBroadcast } = require('./jobs/dailyBroadcast');

const app = express();

connectDB();

registerRoutes(app, bot);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log('Бот запущен и слушает обновления...1');
});

startDailyBroadcast();