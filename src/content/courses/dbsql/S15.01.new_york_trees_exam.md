---
layout: default_en
title: "The New York Trees census dataset - Exam"
page_title: "The New York Trees census dataset - Exam"
summary: "Explore the 2015 census of all the trees in Manhattan"
slides_project_home: /dbsql/
footer: 'Alexis Perrier - Skatai.com - relational databases - The New York Trees census dataset - Exam'
---

You work with the new york trees dataset. This is a subset of the dataset available on [Google Big Query public datasets](https://console.cloud.google.com/bigquery?ws=!1m5!1m4!4m3!1sbigquery-public-data!2snew_york_trees!3stree_census_2015). Our subset only contains trees in Manhattan.

If you have [not yet loaded](/dbsql/new_york_trees_dataset/) the dataset into a new SQL database, the sql file to restore the database is available at [https://skatai.com/assets/db/new_york_trees.sql](/assets/db/new_york_trees.sql).


As usual, you can restore the database from a PSQL session with the following command:
```
\i <path to the sql file>/new_york_trees.sql
```
For windows, make sure to correctly handle the path to the sql file.

The above restore command creates the `new_york_trees` database which contains only one table: the `trees` table which has records of 65423 trees.

---

# The exam

Divided into 4 parts :

- an easy quiz
- explore
- improve
- normalize
- functions

## Rules

- You have two hours. You must submit your answers at 18h. No late submissions.

- In the google form you should
    - submit your queries, not the results of the queries
    - at the end, export your database as a plain text format and upload it

- You must provide a SQL file backup, not a binary file.

- You have online access: google, postgres documentation etc
- **DO NOT USE chatgpt** or any other AI tool to answer the questions. I will know. It’s easy to spot.

### File Naming

**THIS IS IMPORTANT**

When you export the database follow these rules for naming the sql file

- absolutely no spaces in the filename. n
- the file name must follow : `trees_{first_name}_{last_name}_{version}.sql`
- all lowercase
- no spaces

For example, if I, Alexis Perrier, save the database version 3, the filename is `trees_alexis_perrier_3.sql`

NOT : `trees Alexis 3.sql`, `trees_{alexis}_{perrier}_{3}.sql`, `trees-Paul18.sql` etc ...


### PSQL session

It is better to work in a **psql** session. If you are using **pgadmin**, make sure you are not in the `query windows` but in the proper `psql` session.

## How to backup you database

You should make regular backups of your database as plain sql.
If you make a mistake, then you can restore the database from the backup. If you are rushed finishing the exam, you can always upload the most recent version of the database.

You can use the backup menu in pgadmin to backup your database. Make sure to select `plain` format. Or you can use the following command in the terminal

```sql
pg_dump -U username -d database_name > filename.sql
```

## Select into a table
You must store the output of all your queries into their own table

```sql
CREATE TABLE <target_table> AS
<your query>
```

Replace `<target_table>` by the target table name indicated in the question.


### Example

- **Question** : count the number of trees per nta_name.
- **target table** : `nta_tree_count`

The query should be :

```sql
CREATE TABLE nta_tree_count AS
select nta_name, count(*)
from trees
group by nta_name;
```

Then make sure the table `nta_tree_count` has been created by running `\d nta_tree_count` in your psql session.

---
# Data

The `new_york_trees` database has one table `trees` with records of 65423 trees in Manhattan.


## The schema

The `trees` table has the following attributes:

| Attribute  | Data Type | Description                                                         |
| ---------- | --------- | ------------------------------------------------------------------- |
| tree_id    | INTEGER   | PRIARY KEY                                                          |
| block_id   | INTEGER   | Identifier linking each tree to its mapped block                    |
| created_at | DATE      | Date the tree census data was collected                             |
| tree_dbh   | INTEGER   | Tree diameter at breast height (~54"/137cm above ground, in inches) |
| stump_diam | INTEGER   | Stump diameter measured through center, in inches                   |
| status     | STRING    | Tree status: 'Alive', 'Dead', or 'Stump'                            |
| health     | STRING    | Perceived health of tree                                            |
| spc_latin  | STRING    | Scientific species name (e.g., "Acer rubrum")                       |
| spc_common | STRING    | Common species name (e.g., "red maple")                             |
| user_type  | STRING    | Category of data collector                                          |
| problems   | STRING    | Comma-separated list of tree problems                               |
| root_stone | STRING    | Root problem from paving stones ('Yes'/'No')                        |
| root_grate | STRING    | Root problem from metal grates ('Yes'/'No')                         |
| root_other | STRING    | Other root problems ('Yes'/'No')                                    |
| trunk_wire | STRING    | Trunk problem from wires/rope ('Yes'/'No')                          |
| trnk_light | STRING    | Trunk problem from installed lighting ('Yes'/'No')                  |
| trnk_other | STRING    | Other trunk problems ('Yes'/'No')                                   |
| brch_light | STRING    | Branch problem from lights/wires ('Yes'/'No')                       |
| brch_shoe  | STRING    | Branch problem from sneakers ('Yes'/'No')                           |
| brch_other | STRING    | Other branch problems ('Yes'/'No')                                  |
| address    | STRING    | Nearest estimated address                                           |
| zipcode    | INTEGER   | Five-digit zipcode                                                  |
| zip_city   | STRING    | City derived from zipcode                                           |
| boroname   | STRING    | Borough name                                                        |
| nta_name   | STRING    | Neighborhood Tabulation Area (from 2010 US Census)                  |
| latitude   | FLOAT     | Decimal latitude                                                    |
| longitude  | FLOAT     | Decimal longitude                                                   |

The columns can be grouped according to:

- **dimensions** : `tree_dbh` and `stump_diam`
- **health** : `health` and `status`
- **user** : `user_type`
- **names** : `spc_common` and `spc_latin`
- **problems** : general `problems`, root related problems `root_stone`, `roo_grate`, `root_other`, trunk related problems `trunk_wire`, `trunk_light`, `trunk_other`, branch related problems `brch_light`, `brch_shoe`, `brch_other`
- **location** : `address`, `zipcode`, `zip_city`, `boroname`, `nta_name`, `latitude`, `longitude`


---
# Part 1: Warmup quiz

In the google form, fill in your name, epita email and start by answering the warmup questions


The google form is available at

> [https://forms.gle/S8f2qgFdYcon23c99](https://forms.gle/S8f2qgFdYcon23c99)


---
# 2. Explore the dataset

For each of the following questions you must
store the output of any query into its own table

```sql
CREATE TABLE <target_table> AS
<your query>
```

replace `<target_table>` by the target table name indicated in the question.

## 2.1 Most common trees

- **question**: What are the top 10 trees by count grouped by common name `spc_common` ?
- **target_table**: `most_common_trees`
- **Expected columns**: `number_trees` , `spc_common`
- **order by**: `number_trees` desc


## 2.2 Trees with shoes in branches

- **question** : how many trees have shoes in their branches ?
- **target table** : `trees_with_shoes_in_branches`
- **Expected columns**: `number_trees`, 1 row

## 2.3 count trees by status and health and both

- **question**: number of trees by status and health
- **target table** : `trees_by_status_and_health`
- **Expected columns**: `number_trees`, `status`, `health`
- **order by**: `status`, `health`


## 2.4 columns with `null` values

The following columns have null values : `problems`, `spc_common`, `spc_latin` and `health`

- Write a query that returns the `tree_id` of trees that have a `null` value in either one of these columns
- **target table**: `trees_with_null_values`
- **Expected columns**: `tree_id`

Go further for your own sake: to understand the data better, check out the status of the trees that are in this `trees_with_null_values` table.


## 2.5 tree Dimensions

- **question** : min, max, 90th percentile, avg for tree_dbh by status. Round avg and percentile by 2
- **target table** : `dimensions_by_status`
- **Expected columns**: `status`, `status`, `min`, `max`, `round`, `percentile_90`

hint:
- you have to cast the output of the percentile as `numeric` in order to apply ROUND
- check out the [PERCENTILE_CONT function](https://www.postgresql.org/docs/current/functions-aggregate.html)

```sql
percentile_cont ( fraction  ) WITHIN GROUP ( ORDER BY <column name> )
```


## 2.6 trees with problems

Find trees that have the most problems : where one of the `root`, `trunk` or `branch` problems is 'Yes'.

Note: This is not about the `problems` column, just the 'Yes', 'No' columns : `root_...`, `trunk_...`, `branch_...`.

Attention one of the trunk related column is named `trunk_wire` while the other trunk related columns are named `trnk_light` and `trnk_other`, no `u`.

- **target_table**: `trees_with_problems`
- **expected columns**: The `trees_with_problems` table should have the following columns : `tree_id`, `yes_count`

The strategy to build the query is to use a CTE with a first clause (`yes_values`) and a main clause

in the `yes_values` clause

- use `case` to transform the string 'Yes' into 1 and 'No' into 0 : `CASE WHEN root_stone = 'Yes' THEN 1 ELSE 0 END`
- alias the result as a new column  `AS root_stone_yes`

then in the main clause just sum up all the alias columns


Check your results, the top 5 trees with the most problems are :

```bash
 tree_id | yes_count
---------+-----------
   27108 |         6
   76743 |         6
  125230 |         6
  300525 |         6
  331004 |         6
```


## 2.7 tree names

Each tree has a common name `spc_common`  and a latin name `spc_latin`.

We want to know if there is a 1-to-1 equivalence between the common name and the latin name ?

This query returns number of latin names per common name where the count is greater than 1.

```sql
SELECT COUNT(DISTINCT spc_latin) AS _count, spc_common as spc
FROM trees
GROUP BY spc_common
HAVING COUNT(DISTINCT spc_latin) > 1
```

Using `UNION`, add the case where you count the number of common names for each latin name.

If the mapping is one-to-one, this query should return no results. Any rows returned indicate violations of the 1:1 mapping.

- **target table** : `tree_name_multiples`
- **expected columns** : `_count`, `spc`

---
# Backup
This is the end of section two: **Exploration**.

Before moving on to the next part, backup your database as plain sql. and upload it in the google form.


**Important:** Name the sql file with your name following this `trees_{first_name}_{last_name}_1.sql`
- replace `{first_name}` and `{last_name}` with your frst and last name.
- no spaces
- all lowercase
- version
- `.sql` extension



---
# Part 3: improving the table

## 3.1 Primary key
The current primary key is `tree_id`, it is not sequential.

`select tree_id from tree order by tree_id limit 10` shows that the primary key is not sequential.

You're going to create a new sequential primary key instead.

In this section you should use the `ALTER TABLE` command to modify the table followed by `ADD` (column, primary key) or `DROP` (primary key, column).

- first, create a new column called `id` with data type `serial`


- then, drop the primary key index
    - inspect the table with `\d trees` to find the name of the primary key index (there should be only one index on the table.)


- finally, add the primary key constraint on the new column


This way, we keep the original `tree_id` as a column but use `id` as the primary key.

Check that the sequence `trees_id_seq` has been created.


## 3.2 `Yes`, `No` columns into booleans

The columns related to tree problems are strings with values 'Yes' or 'No'. This is not very SQL friendly.

- For each of the 9 columns related to tree problems, create a new boolean column. for instance: `root_stone` -> `root_stone_bool`.
- these boolean cols should be `False` by default
- Then populate the new columns by setting to true for all rows where the corresponding string column equals ‘Yes’:


## 3.3 trees with problems

Note that casting a boolean to int will transform it to 1 or 0. TRUE becomes 1, FALSE becomes 0.

```sql
select tree_id, root_stone_bool::int from trees;
```

Rewrite the query from question 2.6 to count the number of problems per trees using the new boolean columns

- **target_table** : trees_with_problems_bool
- **expected columns** : `tree_id`, `problem_count`
- **order by**: `problem_count`, `tree_id`


## 3.4 Central Park

**Central Park latitude and longitude bounds:**

- latitude
  - North: 40.8019
  - South: 40.7829
- longitude
  - East: -73.9485
  - West: -73.9730

Assume Central Park is a rectangle. We want to extract all the trees in Central Park into a separate table.

- **target_table** : trees_in_central_park
- **expected columns** : `tree_id`, `latitude`, `longitude`


> check your results: 8.6% of manhattan trees are in Central park.

## 3.5 Plant a tree

Plant a new tree in the middle of Central Park

Use the following values:

- `status`: Alive
- `problems`: null;
- `zipcode`: 83
- `zip_city`: Central Park
- `boroname`: Manhattan
- `nta_name`: Upper West Side
- `stump_diam`: 0
- The tree_id for the new tree should be `(SELECT MAX(tree_id) FROM trees) + 1`

for all the other values, we use the most common value for categorical columns, and the average value for dimensions.

Create a CTE named `central_park_stats` that:
- Filters to only Central Park trees (use the trees_in_central_park table from Part 2.3)
- Calculates: average `tree_dbh` (rounded), most common `spc_latin`, most common `spc_common`, most common `user_type`
- Uses `MODE() WITHIN GROUP (ORDER BY column)` to find the most common categorical values

Then in the main query: Use `INSERT INTO…SELECT` to insert one record from the CTE result.

> If you struggle with writing the full CTE, manually look up the most common values and use these values directly into the INSERT clause

---

# Backup
This is the end of section three: **Improve the database**.

Before moving on to the next part, backup your database as plain sql and upload it in the google form.


**Important:** Name the sql file with your name following this `trees_{first_name}_{last_name}_2.sql`
- replace `{first_name}` and `{last_name}` with your first and last name.
- no spaces
- all lowercase
- version
- `.sql` extension



# Part 4: Functions & Normalization

Make sure to use proper variable prefixes for all your functions

- Input parameters: `p_` prefix
- Local/internal variables: `v_` prefix
- Output/return variables: `out_` prefix (for OUT parameters)


## 4.1 inches to cm SQL

Write a simple sql function `inches_to_cm` that converts  inches to cm, round to 1 decimal.

- Input: inches NUMERIC
- Output: (centimeters) NUMERIC

> one inch = 2.54 centimeters

> **Attention: copy paste the function in the last part of the google form**


## 4.2 Dimensions with Pg/Plsql function

Write a function `tree_description` that takes a tree `id` (not `tree_id`) as input

and returns

- if the tree is a stump: "Stump tree, stump has X cm of stump diameter"
- if the tree is not a stump: "{Status} tree, tree has X cm of height"

So:
- For a stump, you should see  _"A stump of X cm of diameter"_.
- For a tree that is alive, you should see _"Alive tree, tree has X cm of height"_.
- For a tree that is dead, you should see _"Dead tree, tree has X cm of height"_.

> **Attention: copy paste the function in the last part of the google form**

You can check that your function works with the following examples:

```sql
select tree_description(6650);
           tree_description
--------------------------------------
 Dead tree, tree has 5.1 cm of height
 ```

```sql
select tree_description(371966);
        tree_description
----------------------------------------
Alive tree, tree has 10.2 cm of height
```

## 4.3 Unique tree problems

Normalize problems into a single table

- **target_table** : tree_problems
- expected columns : `problem`

The `problems` columns is a list of comma separated values. This is a good candidate for normalization.

Since trees can have many problems and a set of problem can be relevant for many trees, the problems <-> trees relation is a many-to-many relations. We would therefore need a many-to-many join table to fully normalize the database. **In this exercise, you only create the table of unique problems.**

The task is to : write a query that returns the unique values of all comma separated problems

Start by splitting  the problem into 2 CTEs.

- The 1st CTE uses `STRING_TO_ARRAY` to split the `problems` into an array.
- The 2nd CTE uses `UNNEST` to `unnest` the array into a table.

The final query uses `SELECT DISTINCT` to return the unique values.


The resulting table should only have 10 different problems.

# Backup
This is the end of section four: **Functions and normalization**.

Backup your database as plain sql and upload it in the google form.


**Important:** Name the sql file with your name following this `trees_{first_name}_{last_name}_3.sql`
- replace `{first_name}` and `{last_name}` with your first and last name.
- no spaces
- all lowercase
- version
- `.sql` extension


You're all set!

Thank you