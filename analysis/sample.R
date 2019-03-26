# The script isn't going to finish exactly at 10M, so let's sample exactly that number

brackets_original <- read.csv("../brackets/brackets.csv", stringsAsFactors = F)
indices <- sample(nrow(brackets), 10^7)
brackets <- brackets_original[indices,]

write.csv(brackets, "../brackets/brackets_10000000.csv", row.names = F)