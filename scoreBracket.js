const fs = require('fs');
const d3 = require('d3-dsv');
let argv = require('minimist')(process.argv.slice(2));

const results = d3.csvParse(fs.readFileSync('./results/results_2019.csv', 'utf8'));
let team_lookup = {};

d3.csvParse(fs.readFileSync('./data/teams_2019.csv', 'utf8')).forEach((d, i) => {
	team_lookup[i] = d.team;
});


let game_data = {};		// winner lookup per game	
let still_alive = {};	// whether a team is still in the tournament, for tracking possible points

// populate `winners` and `still_alive`
results.forEach((d, i) => {
	let game_id = "game_" + i;

	// reverse log of round: 32 `0`s, 16 `1`s, etc. 
	const round = 5 - Math.floor(Math.log(63 - i) / Math.log(2));

	// exponential score
	game_data[game_id] = {
		id: game_id,
		round: round,
		points: Math.pow(2, round),
		winner_id: (!d.winner_id  || d.winner_id == '') ? null : d.winner_id
	}

	if (game_data[game_id].winner_id) {
		still_alive[d.teamA_id] = -1;
		still_alive[d.teamB_id] = -1;
		still_alive[d.winner_id] = 1;
	}
});

let game_ids = Object.keys(game_data);

const scoreBracket = function(bracket, scoring_system) {
	let record = {}; // game-by-game success
	let points = 0;
	let possible = 32 * 6;
	let rounds = [0, 0, 0, 0, 0, 0]; // points per round

	game_ids.forEach(game_id => {
		let prediction = bracket[game_id];
		let answer = game_data[game_id].winner_id;

		// if there's no result yet, let's check if the predicted team is still in the running. If not, subtract potential points
		if (answer == null || answer == '') {
			record[game_id] = null;

			if (still_alive[prediction] === -1) {
				possible -= game_data[game_id].points;
				if (argv.test) {
					console.log("In", game_id, "predicted team", team_lookup[prediction], "(" + prediction+ ") was already eliminated before game. Lost", game_data[game_id].points, "possible points.", possible, "remain.");
				}
			}
		} else { // if there is a result, add points if necessary
			if (prediction == answer) {
				points += game_data[game_id].points;
				record[game_id] = game_data[game_id].points;
				rounds[game_data[game_id].round] += game_data[game_id].points;
			} else {
				record[game_id] = 0;
				possible -= game_data[game_id].points;
				if (argv.test) {
					console.log("Missed", game_id + " in round", game_data[game_id].round + ".", possible, "points remain.");
				}
			}
		}
	});

	return {
		points: points,
		rounds: rounds,
		// record: record,
		possible: possible
	}
}

module.exports = scoreBracket;

if (argv.test) {
	argv.mode = argv.mode || "exp";
	const test = d3.csvParse(fs.readFileSync('./brackets/test.csv', 'utf8'));

	test.forEach(d => {
		console.log("Testing", d.hash);
		console.log(scoreBracket(d, argv.mode));
	});


}

