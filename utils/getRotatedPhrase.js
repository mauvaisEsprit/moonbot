const phrases = require('../data/phrases.json');
const zodiacPhrases = require('../data/zodiacPhrases.json'); // длинные

const enToRuZodiac = {
  aries: 'Овен',
  taurus: 'Телец',
  gemini: 'Близнецы',
  cancer: 'Рак',
  leo: 'Лев',
  virgo: 'Дева',
  libra: 'Весы',
  scorpio: 'Скорпион',
  sagittarius: 'Стрелец',
  capricorn: 'Козерог',
  aquarius: 'Водолей',
  pisces: 'Рыбы',
};

const zodiacSigns = Object.values(enToRuZodiac);

function getRotatedSign(currentSign, offset) {
  const currentIndex = zodiacSigns.indexOf(currentSign);
  if (currentIndex === -1) return undefined;
  const rotatedIndex = ((currentIndex + offset) % zodiacSigns.length + zodiacSigns.length) % zodiacSigns.length;
  return zodiacSigns[rotatedIndex];
}

/**
 * Получить фразу для знака
 * @param {string} sign — латинское имя знака (например, 'leo')
 * @param {object} phrasesData — объект с фразами (например, phrases или zodiacPhrases)
 * @param {object} zodiacMap — карта перевода, по умолчанию enToRuZodiac
 */
function getPhraseForSign(sign, phrasesData, zodiacMap = enToRuZodiac) {
  const signRu = zodiacMap[sign.toLowerCase()];
  if (!signRu) return `Неизвестный знак зодиака: ${sign}`;

  const date = new Date();
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const phraseIndex = dayOfYear % 31;

  const rotatedSign = getRotatedSign(signRu, -dayOfYear);
  const phrasesForRotatedSign = phrasesData[rotatedSign];

  if (!phrasesForRotatedSign || phrasesForRotatedSign.length < 31) {
    return `Нет фразы для знака ${rotatedSign} на сегодня.`;
  }

  return phrasesForRotatedSign[phraseIndex];
}

module.exports = {
  getPhraseForSign,
  getRotatedSign,
  enToRuZodiac,
  phrases,
  zodiacPhrases
};
