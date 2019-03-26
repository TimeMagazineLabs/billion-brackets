library(ggplot2)

#teams <- read.csv("../data/teams_2019.csv", stringsAsFactors = F)
#team_names <- teams$team

scores <- read.csv("../scores/scores2.csv", stringsAsFactors = F)

cumulative_percent <- function(df) {
  df$cumulative_percent <- 0;
  for (i in 1:NROW(df)) {
    df[i,"cumulative_percent"] <- sum(df[1:i, "percent"])
  }
  return(df);
}

hist(scores$points)

summarize <- function(key, cutoff, filename=F) {
  tab = setNames(
    as.data.frame(table(scores[key])),
    c("value", "count")
  )
  tab$value <- as.numeric(as.character(tab$value))
  tab$percent = 100 * tab$count / NROW(scores)
  qplot(tab$value, tab$count)
  if (filename != F) {
    write.csv(tab, paste("../scores/", filename, ".csv", sep=""), row.names = F)  
  }
  tab <- cumulative_percent(tab)
  mx <- max(tab$value)
  print(mx)
  print(tab[tab$value == mx,"count"][1])
  print(median(tab[tab$cumulative_percent >= 99,"value"]))
}

# Total points
summarize("points", "summary")
summarize("round0")
summarize("round1")
summarize("possible", "possible")

leaders = NROW(scores[scores$possible >= 180,])




#brackets <- read.csv("../brackets/brackets.csv", stringsAsFactors = F)
#leaders = scores[scores$points == max(scores$points),]
#leadingBrackets = brackets[brackets$hash %in% leaders$hash,]