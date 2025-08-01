const fs = require('fs');
const path = require('path');

const tarotData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/tarot_ru.json'), 'utf-8'));

function getRandomCards(n = 1) {
  const shuffled = [...tarotData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

async function sendCard(bot, chatId, card, position = null) {
  const caption = `${position ? `💫 *${position}*\n` : ''}🃏 *${card.title}*\n\n${card.description}`;
  const imagePath = path.join(__dirname, `../images/${card.filename}`);

  if (!fs.existsSync(imagePath)) {
    await bot.sendMessage(chatId, `Извините, изображение для карты "${card.title}" не найдено.`);
    return;
  }

  await bot.sendPhoto(chatId, imagePath, {
    caption,
    parse_mode: 'Markdown'
  });
}

async function tarotHandler(bot, message) {
  const chatId = message.chat.id;
  const text = message.text;

  if (text === '/onecard') {
    const [card] = getRandomCards(1);
    await sendCard(bot, chatId, card);
  } else if (text === '/threecards') {
    const cards = getRandomCards(3);
    const positions = ['Прошлое', 'Настоящее', 'Будущее'];

    for (let i = 0; i < cards.length; i++) {
      await sendCard(bot, chatId, cards[i], positions[i]);
    }
  }
}

module.exports = tarotHandler;
