# TODO rscript parser of data
options(warn=-1)
setup = function(){
	list.of.packages <- c('ggplot2', 'readxl', 'gridExtra', 'dplyr', 'grid', 'scales', 'lubridate');
	new.packages <- list.of.packages[!(list.of.packages %in% installed.packages()[,"Package"])]
	if(length(new.packages)) install.packages(new.packages, repos = "https://ftp.acc.umu.se/mirror/CRAN/")
	library(dplyr)
}
suppressMessages(setup());


meta = do.call(rep, input)


# df = NA;
# if(is.null(url)){
	# return(null)
# }else{
	# df = meta['content'];
# }
# df
# url

# dates = c("2010-10-10", "2010-10-11", "2010-10-12");
# location = c("aa", "bb", "cc");
# prec = c(10, 3.2, 0.1);
# temp = c(-1, 1, -1);
# df = data.frame(dates, location, prec, temp);

# df <- df %>% mutate(snow = temp < 0);
# df
