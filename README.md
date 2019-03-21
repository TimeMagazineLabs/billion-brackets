# One Billion Brackets

Generate as many NCAA brackets as possible

## Premise

Filling out an NCAA bracket involves making 63 binary decisions, meaning there are 2<sup>63</sup> possible entries. That comes out to 9,223,372,036,854,775,808, or "nine quintillion." This program will surely die before we get there, but it can spit out a million possible brackets in a few minutes.

## Usage

	npm install
	node bracket.js

## Under the hood

The only really important function here is [`choose`](https://github.com/TimeMagazine/billion-brackets/blob/master/bracket.js#L31), which determines the weight of the randomized selection for each game based on the seeds. You're welcome to fuss with it. The current algo is a linear decline from 50% for each point difference in seeds. 

## Fact-Checking in R

The R project is a single script that loads the brackets and tallies them as a sanity check. It can also visualize any given row in a clunky HTML table.

## License
MIT


