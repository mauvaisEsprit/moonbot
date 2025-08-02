const phrases = require("../data/phrases.json");
const zodiacPhrases = require("../data/zodiacPhrases.json");

const zodiacSigns = [
  "Овен",
  "Телец",
  "Близнецы",
  "Рак",
  "Лев",
  "Дева",
  "Весы",
  "Скорпион",
  "Стрелец",
  "Козерог",
  "Водолей",
  "Рыбы",
];

// Перевод с английского на русский
const enToRuZodiac = {
  aries: "Овен",
  taurus: "Телец",
  gemini: "Близнецы",
  cancer: "Рак",
  leo: "Лев",
  virgo: "Дева",
  libra: "Весы",
  scorpio: "Скорпион",
  sagittarius: "Стрелец",
  capricorn: "Козерог",
  aquarius: "Водолей",
  pisces: "Рыбы",
};

// Функция смещения (по кругу)
function getRotatedSign(currentSign, offset) {
  const currentIndex = zodiacSigns.indexOf(currentSign);
  if (currentIndex === -1) return undefined; // знак не найден
  const rotatedIndex = ((currentIndex + offset) % zodiacSigns.length + zodiacSigns.length) % zodiacSigns.length;
  return zodiacSigns[rotatedIndex];
}


function getPhraseForSign(sign) {
  const signRu = enToRuZodiac[sign.toLowerCase()];
  if (!signRu) return `Неизвестный знак зодиака: ${sign}`;

  const date = new Date();
  const dayOfYear = Math.floor(
    (date - new Date(date.getFullYear(), 0, 0)) / 86400000
  );
  const phraseIndex = dayOfYear % 31;

  const rotatedSign = getRotatedSign(signRu, -dayOfYear);


  const phrasesForRotatedSign = phrases[rotatedSign];
  

  if (!phrasesForRotatedSign || phrasesForRotatedSign.length < 31) {
    return `Нет фразы для знака ${rotatedSign} на сегодня.`;
  }

  return phrasesForRotatedSign[phraseIndex];
}

module.exports = { getPhraseForSign };
