library(ggplot2)
library(RColorBrewer)
source("./lib/helpers.R")

# Points per round
summaries.round0 = setNames(read.csv("../scores/rounds/summary_0.csv", stringsAsFactors = F), c("value", "count0", "percent0"))
summaries.round1 = setNames(read.csv("../scores/rounds/summary_1.csv", stringsAsFactors = F), c("value", "count1", "percent1"))
summaries.round2 = setNames(read.csv("../scores/rounds/summary_2.csv", stringsAsFactors = F), c("value", "count2", "percent2"))
summaries.round3 = setNames(read.csv("../scores/rounds/summary_3.csv", stringsAsFactors = F), c("value", "count3", "percent3"))

byRoundPoints = merge(summaries.round0, summaries.round1, by="value", all = TRUE)
byRoundPoints = merge(byRoundPoints, summaries.round2, by="value", all = TRUE)
byRoundPoints = merge(byRoundPoints, summaries.round3, by="value", all = TRUE)
byRoundPoints[is.na(byRoundPoints)] <- 0

blues = rev(brewer.pal(6, "Blues"))

ggplot(data = byRoundPoints, aes(x=value)) + 
  geom_line(aes(y = count0), color = blues[1]) +
  geom_line(aes(y = count1), color = blues[2]) +
  geom_line(aes(y = count2), color = blues[3]) +
  geom_line(aes(y = count3), color = blues[4])


# Possible points per round
possibles.round0 = setNames(read.csv("../scores/rounds/possible_0.csv", stringsAsFactors = F), c("value", "count0", "percent0"))
possibles.round1 = setNames(read.csv("../scores/rounds/possible_1.csv", stringsAsFactors = F), c("value", "count1", "percent1"))
possibles.round2 = setNames(read.csv("../scores/rounds/possible_2.csv", stringsAsFactors = F), c("value", "count2", "percent2"))
possibles.round3 = setNames(read.csv("../scores/rounds/possible_3.csv", stringsAsFactors = F), c("value", "count3", "percent3"))

byRoundPossible = merge(possibles.round0, possibles.round1, by="value", all = TRUE)
byRoundPossible = merge(byRoundPossible, possibles.round2, by="value", all = TRUE)
byRoundPossible = merge(byRoundPossible, possibles.round3, by="value", all = TRUE)
byRoundPossible[is.na(byRoundPossible)] <- 0

greens = rev(brewer.pal(6, "Greens"))

ggplot(data = byRoundPossible, aes(x=value)) + 
  geom_line(aes(y = count0), color = greens[1]) +
  geom_line(aes(y = count1), color = greens[2]) +
  geom_line(aes(y = count2), color = greens[3]) +
  geom_line(aes(y = count3), color = greens[4])
