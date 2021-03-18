# TODO rscript parser of data
library(dplyr);

getDoy <- function(date){
	# TODO
	return(1)
}



dates = c("2010-10-10", "2010-10-11", "2010-10-12") 
location = c("aa", "bb", "cc") 
prec = c(10, 3.2, 0.1)
temp = c(-1, 1, -1)
df = data.frame(dates, location, prec, temp)

df <- df %>% mutate(snow = temp < 0);
df <- df %>% mutate(doy = getDoy(date))
df
