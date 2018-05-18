library(dplyr)
library(tidyr)

library(readr)
library(jsonlite)

# loading origin data

sourceData <- read.csv(file="origin_data.csv", header=TRUE, sep=",", encoding="UTF-8")
sourceData$total_employees <- as.numeric(sub(",", "", sourceData$total_employees , fixed = TRUE))

names(sourceData)
# tidy data ( split ranking info )
overall <- sourceData %>%
    gather("ranking_type", "ranking", 9:11) %>%
      arrange(ranking) %>%
    group_by(ranking_type) %>%
      slice(1:10) %>%
      mutate(ranking = 1:n()) %>%
      ungroup() %>%
    select(company_name, sector_1, ranking_type, ranking, total_employees, technical_total, leadership_total) %>%
    arrange(ranking_type, ranking) %>%
  group_by(ranking_type) %>%
    nest() %>%
    spread(ranking_type, data) %>%
    toJSON(pretty = TRUE) %>%
    write_lines("../data/topCompanies.json")



