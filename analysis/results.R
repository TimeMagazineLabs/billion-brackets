teams <- read.csv("../data/teams_2019.csv", stringsAsFactors = F)
team_names <- teams$team

scores <- read.csv("../scores/scores.csv", stringsAsFactors = F)

hist(scores$points)
hist(scores$round0)
hist(scores$round1)

table(scores[scores$round1 == 32,"round0"])

table(scores$future_losses)
