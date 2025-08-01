// Сопоставление с русскими названиями
const zodiacNames = {
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
  pisces: 'Рыбы'
};



// Получить русское имя знака
function getZodiacName(signEn) {
  return zodiacNames[signEn.toLowerCase()] || 'Знак не определён';
}

module.exports = { getZodiacName };
// utils/zodiacUtils.js