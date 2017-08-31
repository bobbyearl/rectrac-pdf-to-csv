const minimist = require('minimist');
const importer = require('./src/importer');
const exporter = require('./src/exporter');

const args = minimist(process.argv.splice(2));
importer(args.pdf).then(parsed => {
  let games = parsed.games;
  if (args.team) {
    games = games.filter(game => {
      const team = args.team.toLowerCase();
      const home = game.teamHome.toLowerCase();
      const away = game.teamAway.toLowerCase();
      return (home.indexOf(team) > -1 || away.indexOf(team) > -1);
    });
  }

  console.log('');
  if (parsed.league) {
    console.log(`League: ${parsed.league}`);
    if (parsed.games.length) {
      console.log(`Parsed ${args.pdf} into ${parsed.games.length} games.`);
      if (args.team) {
        console.log(`Filtered to ${games.length} games for team ${args.team}.`);
      }

      exporter(args, games);
    } else {
      console.log('Error parsing games.');
    }
  } else {
    console.log('Error parsing league.');
  }
  console.log('');

});