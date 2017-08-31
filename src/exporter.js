const fs = require('fs');
const json2csv = require('json2csv');

function exporter(args, games) {
  let gcal = [];

  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    gcal.push({
      'Subject': args.child + ' - Soccer',
      'Start Date': game.date,
      'Start Time': game.time,
      'End Date': game.date,
      'End Time': game.time + '+1hr',
      'Description': game.teamHome + ' v ' + game.teamAway,
      'Location': game.facility
    });
  }

  const csv = json2csv({ data: gcal });
  if (args.csv) {
    fs.writeFileSync(args.csv, csv);
    console.log(`Exported ${gcal.length} games to ${args.csv}`);
  }
}

module.exports = exporter;