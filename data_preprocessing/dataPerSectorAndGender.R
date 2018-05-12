library(dplyr)
library(tidyr)

library(readr)
library(jsonlite)

# loading origin data

sourceData <- read.csv(file="origin_data.csv", header=TRUE, sep=",", encoding="UTF-8")
sourceData$total_employees <- as.numeric(sub(",", "", sourceData$total_employees , fixed = TRUE))

names(sourceData)

# get stats by sectors

overall_labels <- c(NA, "total", "employees", "overall")
base_keys <- c("position", "gender", "race")

overall <- sourceData %>% 
  gather("sector_type", "sector", 3:4) %>%
    filter(sector != "") %>%
  group_by(sector) %>%
    summarise_at(names(.)[10:40], funs(sum)) %>%
    ungroup() %>%
  gather("category", "count", 2:32) %>%
    separate(category, base_keys, sep="_", fill="right", remove=TRUE) %>%
    mutate_at(base_keys, funs( if_else( . %in% overall_labels, "all", .) )) %>%
  arrange(sector)

onlyAll <- overall %>%
  group_by(sector, position, gender) %>%
  filter(race == "all", gender == "all") %>%
  summarise(count = sum(count)) %>%
  ungroup()

byGender <- overall %>%
  group_by(sector, position, gender) %>%
  filter(race != "all") %>%
  summarise(count = sum(count)) %>%
  ungroup() %>%
  bind_rows(onlyAll) %>%
  arrange(sector, position)

result <- overall %>%
  group_by(sector, position) %>%
    nest() %>%
  group_by(sector) %>% 
    nest() %>%
  toJSON(pretty = TRUE) %>%
  write_lines("../data/statsBySectorAndGender.json")


