const fs = require('fs');
const d3 = require('d3-dsv');
let argv = require('minimist')(process.argv.slice(2));

if (/^\d+$/.test(argv.game_id)) {
	argv.game_id = "game_" + argv.game_id;
}

if (!argv.hasOwnProperty("game_id") || !argv.hasOwnProperty("winner_id")) {
	console.log("Please supply a --game_id and a --winner_id");
	process.exit();
}

const bracket = require("./data/bracket.json");
let results = d3.csvParse(fs.readFileSync("./results/results_2019.csv", "utf8"));

let teams = d3.csvParse(fs.readFileSync('./data/teams_2019.csv', 'utf8'));
teams.forEach((d, i) => {
	d.seed = +d.seed;
	d.game_id = String(i);
});

let lookup = {
	games: {},
	teams: {}
};

results.forEach(d => {
	lookup.games[d.game_id] = d;
});

teams.forEach(d => {
	lookup.teams[d.game_id] = d;
});

// first, archive the current results in case we screw this up
fs.copyFileSync("./results/results_2019.csv", "./results/historical/results_previous.csv");

let matchup = bracket[argv.game_id];

if (!matchup) {
	console.log("Couldn't find a game with id `" + argv.game_id + "`");
	process.exit();
}

let game = lookup.games[argv.game_id];

if (game.teamA_id != argv.winner_id && game.teamB_id != argv.winner_id) {
	console.log("Neither team in that game matches the id `" + argv.winner_id + "`");
	process.exit();
}

game.winner_id = argv.winner_id;
game.winner = teams[argv.winner_id].team;

if (argv.game_id != "game_62") {
	let next_id = matchup.next;
	let next_side = matchup.next_side;
	let next_game = lookup.games[next_id];
	next_game["team" + next_side] = game.winner;
	next_game["team" + next_side + "_id"] = game.winner_id;
}

fs.writeFileSync("./results/results_2019.csv", d3.csvFormat(results));


