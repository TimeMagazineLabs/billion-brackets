# One Billion Brackets

Generate as many NCAA brackets as possible

## Premise

Filling out an NCAA bracket involves making 63 binary decisions, meaning there are 2<sup>63</sup> possible entries. That comes out to 9,223,372,036,854,775,808, or "nine quintillion." This program will surely die before we get there, but it can spit out a million possible brackets in a few minutes.

## Usage

### Generating random brackets

This will continue to append new random brackets to `brackets/brackets.csv` until you quit.

	npm install
	node bracket.js

### Adding results

For each completed game, run the `addWinner.js` script with two arguments: The `--game_id` and the `--winner_id`. The script will politely complain if you select a winner who was not playing in that game.

The games are ordered from 0 to 63 in ascending rounds, always sorted by East, West, South and Midwest. The easiest thing to do is open [`results/results_2019.csv`](results/results.csv) and look up the relevant game and the winner's id, also an integer from 0 to 63.

## Scoring the brackets

Once the [`results/results.csv`](results/results.csv) file is up-to-date, just run this command, then go get coffee for about 15 minutes.

	node evaluateResults.js

This script scores each bracket, round by round, and also computes the highest possible score in the frequent case where a predicted winner in a future game is no longer in the bracket.

## Under the hood

The only really important function here is [`choose`](https://github.com/TimeMagazine/billion-brackets/blob/master/bracket.js#L31), which determines the weight of the randomized selection for each game based on the seeds. You're welcome to fuss with it. The current algo is a linear decline from 50% for each point difference in seeds. 

## Fact-Checking in R

The [R project in `./analysis`](analysis) is a pair of scripts:
+ [`check.R`](analysis/check.R) loads the brackets and tallies them as a sanity check. It can also visualize any given row in a clunky HTML table.
+ [`results.R`](analysis/results.R) summarizes the scores after you run `./evaluateResults.js`.

## License
MIT


