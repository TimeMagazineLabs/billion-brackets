
scores$rounds01 <- scores$round0 + scores$round1
scores$rounds012 <- scores$round0 + scores$round1 + scores$round2

scatter_0 <- setNames(
  as.data.frame(table(scores$round0, scores$points)),
  c("round0", "total", "count")
)
scatter_0 = scatter_0[scatter_0$count != 0,]

ggplot(scatter_0, aes(x=round0, y=total)) + 
  geom_point(aes(size=count), colour="#009900")



scatter_1 <- setNames(
  as.data.frame(table(scores$round1, scores$points)),
  c("round1", "total", "count")
)
scatter_1 = scatter_1[scatter_1$count != 0,]

ggplot(scatter_1, aes(x=round1, y=total)) + 
  geom_point(aes(size=count), colour="#990000")


scatter_2 <- setNames(
  as.data.frame(table(scores$round2, scores$points)),
  c("round2", "total", "count")
)
scatter_2 = scatter_2[scatter_2$count != 0,]

ggplot(scatter_2, aes(x=round2, y=total)) + 
  geom_point(aes(size=count), colour="#000099")




scatter_2 <- setNames(
  as.data.frame(table(scores$round2, scores$possible)),
  c("round2", "possible", "count")
)
scatter_2 = scatter_2[scatter_2$count != 0,]

ggplot(scatter_2, aes(x=round2, y=possible)) + 
  geom_point(aes(size=count), colour="#000099")



scatter_01 <- setNames(
  as.data.frame(table(scores$rounds01, scores$points)),
  c("rounds01", "total", "count")
)
scatter_01 = scatter_01[scatter_01$count != 0,]

ggplot(scatter_01, aes(x=rounds01, y=total)) + 
  geom_point(aes(size=count), colour="#999900")





scatterp_0 <- setNames(
  as.data.frame(table(scores$round0, scores$possible)),
  c("round0", "possible", "count")
)
scatterp_0 = scatterp_0[scatterp_0$count != 0,]

ggplot(scatterp_0, aes(x=round0, y=possible)) + 
  geom_point(aes(size=count), colour="#009900")

scatterp_1 <- setNames(
  as.data.frame(table(scores$round1, scores$possible)),
  c("round1", "possible", "count")
)
scatterp_1 = scatterp_1[scatterp_1$count != 0,]

ggplot(scatterp_1, aes(x=round1, y=possible)) + 
  geom_point(aes(size=count), colour="#990000")



scatterp_01 <- setNames(
  as.data.frame(table(scores$rounds01, scores$possible)),
  c("rounds01", "possible", "count")
)
scatterp_01 = scatterp_01[scatterp_01$count != 0,]

ggplot(scatterp_01, aes(x=rounds01, y=possible)) + 
  geom_point(aes(size=count), colour="#990000")





scatter <- function(key0, key1) {
  tab = setNames(
    as.data.frame(table(scores[key0], scores[key1])),
    c(key0, key1, "count")
  )
  tab = tab[tab$count != 0,]
  return(tab)
}

scatter_0_test <- scatter("round0", "points")


scatter_0 <- setNames(
  as.data.frame(table(scores$round0, scores$points)),
  c("round0", "total", "count")
)

scatter_1 <- setNames(
  as.data.frame(table(scores$round1, scores$points)),
  c("round1", "total", "count")
)

scatter_2 <- setNames(
  as.data.frame(table(scores$round2, scores$points)),
  c("round2", "total", "count")
)
