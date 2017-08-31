const PDFParser = require('pdf2json');
const pdfParser = new PDFParser();
const map = [
  'day',
  'date',
  'time',
  'facility',
  'game',
  'type',
  'teamAway',
  'teamHome',
  'score'
];

function readText(texts, index) {
  return decodeURIComponent(texts[index].R[0].T).trim();
}

function parse(pdf) {
  
  let games = [];

  return new Promise((resolve, reject) => {
    pdfParser.on('pdfParser_dataError', reject);
    pdfParser.on('pdfParser_dataReady', pdfData => {

      const texts = pdfData.formImage.Pages[0].Texts;
      const leagueRaw = texts.splice(0, 1);
      const league = readText(leagueRaw, 0);

      for (let i = 0; i < texts.length; i += map.length) {
        let isGame = true;
        let game = {};

        for (let j = 0; j < map.length; j++) {
          const key = i + j;
          if (key < texts.length) {
            game[map[j]] = readText(texts, key);
          } else {
            isGame = false;
          }
        }

        // Should make this more robust.  Maybe look at all properties?
        if (isGame) {
          games.push(game);
        }
      }

      resolve({
        league: league,
        games: games
      });
    });

    pdfParser.loadPDF(pdf);
  });
}

module.exports = parse;