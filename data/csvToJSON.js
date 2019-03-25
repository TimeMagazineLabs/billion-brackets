const fs = require('fs');
const d3 = require('d3-dsv');

let bracket = { id: null }; // a flat object with one key per game, not nested

// this is a simple array of the 64 teams identified by name, seed, conference ...
let teams = d3.csvParse(fs.readFileSync('./teams_2019.csv', 'utf8'));

// ... and a unique ID from 0 to 63
teams.forEach((d, i) => {
	d.seed = +d.seed;
	d.id = i;
});

let roundCounts = [ 32, 48, 56, 60, 62, 63 ];

// build data structure
for (let c = 0; c < 63; c += 1) {
	let id = "game_" + c;

	bracket[id] = {
		round: null,
		id: id,
		previous: null,
		next: null,
		next_side: null,
		region: null,
		A: {
			id: null,
			team: null
		},
		B: {
			id: null,
			team: null
		},
		winner: {
			id: null,
			team: null
		}
	}
}

// first round
for (let c = 0; c < teams.length; c += 2) {
	let id = "game_" + Math.floor(c / 2);
	let next_id = "game_" + (Math.floor(c / 4) + 32);
	let next_side = (c % 4 < 2 ? "A" : "B");

	bracket[id].round = 1;
	bracket[id].next = next_id;
	bracket[id].next_side = next_side;
	bracket[next_id].previous = bracket[next_id].previous || [];
	bracket[next_id].previous.push(id);
	bracket[id].region = teams[c].region;

	bracket[id].A.id = teams[c].id;
	bracket[id].A.team = teams[c].team;

	bracket[id].B.id = teams[c+1].id;
	bracket[id].B.team = teams[c+1].team;
}

let game_number = 32;

[16, 8, 4, 2, 1].forEach((game_count, t) => {
	for (let i = 0; i < game_count; i += 1) {
		let id = "game_" + (game_number + i);
		bracket[id].round = t + 2;

		if (game_count !== 1) {
			let next_id = "game_" + (game_number + game_count + Math.floor(i / 2));
			let next_side = (i % 2 == 0 ? "A" : "B");
			bracket[id].next = next_id;
			bracket[id].next_side = next_side;		
			bracket[next_id].previous = bracket[next_id].previous || [];
			bracket[next_id].previous.push(id);
		}

		let regionA = bracket[bracket[id].previous[0]].region;
		let regionB = bracket[bracket[id].previous[1]].region;

		if (regionA == regionB) {
			bracket[id].region = regionA;
		} else {
			bracket[id].region = regionA + "_" + regionB;
		}

	}
	game_number += game_count;
});

fs.writeFileSync("./bracket.json", JSON.stringify(bracket, null, 2));