const fs = require('fs');
const d3 = require('d3');
const ohash = require('object-hash');

let brackets = {};
let ticker = 0;

// this is a simple array of the 64 teams identified by name, seed, conference ...
let teams = d3.csvParse(fs.readFileSync('./data/teams_2019.csv', 'utf8'));

// ... and a unique ID from 0 to 63
teams.forEach((d, i) => {
	d.seed = +d.seed;
	d.id = i;
});

// this is a flat array of the 63 games with ids linking to previous and next games
let blank = require('./data/bracket.json');

// choose between two teams, armed only with their initial seeds
// `noise` runs from 0 [always choose higher seed] to 1 [coin flip]
// any value between 0 and 1 is a relative degree of randomness weighted by the brackets

let choose = function(game, noise) {
	let indexA = game.A.id;
	let indexB = game.B.id;

	// console.log(game);

	let seedA = teams[indexA].seed;
	let seedB = teams[indexB].seed;
	if (seedA != seedB) {
		return (seedA < seedB ? indexA : indexB);
		return;
	}
	return null;
}

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

let computeBracket = function(starting_bracket) {
	if (!starting_bracket) {
		starting_bracket = blank;
	}
	// Deep Clone: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	// let bracket = Object.assign({}, starting_bracket); // make a fresh object
	let bracket = JSON.parse(JSON.stringify(starting_bracket)); // make a fresh object
	bracket.id = "b" + ticker;
	ticker += 1;

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
			console.log("Bracket", bracket.id + ": Tie in", game_id, "between", game.A.team, "and", game.B.team);

			bracket = advanceWinner(bracket, game_id, game.B.id);	
			console.log(bracket);
			console.log(bracket.id, game);
			console.log("(Tie went to", game.B.team + ")");
			computeBracket(bracket);

			bracket = advanceWinner(bracket, game_id, game.A.id);	
			console.log(bracket.id, game);
			console.log("(Tie went to", game.A.team + ")");
		}
	});

	small_bracket = serialize(bracket);

	brackets[small_bracket.hash] = {
		id: small_bracket.id,
		winner: small_bracket.winner,
		results: small_bracket.verbose
	};
};

let serialize = function(bracket) {
	let typed = new Uint8Array(63);
	let verbose = [];
	let game_ids = Object.keys(bracket);
	game_ids.shift(); // remove id

	game_ids.forEach((game_id, g) => {
		typed[g] = bracket[game_id].winner.id;
		verbose.push([game_id, bracket[game_id].winner.team]);
	});

	const buffer = new Buffer.from(typed);

	let hashed = ohash(typed);

	let json = new Buffer.from(buffer);

	fs.writeFileSync("test.txt", buffer);

	return {
		id: bracket.id,
		winner: bracket["game_62"].winner.team,
		uint8: typed,
		verbose: verbose,
		buffer: buffer,
		hash: hashed
	}
}


computeBracket();

fs.writeFileSync("./test.json", JSON.stringify(brackets, null, 2));


