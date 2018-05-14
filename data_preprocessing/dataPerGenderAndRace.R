library(dplyr)
library(tidyr)

library(readr)
library(jsonlite)

# loading origin data

sourceData <- read.csv(file="origin_data.csv", header=TRUE, sep=",", encoding="UTF-8")
sourceData$total_employees <- as.numeric(sub(",", "", sourceData$total_employees , fixed = TRUE))

names(sourceData)

# get overall information

overall_labels <- c(NA, "total", "employees", "overall")
base_keys <- c("position", "gender", "race")

overall <- sourceData %>% 
  summarise_at(names(.)[12:42], funs(sum)) %>%
  gather("category", "count", 1:31) %>%
  separate(category, base_keys, sep="_", fill="right", remove=TRUE) %>%
  mutate_at(base_keys, funs( if_else( . %in% overall_labels, "all", .) ))

result <- overall %>%
  group_by(race, position) %>%
    nest() %>%
  group_by(race) %>% 
    nest() %>%
  toJSON(pretty = TRUE) %>%
  write_lines("../data/statsByRaceAndGender.json")

overall %>%
  filter(gender != "all", race != "all") %>%
  group_by(position, gender) %>%
    summarise(total = sum(count)) %>%
    ungroup() %>%
  spread(gender, total) %>%
    mutate(all=(female + male)) %>%
  toJSON(pretty = TRUE) %>%
  write_lines("../data/overallByGender.json")

