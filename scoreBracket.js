const fs = require('fs');
const d3 = require('d3-dsv');
let argv = require('minimist')(process.argv.slice(2));

const results = d3.csvParse(fs.readFileSync('./results/results_2019.csv', 'utf8'));

// we'll score this the usual way -- twice the points each round, starting with 1
let points_per_game_exp = {};
let points_per_game_linear = {};
let points_per_game_flat = {};

let game_ids = [];
let still_alive = {};
let winners = {};

results.forEach((d, i) => {
	let game_id = "game_" + i;
	game_ids.push(game_id);

	// reverse log of round: 32 `0`s, 16 `1`s, etc. 
	const r = 5 - Math.floor(Math.log(63 - i) / Math.log(2));

	// exponential score
	points_per_game_exp[game_id] = Math.pow(2, r);
	points_per_game_linear[game_id] = r + 1;
	points_per_game_flat[game_id] = 1;

	if (d.winner_id == '') {
		winners[game_id] = null;
	}

	winners[game_id] = d.winner_id;

	if (d.winner_id != null && d.winner_id != "") {
		still_alive[d.teamA_id] = -1;
		still_alive[d.teamB_id] = -1;
		still_alive[d.winner_id] = 1;
	}
});

const scoreBracket = function(bracket, scoring_system) {
	let points = 0;
	let futureLosses = 0;
	let rounds = [0, 0, 0, 0, 0, 0];
	let points_per_game;

	if (scoring_system == "linear") {
		points_per_game = points_per_game_linear;
	} else if (scoring_system == "flat") {
		points_per_game = points_per_game_flat;
	} else {
		points_per_game = points_per_game_exp;
	}

	let possible = 0;
	Object.values(points_per_game).forEach(d => {
		possible += d;
	});

	game_ids.forEach(game_id => {
		let prediction = bracket[game_id];
		let answer = winners[game_id];

		// if there's no result yet, let's check if the predicted team is still in the running
		if (answer == null || answer == '') {
			if (still_alive[prediction] === -1) {
				possible -= points_per_game[game_id];
				futureLosses += points_per_game[game_id];
				// console.log("In", game_id, "predicted team", prediction, "was already eliminated before game. Lost", points_per_game[game_id], "points.", possible, "remain.");
			}
		} else {
			if (prediction == winners[game_id]) {
				points += points_per_game[game_id];
				let round = Math.log(points_per_game_exp[game_id]) / Math.log(2);
				rounds[round] += points_per_game[game_id];
			} else {
				possible -= points_per_game[game_id];
				//console.log("Missed", game_id + ".", possible, "points remain.");
			}
		}
	});

	return {
		points: points,
		rounds: rounds,
		future_losses: futureLosses,
		possible: possible
	}
}

module.exports = scoreBracket;

if (argv.test) {
	argv.mode = argv.mode || "exp";
	const test = d3.csvParse(fs.readFileSync('./brackets/test.csv', 'utf8'));

	test.forEach(d => {
		console.log(scoreBracket(d, argv.mode));
	});


}

