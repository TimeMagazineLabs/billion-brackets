library(knitr)
library(kableExtra)

teams <- read.csv("../data/teams_2019.csv", stringsAsFactors = F)
team_names <- teams$team
id_to_team <- function(id) {
  return(team_names[id + 1])
}

cumulative_percent <- function(df) {
  df$cumulative_percent <- 0;
  for (i in 1:NROW(df)) {
    df[i,"cumulative_percent"] <- sum(df[1:i, "percent"])
  }
  return(df);
}

summarize <- function(key, cutoff=-1, filename=F) {
  tab = setNames(
    as.data.frame(table(scores[key])),
    c("value", "count")
  )
  tab$value <- as.numeric(as.character(tab$value))
  tab$percent = 100 * tab$count / NROW(scores)
  print(qplot(tab$value, tab$count, main=key))
  if (filename != F) {
    write.csv(tab, paste("../scores/", filename, ".csv", sep=""), row.names = F)  
  }
  tab <- cumulative_percent(tab)
  mx <- max(tab$value)
  print(mx)
  print(tab[tab$value == mx,"count"][1])
  #print(median(tab[tab$cumulative_percent >= 99,"value"]))
  if (cutoff != -1) {
    print(paste(NROW(scores[scores[key] >= cutoff,]), "have at least", cutoff, "points"))
  }
  return(tab);
}

# replace bracket with team names
nameBracket <- function(bracket) {
  ids = bracket[,4:66]
  names = as.character(lapply(ids, id_to_team))
  return(names)
}

visualizePrediction <- function(hash) {
  bracket = brackets[brackets$hash == hash,]
  names = nameBracket(bracket)
  
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