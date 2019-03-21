teams <- read.csv("./data/teams_2019.csv", stringsAsFactors = F)

brackets_straight <- read.csv("./results/brackets_straight_odds.csv", stringsAsFactors = F)
brackets_square_root <- read.csv("./results/brackets_square_root.csv", stringsAsFactors = F)

getWinnerDistribution <- function(brackets) {
  winners <- setNames(as.data.frame(table(brackets$winner)), c("team", "wins"))
  winners$percent = round(100 * winners$wins / NROW(brackets), digits = 3)
  winners <- merge(winners, teams[,c("team", "seed")], by='team')
  return(winners);
}

winners_square_root <- getWinnerDistribution(brackets_square_root)
