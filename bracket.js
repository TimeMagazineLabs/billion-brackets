const fs = require('fs');
const ohash = require('object-hash');
const d3 = require('d3-dsv');

// this is a simple array of the 64 teams identified by name, seed, conference ...
let teams = d3.csvParse(fs.readFileSync('./data/teams_2019.csv', 'utf8'));

// ... and a unique ID from 0 to 63
teams.forEach((d, i) => {
	d.seed = +d.seed;
	d.id = i;
});

// this is a flat array of the 63 games with ids linking to previous and next games, generated from above by ./data/csvToJSON.js
let blank = require('./data/bracket.json');

let ticker = 0; // counts brackets calculated, including via recursion

let csvKeys = Object.keys(blank);
csvKeys.unshift("winner");
csvKeys.unshift("hash");

// we'll append to the csv file with each run in case we get interrupted, but only need headers once 
if (!fs.existsSync('./brackets/brackets.csv')) {
	fs.appendFileSync('./brackets/brackets.csv', csvKeys.join(",") + "\n");
}

let hash_table = {}; // check for dupes

// choose between two teams, armed only with their initial seeds
let choose = function(game) {
	let indexA = game.A.id;
	let indexB = game.B.id;

	let seedA = teams[indexA].seed;
	let seedB = teams[indexB].seed;

	if (seedA == seedB) { // if equal, we'll recurse
		return null;
	}

	let diff = Math.abs(seedA - seedB);
	let oddsA = 0;
	let oddsB = 0;

	if (seedA < seedB) {
		oddsA = 0.5 + diff / 32;
		oddsB = 1 - oddsA;
	} else {
		oddsB = 0.5 + diff / 32;
		oddsA = 1 - oddsB;
	}

	return (Math.random() < oddsA ? indexA : indexB);
}

// populate the next game with the winner of this one unless it's the championship
let advanceWinner = function(bracket, game_id, winner_id) {
	let game = bracket[game_id];
	game.winner.id = winner_id;
	game.winner.team = teams[winner_id].team;

	if (game.id == "game_62") {
		return bracket;
	}

	let next_game = bracket[game.next];
	let next_side = game.next_side;

	next_game[next_side].id = winner_id;
	next_game[next_side].team = teams[winner_id].team;

	return bracket;
}

// core function
let computeBracket = function(starting_bracket) {
	if (!starting_bracket) {
		starting_bracket = blank;
	}
	// Deep Clone: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	let bracket = JSON.parse(JSON.stringify(starting_bracket)); // make a fresh object
	bracket.id = "b" + ticker;
	ticker += 1;

	if (ticker % 1000 == 0) {
		console.log(ticker, "brackets");
	}

	let game_ids = Object.keys(bracket);
	game_ids.shift(); // remove id
	game_ids.forEach(game_id => {
		let game = bracket[game_id];

		if (game.winner.id !== null) {
			return;
		}

		let winner_id = choose(game);

		if (winner_id !== null) {
			bracket = advanceWinner(bracket, game_id, winner_id);	
		} else {
			// recursively choose one winner and then continue with the other
			bracket = advanceWinner(bracket, game_id, game.B.id);	
			computeBracket(bracket);

			bracket = advanceWinner(bracket, game_id, game.A.id);	
		}
	});

	let small_bracket = serialize(bracket);

	if (hash_table.hasOwnProperty(small_bracket.hash)) {
		console.log("Duplicate:", small_bracket.hash);
		fs.writeFileSync("./duplicates/" + small_bracket.hash + ".json", JSON.stringify(small_bracket, null, 2));
	} else {
		hash_table[small_bracket.hash] = 1;
		let toWrite = [
			small_bracket.hash,
			small_bracket.winner,
			small_bracket.id,
		].concat(small_bracket.winner_ids);

		fs.appendFileSync('./brackets/brackets.csv', toWrite.join(",") + "\n");
	}
};

let serialize = function(bracket) {
	let game_ids = Object.keys(bracket);
	game_ids.shift(); // remove id
	let winner_ids = [];
	let verbose = [];
	// let typed = new Uint8Array(63);

	game_ids.forEach((game_id, g) => {
		// typed[g] = bracket[game_id].winner.id;
		winner_ids.push(bracket[game_id].winner.id);
		verbose.push([game_id, bracket[game_id].winner.team]);
	});

	let hashed = ohash(winner_ids);

	return {
		id: bracket.id,
		winner: bracket["game_62"].winner.team,
		// uint8: typed,
		winner_ids: winner_ids,
		verbose: verbose,
		// buffer: buffer,
		hash: hashed
	}
}

// EXECUTE THE CODE! You can break any time and resume
for (let n = 0; n < 100000000; n += 1) {
	computeBracket();
}

console.log("Finished", ticker, "brackets");