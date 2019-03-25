library(knitr)
library(kableExtra)

teams <- read.csv("../data/teams_2019.csv", stringsAsFactors = F)
team_names <- teams$team

brackets <- read.csv("../results/brackets.csv", stringsAsFactors = F)

getWinnerDistribution <- function(brackets) {
  winners <- setNames(as.data.frame(table(brackets$winner)), c("team", "wins"))
  winners$percent = round(100 * winners$wins / NROW(brackets), digits = 3)
  winners <- merge(winners, teams[,c("team", "seed")], by='team')
  return(winners);
}

winners <- getWinnerDistribution(brackets)

id_to_team <- function(id) {
  return(team_names[id + 1])
}

visualizePrediction <- function(index) {
  ids = brackets[index,4:66];
  names = as.character(lapply(ids, id_to_team))
  
  bracketTable <- data.frame(
    "Round 1" = team_names,
    "Round 2" = unlist(c(rbind(lapply(names[1:32], function(x) rep(x,2))))),
    "Sweet 16" = unlist(c(rbind(lapply(names[33:48], function(x) rep(x,4))))),
    "Elite Eight" = unlist(c(rbind(lapply(names[49:56], function(x) rep(x,8))))),
    "Final Four" = unlist(c(rbind(lapply(names[57:60], function(x) rep(x,16))))),
    "Championship" = unlist(c(rbind(lapply(names[61:62], function(x) rep(x,32))))),
    "Winner" = unlist(c(rbind(lapply(names[63], function(x) rep(x,64)))))
  )
  
  kable(bracketTable, align = "l") %>%
    kable_styling(full_width = F) %>%
    collapse_rows(columns = 1:7, valign = "middle")
}

visualizePrediction(100010)
