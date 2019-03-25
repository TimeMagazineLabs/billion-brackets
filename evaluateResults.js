const fs = require('fs');
const csv = require('csv-streamify');
const scoreBracket = require('./scoreBracket.js');

const parser = csv({ columns: true });

let count = 0;

let csvKeys = [ "hash", "points", "possible", "future_losses", "round0", "round1", "round2", "round3", "round4", "round5" ];

let filename = './scores/scores_' + (new Date()).getTime() + '.csv';

// we'll append to the csv file with each run in case we get interrupted, but only need headers once 
if (!fs.existsSync(filename)) {
	fs.appendFileSync(filename, csvKeys.join(",") + "\n");
}

parser.on('data', function (bracket) {
	let score = scoreBracket(bracket);

	let toWrite = [ bracket.hash, score.points, score.possible, score.future_losses ];
	toWrite = toWrite.concat(score.rounds);

	fs.appendFileSync(filename, toWrite.join(",") + "\n");

	if (score.rounds[0] == 32) {
		console.log("Perfect Round 0");
	}

	if (score.rounds[1] == 32) {
		console.log("Perfect Round 1");
	}

	if (score.points == 64) {
		console.log("PERFECT SO FAR!!!");
	}

	count += 1;
	if (count % 10000 == 0) {
		console.log(count);
	}
});

parser.on('end', function () {
	fs.copyFileSync(filename, "./scores/scores.csv");
});


// now pipe some data into it
fs.createReadStream('./brackets/brackets.csv').pipe(parser);

