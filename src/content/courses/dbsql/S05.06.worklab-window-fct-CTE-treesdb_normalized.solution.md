---
layout: default_en
title: "Postgresql CTEs -lab"
page_title: "Postgresql CTEs Lab"
summary: "CTEs Lab"
footer: 'Alexis Perrier - Skatai.com  https://discord.gg/DDbh5AyHYH'
---


# Lab on window functions and CTEs

The goal of this worksheet is to practice using window functions and CTEs on the `treesdb` database.

You are a newly recruited analyst working in the Paris administration for parks.
You are given this dataset of trees in Paris and vicinity.

Your job is to get insights on the data to facilitate tree management and  improve the dataset


---

# dataset

At this point you should have the V03 normalized version of the trees database (`treesdb_v03`) loaded in PostgreSQL.

- download the sql backup from [https://skatai.com/assets/db/treesdb_v03_normalized.sql](https://skatai.com/assets/db/treesdb_v03_normalized.sql)

- restore the database

**from the terminal**

```bash
psql -d postgres -f <path to the sql backup>/treesdb_v03_normalized.sql
```

**or within a PSQL session**

```sql
\i <path to the sql backup>/treesdb_v03_normalized.sql
```

This will create a new database called `treesdb_v03_normalized`

---

The database has multiple tables: `trees`, `locations`, `taxonomy`, `tree_names`, `tree_genres`, `tree_species`, `tree_varieties`, `tree_stages`, and `tree_domains`.

---

# CTE Warm up

## Basic CTE - Tree Size Categories

Write a query that categorizes trees by their height and shows statistics for each category.

**Steps:**
1. Create a CTE called `tree_categories` that assigns each tree to a size category:
   - 'Small': height < 10m
   - 'Medium': height between 10m and 20m
   - 'Large': height > 20m
2. Count how many trees are in each category
3. Calculate the average circumference for each category

**Expected output columns:**
- `size_category`
- `tree_count`
- `avg_circumference`


**Hint**

Use a `CASE` statement to create the categories:
```sql
CASE
    WHEN height < 10 THEN 'Small'
    WHEN height BETWEEN 10 AND 20 THEN 'Medium'
    ELSE 'Large'
END
```

the results look like this

```
 size_category | tree_count | avg_circumference
---------------+------------+-------------------
 Small         |     116939 |             42.36
 Medium        |      88421 |            123.47
 Large         |       5979 |            226.30
(3 rows)
```


<!-- solution -->

```sql
WITH tree_categories AS (
    SELECT
        id,
        height,
        circumference,
        CASE
            WHEN height < 10 THEN 'Small'
            WHEN height BETWEEN 10 AND 20 THEN 'Medium'
            ELSE 'Large'
        END AS size_category
    FROM trees
    WHERE height IS NOT NULL
)
SELECT
    size_category,
    COUNT(*) AS tree_count,
    ROUND(AVG(circumference)::numeric, 2) AS avg_circumference
FROM tree_categories
GROUP BY size_category
ORDER BY
    CASE size_category
        WHEN 'Small' THEN 1
        WHEN 'Medium' THEN 2
        WHEN 'Large' THEN 3
    END;
```

---

### Multiple CTEs - Arrondissement Analysis

Write a query using TWO CTEs to find which arrondissements have the most remarkable trees.

**Steps:**
1. First CTE (`arrond_stats`): Count total trees and remarkable trees per arrondissement
2. Second CTE (`arrond_percentages`): Calculate the percentage of remarkable trees
3. Final SELECT: Show top 5 arrondissements by percentage of remarkable trees

**Expected output columns:**
- `arrondissement`
- `total_trees`
- `remarkable_trees`
- `remarkable_percentage`

The first 5 rows of the results should be

```bash
  arrondissement   | total_trees | remarkable_trees | remarkable_percentage
-------------------+-------------+------------------+-----------------------
 BOIS DE BOULOGNE  |        4143 |               23 |                  0.56
 BOIS DE VINCENNES |       11804 |               32 |                  0.27
 PARIS 3E ARRDT    |        1289 |                3 |                  0.23
 PARIS 4E ARRDT    |        2772 |                6 |                  0.22
 PARIS 5E ARRDT    |        2690 |                6 |                  0.22
```


<!-- Solution -->

```sql
WITH arrond_stats AS (
    SELECT
        l.arrondissement,
        COUNT(*) AS total_trees,
        COUNT(*) FILTER (WHERE t.remarkable = true) AS remarkable_trees
    FROM trees t
    JOIN locations l ON t.location_id = l.id
    WHERE l.arrondissement IS NOT NULL
    GROUP BY l.arrondissement
),
arrond_percentages AS (
    SELECT
        arrondissement,
        total_trees,
        remarkable_trees,
        ROUND((remarkable_trees::numeric / total_trees * 100), 2) AS remarkable_percentage
    FROM arrond_stats
)
SELECT *
FROM arrond_percentages
ORDER BY remarkable_percentage DESC
LIMIT 5;
```

---

## Part I: data quality and the stage column

You are not satisfied with the values in the ```stage``` column which are:

```sql
SELECT COUNT(*) as n, ts.stage
FROM trees t
LEFT JOIN tree_stages ts ON t.stage_id = ts.id
GROUP BY ts.stage
ORDER BY n DESC;
```

> **Note**: the `left join` allows to consider `null` values for stage.

The query returns

```
   n   |        stage
-------+---------------------
 79627 | Adulte
 46742 | [null]
 38915 | Jeune (arbre)
 38765 | Jeune (arbre)Adulte
  7290 | Mature
```



There are too many `NULL` values and it's not clear what ```Jeune (arbre)Adulte``` really stands for. Is it a _jeune_ (young) or an _adulte_ tree?

So we want to replace the `stage` values by some new categorical column that we call `maturity`.

- For each tree, we calculate the max `height` for its **type** defined as **genre + species**.
- then we calculate the ratio of each tree `height` over `max_height`
- finally we set the `maturity` category for a given tree type (genre, species) and related `max_height` based on the ratio.

The `maturity` categories are given by the following thresholds

| ratio = height / max_height | maturity    |
| --------------------------- | ----------- |
| ratio < 0.25                | young       |
| 0.25 <= ratio  < 0.5        | young adult |
| 0.5 <= ratio  < 0.75        | adult       |
| 0.75 <= ratio               | mature      |

> These thresholds (0.25, 0.75) are totally arbitrary and may not reflect reality.
> Also we assume that tree growth is linear (although that's [debatable](https://www.reddit.com/r/askscience/comments/eyf3ar/is_tree_growth_linear_or_do_younger_trees_grow/))

### 1. max height per tree type

You first need to calculate the max(height) per type of tree as a standalone column.

Keep in mind that

- we want the max(height) for each `genre` and `species`
- we only consider not null values for `genre` and `species`

Write the query that returns

- for each tree, the columns: `id`, `genre`, `species`, `height` and `max_height`
- alphabetically ordered by `genre`, `species` and by `height` and `max_height` decreasing

Hint: use `partition by genre, species`

The first rows of the result should look like

```bash
  id   | genre  | species  | height | max_height
-------+--------+----------+--------+------------
 43053 | Abelia | triflora |      6 |          6
 83127 | Abies  | alba     |     22 |         22
 97141 | Abies  | alba     |     20 |         22
 88940 | Abies  | alba     |     20 |         22
 73055 | Abies  | alba     |     20 |         22
```

Note: first create a CTE called `tree_taxonomy` that returns the columns: `id`, `genre`, `species`, `height`.

> Solution

```sql
WITH tree_taxonomy AS (
    SELECT
        t.id,
        tg.genre,
        ts.species,
        t.height
    FROM trees t
    JOIN taxonomy tax ON t.taxonomy_id = tax.id
    LEFT JOIN tree_genres tg ON tax.genre_id = tg.id
    LEFT JOIN tree_species ts ON tax.species_id = ts.id
    WHERE tg.genre IS NOT NULL
      AND ts.species IS NOT NULL
)
SELECT
    id,
    genre,
    species,
    height,
    MAX(height) OVER(PARTITION BY genre, species) AS max_height
FROM tree_taxonomy
ORDER BY genre, species, height DESC, max_height DESC
LIMIT 10;
```

### 2. Create a new `maturity` column

Create a new text column called ```maturity``` with data type `VARCHAR(50)` in the trees table.

To add a column to an existing table the query follows:

```sql
ALTER TABLE <table_name> ADD COLUMN <column_name> VARCHAR(50);
```

> Solution

```sql
ALTER TABLE trees ADD COLUMN maturity VARCHAR(50);
```

### 3. fill maturity with the right values : young, young adult, adult, mature

Use the query where you calculated `max_height` for each tree `genre` and `species`, as a named subquery and  update the `maturity` column with the calculated maturity values.

The rule is

| ratio                | maturity    |
| -------------------- | ----------- |
| ratio < 0.25         | young       |
| 0.25 <= ratio  < 0.5 | young adult |
| 0.5 <= ratio  < 0.75 | adult       |
| 0.75 <= ratio        | mature      |

where ratio = height / max_height

Hint: use  `CASE WHEN` in your query to map the ratio to a maturity category.

See [documentation](https://www.postgresql.org/docs/current/functions-conditional.html#FUNCTIONS-CASE)

Hint: You can use the query structure

```sql
WITH temp AS (
        -- some SQL query
)
UPDATE <table_name>
SET <column_name> = CASE
    WHEN (some cond 1) THEN 'label 1'
    ...
    ELSE 'other label'
END
FROM temp
WHERE temp.id = <table_name>.<id_column>;
```

> Solution

```sql
WITH get_height AS (
    SELECT t.id, tg.genre, ts.species, t.height,
        MAX(t.height) OVER(PARTITION BY tg.genre, ts.species) AS max_height
    FROM trees t
    JOIN taxonomy tax ON t.taxonomy_id = tax.id
    LEFT JOIN tree_genres tg ON tax.genre_id = tg.id
    LEFT JOIN tree_species ts ON tax.species_id = ts.id
    WHERE tg.genre IS NOT NULL
      AND ts.species IS NOT NULL
)
UPDATE trees t
SET maturity = CASE
    WHEN gh.height < 0.25 * gh.max_height THEN 'young'
    WHEN gh.height < 0.50 * gh.max_height THEN 'young adult'
    WHEN gh.height < 0.75 * gh.max_height THEN 'adult'
    ELSE 'mature'
END
FROM get_height gh
WHERE t.id = gh.id;
```

Here is the maturity distribution

```sql
select count(*) as n, maturity from trees group by maturity order by n asc;
```
returns
```
   n    |  maturity
--------+-------------
   1767 | mature
   5553 | adult
  13438 | young adult
  13688 | young
 176893 | [null]
```

#### 4. Is that maturity in accordance with the original stage values ?

Although the original stage column is showing very poor data quality we hope to keep some consistency between the new `maturity` categories and the original `stage` categories.

Let's look at diverging values for `stage = 'Jeune (arbre)'` and / or `maturity = 'young'`.
Hopefully most trees in the young maturity category should also have '_Jeune (arbre)_' for stage value.

The final goal in this part is to write the query that returns

- the percentage of trees that have either (non NULL values for stage only)
  - stage = 'Jeune (arbre)' AND maturity != 'young'
  - maturity = 'young'  AND stage != 'Jeune (arbre)'
- for the 10 most common genre of trees (Platanus to Celtis)

The result of that query should be

```bash
     genre     | total_trees | mismatch_trees | mismatch_percentage
---------------+-------------+----------------+---------------------
 Celtis        |        3824 |           2965 |               77.54
 Aesculus      |       22360 |          17043 |               76.22
 Platanus      |       39729 |          30107 |               75.78
 Pyrus         |        3618 |           2333 |               64.48
 Acer          |       13198 |           5508 |               41.73
 Prunus        |        4907 |           1805 |               36.78
 Quercus       |        3512 |           1034 |               29.44
 Fraxinus      |        4206 |            930 |               22.11
 Styphnolobium |        9908 |           1966 |               19.84
 Tilia         |       17543 |           2241 |               12.77
```

Let's build the query in steps

In all queries filter out null values for genre, maturity and stage.

1. 1st subquery named `genre_totals`: 10 most common genre of trees (Platanus to Celtis)
2. 2nd subquery named `genre_mismatch` : trees grouped by genre with either:
    - stage = 'Jeune (arbre)' AND maturity != 'young'
    - maturity = 'young'  AND stage != 'Jeune (arbre)'
3. finally use these 2 queries to find the `mismatch_percentage` per genre
4. order by `mismatch_percentage` desc.

The structure of the final query may look like

```sql
WITH genre_totals AS (
    --- 1st query
),
genre_mismatch AS (
    -- 2nd query
)
SELECT
    -- some columns
FROM genre_totals gt
JOIN genre_mismatch gm ON gt.genre = gm.genre
```

> solution

```sql
WITH genre_totals AS (
    SELECT tg.genre, COUNT(*) AS total_trees
    FROM trees t
    JOIN taxonomy tax ON t.taxonomy_id = tax.id
    LEFT JOIN tree_genres tg ON tax.genre_id = tg.id
    LEFT JOIN tree_stages ts ON t.stage_id = ts.id
    WHERE tg.genre IS NOT NULL
      AND t.maturity IS NOT NULL
      AND ts.stage IS NOT NULL
    GROUP BY tg.genre
    ORDER BY total_trees DESC
    LIMIT 10
),
genre_mismatch AS (
    SELECT tg.genre, COUNT(*) AS mismatch_trees
    FROM trees t
    JOIN taxonomy tax ON t.taxonomy_id = tax.id
    LEFT JOIN tree_genres tg ON tax.genre_id = tg.id
    LEFT JOIN tree_stages ts ON t.stage_id = ts.id
    WHERE ((ts.stage = 'Jeune (arbre)' AND t.maturity != 'young')
       OR (t.maturity = 'young' AND ts.stage != 'Jeune (arbre)'))
      AND tg.genre IS NOT NULL
      AND t.maturity IS NOT NULL
      AND ts.stage IS NOT NULL
    GROUP BY tg.genre
)
SELECT
    gt.genre,
    gt.total_trees,
    gm.mismatch_trees AS mismatch_trees,
    ROUND(CAST(
        (gm.mismatch_trees::float / gt.total_trees) * 100.0 AS numeric), 2) AS mismatch_percentage
FROM genre_totals gt
JOIN genre_mismatch gm ON gt.genre = gm.genre
ORDER BY mismatch_percentage DESC;
```

## Part II: Find tall and large trees

The climate change office of the Mairie de Paris wants to find the tallest trees in Paris.
Because large trees provide shelter from the heat during heat waves.

They ask you to provide the following list:

For each arrondissement, find the top 3 tallest trees.
and for each tree include

- id, arrondissement, height,
- max height in arrondissement
- height rank in arrondissement
- height rank over all trees in Paris

The result of the query should look like:

```bash
   id   |  arrondissement   | height | max_height_in_arrdt | height_rank_in_arrdt | overall_height_rank
--------+-------------------+--------+---------------------+----------------------+---------------------
   5103 | BOIS DE BOULOGNE  |     45 |                  45 |                    1 |                  29
 165500 | BOIS DE BOULOGNE  |     40 |                  45 |                    2 |                  31
  87670 | BOIS DE BOULOGNE  |     36 |                  45 |                    3 |                  34
  93035 | BOIS DE VINCENNES |    120 |                 120 |                    1 |                   8
 100832 | BOIS DE VINCENNES |     35 |                 120 |                    2 |                  35
  15336 | BOIS DE VINCENNES |     35 |                 120 |                    2 |                  35
   8722 | BOIS DE VINCENNES |     35 |                 120 |                    2 |                  35
 149302 | BOIS DE VINCENNES |     35 |                 120 |                    2 |                  35
  58508 | BOIS DE VINCENNES |     33 |                 120 |                    3 |                  37
 136397 | HAUTS-DE-SEINE    |     23 |                  23 |                    1 |                  47
```

First write the query that calculates the max(height) and ranks over the height partitioned by arrondissement and over all the trees.
Use `MAX()` and `DENSE_RANK()` functions.

Then use that query as a named subquery and filter its results on `height_rank_in_arrdt` to get the 3 tallest trees in each arrondissement.

> Solution

```sql
WITH ranked_trees AS (
    SELECT
        t.id,
        l.arrondissement,
        t.height,
        MAX(t.height) OVER (
            PARTITION BY l.arrondissement
            ORDER BY t.height DESC
        ) AS max_height_in_arrdt,
        DENSE_RANK() OVER (
            PARTITION BY l.arrondissement
            ORDER BY t.height DESC
        ) AS height_rank_in_arrdt,
        DENSE_RANK() OVER (
            ORDER BY t.height DESC
        ) AS overall_height_rank
    FROM trees t
    JOIN locations l ON t.location_id = l.id
)
SELECT *
FROM ranked_trees
WHERE height_rank_in_arrdt <= 3
ORDER BY arrondissement, height_rank_in_arrdt
LIMIT 10;
```

# Part III find outliers

We want to find absurd values for heights

We suppose that all trees of the same genre and species should have the same height range.

So we're going to order the trees by genre, species and height

Then using the LAG() function,

- for each tree find the height in the previous row
- if the height of the tree is more than double the previous height
- then the tree can be flagged as an outlier.

> Note: This will only flag the smallest first outlier.
> In a second pass we can also flag similar trees which are higher than the 1st outlier (we won't do it)

#### Average height

Write the query that returns the average height per tree per genre and species (Not null)

> solution

```sql
SELECT AVG(t.height), tg.genre, ts.species
FROM trees t
JOIN taxonomy tax ON t.taxonomy_id = tax.id
LEFT JOIN tree_genres tg ON tax.genre_id = tg.id
LEFT JOIN tree_species ts ON tax.species_id = ts.id
WHERE tg.genre IS NOT NULL
  AND ts.species IS NOT NULL
GROUP BY tg.genre, ts.species
ORDER BY tg.genre, ts.species;
```

#### LAG

Now use the `LAG()` function over `height` with default value the `avg_tree` height per genre and species

- filter out null values for genre and species
- order trees by genre, species

You need to join the main query with the subquery so that you can use the columns from the subquery

The query structure follows

```sql
WITH avg_heights AS (
    -- some sql
)
SELECT
    -- some columns
    -- LAG( ..., ah.avg_height) OVER(...)
FROM trees t
JOIN avg_heights ah ON .... -- (genre and species)
-- filter on not null values for genre and species
-- order by
```

> solution

```sql
WITH avg_heights AS (
    SELECT
        tg.genre,
        ts.species,
        AVG(t.height) AS avg_height
    FROM trees t
    JOIN taxonomy tax ON t.taxonomy_id = tax.id
    LEFT JOIN tree_genres tg ON tax.genre_id = tg.id
    LEFT JOIN tree_species ts ON tax.species_id = ts.id
    WHERE tg.genre IS NOT NULL
      AND ts.species IS NOT NULL
    GROUP BY tg.genre, ts.species
)
SELECT
    t.id,
    tg.genre,
    ts.species,
    t.height,
    LAG(t.height, 1, ah.avg_height) OVER (
        PARTITION BY tg.genre, ts.species
        ORDER BY t.id
    ) AS height_lag
FROM trees t
JOIN taxonomy tax ON t.taxonomy_id = tax.id
LEFT JOIN tree_genres tg ON tax.genre_id = tg.id
LEFT JOIN tree_species ts ON tax.species_id = ts.id
LEFT JOIN avg_heights ah
  ON tg.genre = ah.genre
  AND ts.species = ah.species
WHERE tg.genre IS NOT NULL
  AND ts.species IS NOT NULL
ORDER BY tg.genre, ts.species, t.id;
```

#### Outlier flag

Create a new column outlier as boolean default FALSE

```sql
ALTER TABLE trees ADD COLUMN outlier BOOLEAN DEFAULT FALSE;
```

write the query that sets the value of outlier

> if `height` > 2 * `height_lag` then `outlier` is True

Hint: re-use the previous query with the main SELECT as a named query and add an update statement

The query structure should now be like

```sql
WITH avg_heights AS (
    -- some sql
),
lagged_heights AS (
    -- main select from previous query
)
UPDATE trees
SET outlier = CASE
    WHEN (some condition) THEN true
    ELSE false
END
FROM lagged_heights
WHERE trees.id = lagged_heights.id;
```

> solution

```sql
WITH avg_heights AS (
    SELECT
        tg.genre,
        ts.species,
        AVG(t.height) AS avg_height
    FROM trees t
    JOIN taxonomy tax ON t.taxonomy_id = tax.id
    LEFT JOIN tree_genres tg ON tax.genre_id = tg.id
    LEFT JOIN tree_species ts ON tax.species_id = ts.id
    WHERE tg.genre IS NOT NULL
      AND ts.species IS NOT NULL
    GROUP BY tg.genre, ts.species
),
lagged_heights AS (
    SELECT
        t.id,
        tg.genre,
        ts.species,
        t.height,
        LAG(t.height, 1, ah.avg_height) OVER (
            PARTITION BY tg.genre, ts.species
            ORDER BY t.id
        ) AS height_lag
    FROM trees t
    JOIN taxonomy tax ON t.taxonomy_id = tax.id
    LEFT JOIN tree_genres tg ON tax.genre_id = tg.id
    LEFT JOIN tree_species ts ON tax.species_id = ts.id
    LEFT JOIN avg_heights ah
      ON tg.genre = ah.genre
      AND ts.species = ah.species
    WHERE tg.genre IS NOT NULL
      AND ts.species IS NOT NULL
)
UPDATE trees
SET outlier = CASE
    WHEN lagged_heights.height > 2 * lagged_heights.height_lag THEN true
    ELSE false
END
FROM lagged_heights
WHERE trees.id = lagged_heights.id;
```