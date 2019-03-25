const fs = require('fs');
const d3 = require('d3-dsv');

let bracket = require("./bracket.json");
let games = []; // a companion CSV of each game for tracking results

Object.keys(bracket).slice(1).forEach(d => {
	let game = bracket[d];
	games.push({
		id: d,
		region: game.region,
		teamA_id: game.A.id,
		teamA: game.A.team,
		teamB_id: game.B.id,
		teamB: game.B.team,
		winner_id: game.winner.id,
		winner: game.winner.team
	});
});

fs.writeFileSync("./games_2019.csv", d3.csvFormat(games));