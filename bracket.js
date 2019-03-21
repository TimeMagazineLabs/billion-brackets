const fs = require('fs');
const d3 = require('d3')
const hash = require('object-hash')

let brackets = [];

// for efficiency and/or sanity, we'll store each unique round, from 64 teams to 1, in a hash table
let roundsHash = {};

// this is a simple array of the 64 teams identified by name, seed, conference ...
let teams = d3.csvParse(fs.readFileSync('./teams_2019.csv', 'utf8'));

// ... and a unique ID from 0 to 63
teams.forEach((d, i) => {
	d.seed = +d.seed;
	d.id = i;
});

// let's add the initial, immutable round of 64 to the hashTable
let round1 = teams.map(d => d.id );
let round1Hash = hash(round1);

roundsHash[round1Hash] = round1;

// choose between two teams, armed only with their initial seeds
// `noise` runs from 0 [always choose higher seed] to 1 [coin flip]
// any value between 0 and 1 is a relative degree of randomness weighted by the brackets

let choose = function(indexA, indexB, callback, tieGoesToB) {
	let rankA = teams[indexA].rank;
	let rankB = teams[indexB].rank;
	if (rankA != rankB) {
		callback(rankA > rankB ? indexA : indexB);
		return;
	}
	callback(indexA);
	callback(indexB);
}

let computeRound = function(previousRound, callback) {
	let nextRound = [];

	for (let c = 0; c < previousRound.length; c += 2) {
		
	}

};






// we're going to construct a bracket in a simple manner: Each round, from the initial 64 to the final 2, is a pairwise assembly of teams
// the even-indexed teams are always facing the subsequent odd-indexed team in the array

let generateBracket = function(callback) {
	let rounds = [ round1Hash ];

	// the 0th round is the 64 teams in traditional bracket order: East, West, Midwest, South
	rounds.push(teams.map(d => d.id ));

	let copyMe = function() {

	}

	let runRound = function() {
		previousRound = rounds.slice(-1)[0];
		console.log(previousRound);
	}

	// runRound();
}




// generateBracket();
