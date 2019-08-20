library(ggplot2)

source("./lib/helpers.R")

scores <- read.csv("../scores/scores_final.csv", stringsAsFactors = F)
brackets <- read.csv("../brackets/brackets.csv", stringsAsFactors = F)

# Total points
sum_points = summarize("points", 160, "summary_final")
sum_possible = summarize("possible", 170, "possible_final")

leaders <- scores[scores$points == max(scores$points),]
winner <- brackets[brackets$hash == leaders$hash,]
visualizePrediction(winner$hash)

# cumulative scores
scores$cumulative0 <- scores$round0
scores$cumulative1 <- scores$round0 + scores$round1
scores$cumulative2 <- scores$round0 + scores$round1 + scores$round2
scores$cumulative3 <- scores$round0 + scores$round1 + scores$round2 + scores$round3
scores$cumulative4 <- scores$round0 + scores$round1 + scores$round2 + scores$round3 + scores$round4
scores$cumulative5 <- scores$round0 + scores$round1 + scores$round2 + scores$round3 + scores$round4 + scores$round5
  
# Round-by-Round
spread = list(
  r0 = summarize("cumulative0"),
  r1 = summarize("cumulative1"),
  r2 = summarize("cumulative2"),
  r3 = summarize("cumulative3"),
  r4 = summarize("cumulative4"),
  r5 = summarize("cumulative5")
)

# For the final pounts, we have local maxima at 54 and 109 and a max of 178

maxima = list(
  m54 = scores[scores$points == 54,],
  m55 = scores[scores$points == 55,],
  m109 = scores[scores$points == 109,],
  m110 = scores[scores$points == 110,],
  m130 = scores[scores$points == 130,],
  m178 = scores[scores$points == 178,]
)

correct_winner = scores[scores$round5 == 32,]
incorrect_winner = scores[scores$round5 == 0,]
median(correct_winner$points)
median(incorrect_winner$points)
mean(correct_winner$points)
mean(incorrect_winner$points)
