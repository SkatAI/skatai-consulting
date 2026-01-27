---
layout: prose
title: "The New York Trees census dataset - Exam"
page_title: "The New York Trees census dataset - Exam"
summary: "census of all the trees in Manhattan"
slides_project_home: /dbsql/
footer: 'Alexis Perrier - Skatai.com - relational databases - The New York Trees census dataset - Exam'
---

## Exam Overview

You will be working with the New York trees dataset, which contains a census of 65,423 trees in Manhattan. This exam tests your ability to query, analyze, and optimize a PostgreSQL database using intermediate SQL techniques.

**Duration:** 2 hours (submissions close at 12h00 - no late submissions)

**Format:** All queries must be submitted through the Google Form along with a database backup file.

---

## Database Setup

### Restoring the Database

If you have not already loaded the dataset, restore it using the SQL file available at: [https://skatai.com/assets/db/new_york_trees.sql](/assets/db/new_york_trees.sql)

In your psql session, run:

```sql
\i <path to the sql file>/new_york_trees.sql
```

This creates:
- The `new_york_trees` database
- The `trees` table containing 65,423 tree records

### Database Schema

| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| tree_id | INTEGER | PRIMARY KEY |
| block_id | INTEGER | Identifier linking each tree to its mapped block |
| created_at | DATE | Date the tree census data was collected |
| tree_dbh | INTEGER | Tree diameter at breast height (~54"/137cm above ground, in inches) |
| stump_diam | INTEGER | Stump diameter measured through center, in inches |
| status | STRING | Tree status: 'Alive', 'Dead', or 'Stump' |
| health | STRING | Perceived health of tree |
| spc_latin | STRING | Scientific species name (e.g., "Acer rubrum") |
| spc_common | STRING | Common species name (e.g., "red maple") |
| user_type | STRING | Category of data collector |
| problems | STRING | Comma-separated list of tree problems |
| root_stone | STRING | Root problem from paving stones ('Yes'/'No') |
| root_grate | STRING | Root problem from metal grates ('Yes'/'No') |
| root_other | STRING | Other root problems ('Yes'/'No') |
| trunk_wire | STRING | Trunk problem from wires/rope ('Yes'/'No') |
| trnk_light | STRING | Trunk problem from installed lighting ('Yes'/'No') |
| trnk_other | STRING | Other trunk problems ('Yes'/'No') |
| brch_light | STRING | Branch problem from lights/wires ('Yes'/'No') |
| brch_shoe | STRING | Branch problem from sneakers ('Yes'/'No') |
| brch_other | STRING | Other branch problems ('Yes'/'No') |
| address | STRING | Nearest estimated address |
| zipcode | INTEGER | Five-digit zipcode |
| zip_city | STRING | City derived from zipcode |
| boroname | STRING | Borough name |
| nta_name | STRING | Neighborhood Tabulation Area (from 2010 US Census) |
| latitude | FLOAT | Decimal latitude |
| longitude | FLOAT | Decimal longitude |

### Key Column Groups

- **Dimensions:** `tree_dbh`, `stump_diam`
- **Health:** `health`, `status`
- **User Data:** `user_type`
- **Species:** `spc_common`, `spc_latin`
- **Problems:** `problems` (general), `root_*` (root problems), `trnk_*` (trunk problems), `brch_*` (branch problems)
- **Location:** `address`, `zipcode`, `zip_city`, `boroname`, `nta_name`, `latitude`, `longitude`

---

## Important Instructions

### Submitting Your Work

**Query Storage:** Every SELECT query must be saved into a temporary table using the following syntax:

```sql
SELECT <columns>
INTO <target_table_name>
FROM trees;
```

Each question specifies the exact target table name. For example:

```sql
-- Question: Count trees per neighborhood
-- Target table: nta_tree_count
SELECT nta_name, COUNT(*) AS tree_count
INTO nta_tree_count
FROM trees
GROUP BY nta_name;
```

After each query, verify the table was created:
```sql
\d nta_tree_count
```

### Working Environment

- Use a **psql session** (not pgAdmin query window) for best results
- Make regular backups of your database after each section
- To backup, use: `pg_dump -U username -d new_york_trees > backup.sql`
- Upload your final database backup and all queries to the Google Form

---

# PART 1: Explore the Dataset

This section focuses on basic querying and data exploration.

## 1.1 Most Common Trees

**Objective:** Identify the top 10 most frequently occurring tree species.

**Question:** What are the top 10 tree species by count, ordered by common name?

**Target table:** `most_common_trees`

**Expected columns:** `spc_common`, `count` (or similar naming)

**Hint:** Use GROUP BY with COUNT(*), ORDER BY DESC, and LIMIT 10.

---

## 1.2 Trees with Shoe Problems

**Objective:** Quantify trees affected by a specific, unusual problem.

**Question:** How many trees have shoes in their branches (where `brch_shoe` indicates 'Yes')?

**Target table:** `trees_with_shoes_in_branches`

**Expected columns:** A single count value or tree_id listing

**Hint:** Use COUNT(*) and filter on the `brch_shoe` column.

---

## 1.3 Trees Grouped by Status and Health

**Objective:** Create a crosstab summary of tree conditions.

**Question:** How many trees exist for each combination of status and health?

**Target table:** `trees_by_status_and_health`

**Expected columns:** `status`, `health`, `count`

**Solution:**
```sql
SELECT status, health, COUNT(*) AS tree_count
INTO trees_by_status_and_health
FROM trees
GROUP BY status, health;
```

---

## 1.4 Trees with Null Values

**Objective:** Identify incomplete data records.

**Question:** Which trees have null values in any of the following columns: `problems`, `spc_common`, `spc_latin`, or `health`?

**Target table:** `trees_with_null_values`

**Expected columns:** `tree_id`

**Instructions:**
1. Find all tree_id values where at least one of the four columns is NULL
2. Save the result to your target table
3. Then verify: Of the trees with null values, how many have status = 'Alive'?

**Hint:** Use the OR operator to combine multiple IS NULL conditions.

**Solution:**
```sql
SELECT tree_id
INTO trees_with_null_values
FROM trees
WHERE problems IS NULL
   OR spc_common IS NULL
   OR spc_latin IS NULL
   OR health IS NULL;
```

**Follow-up:** Create a quick query to count alive trees in this set:
```sql
SELECT COUNT(DISTINCT t.tree_id) AS alive_with_nulls
FROM trees t
JOIN trees_with_null_values tn ON t.tree_id = tn.tree_id
WHERE t.status = 'Alive';
```

---

## 1.5 Dimensions Analysis by Status

**Objective:** Calculate statistical metrics for tree physical dimensions, stratified by tree status.

**Question:** For each tree status, calculate the minimum, maximum, average, and 90th percentile of tree diameter (`tree_dbh`) and stump diameter (`stump_diam`). Round averages and percentiles to 2 decimal places.

**Target table:** `dimensions_by_status`

**Expected columns:** `status`, `min_dbh`, `max_dbh`, `avg_dbh`, `percentile_90_dbh`, `min_stump`, `max_stump`, `avg_stump`, `percentile_90_stump`

**Difficulty:** Intermediate

**Instructions:**
- Filter out rows where `status` is NULL
- Use `PERCENTILE_CONT()` for calculating the 90th percentile
- Cast percentile results to `numeric` before rounding
- Use `ROUND(value, 2)` to format numerical output

**Key PostgreSQL Functions:**
- `PERCENTILE_CONT(fraction) WITHIN GROUP (ORDER BY column_name)` - calculates continuous percentile
- `::numeric` - casting operator to convert to numeric type
- `ROUND(value, decimals)` - rounds to specified decimal places

**Hint:** You will need two similar PERCENTILE_CONT() calls in your query. Avoid writing the formula twice by carefully structuring your SELECT clause.

**Solution:**
```sql
SELECT
  status,
  MIN(tree_dbh) AS min_dbh,
  MAX(tree_dbh) AS max_dbh,
  ROUND(AVG(tree_dbh)::numeric, 2) AS avg_dbh,
  ROUND(PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY tree_dbh)::numeric, 2) AS percentile_90_dbh,
  MIN(stump_diam) AS min_stump,
  MAX(stump_diam) AS max_stump,
  ROUND(AVG(stump_diam)::numeric, 2) AS avg_stump,
  ROUND(PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY stump_diam)::numeric, 2) AS percentile_90_stump
INTO dimensions_by_status
FROM trees
WHERE status IS NOT NULL
GROUP BY status;
```

---

## 1.6 Trees with Problems (Using CTE)

**Objective:** Identify and rank trees by the number of problems they have.

**Question:** Create a list of all trees showing how many problems each tree has. Problems are identified by counting occurrences of 'Yes' in the following columns: `root_stone`, `root_grate`, `root_other`, `trunk_wire`, `trnk_light`, `trnk_other`, `brch_light`, `brch_shoe`, `brch_other`. Sort by problem count descending.

**Target table:** `trees_with_problems`

**Expected columns:** `tree_id`, `problem_count`

**Difficulty:** Intermediate (CTE + CASE statements)

**Strategy:**
1. **Step 1 - Create CTE:** Build a Common Table Expression (CTE) with a temporary named relation that converts each 'Yes'/'No' value to 1/0
2. **Step 2 - Aggregate:** In the main query, sum all the converted values to get problem_count
3. **Step 3 - Sort:** Order by problem_count in descending order

**Why use a CTE?** CTEs improve readability and allow intermediate results to be tested and debugged separately.

**Key Concept - CASE Statements:** Convert text values to numeric:
```sql
CASE WHEN column_name = 'Yes' THEN 1 ELSE 0 END AS column_name_yes
```

**Hint:** Your CTE should have 9 CASE statements (one for each problem column). The main query should sum all 9.

**Solution:**
```sql
WITH yes_values AS (
  SELECT
    tree_id,
    CASE WHEN root_stone = 'Yes' THEN 1 ELSE 0 END AS root_stone_yes,
    CASE WHEN root_grate = 'Yes' THEN 1 ELSE 0 END AS root_grate_yes,
    CASE WHEN root_other = 'Yes' THEN 1 ELSE 0 END AS root_other_yes,
    CASE WHEN trunk_wire = 'Yes' THEN 1 ELSE 0 END AS trunk_wire_yes,
    CASE WHEN trnk_light = 'Yes' THEN 1 ELSE 0 END AS trnk_light_yes,
    CASE WHEN trnk_other = 'Yes' THEN 1 ELSE 0 END AS trnk_other_yes,
    CASE WHEN brch_light = 'Yes' THEN 1 ELSE 0 END AS brch_light_yes,
    CASE WHEN brch_shoe = 'Yes' THEN 1 ELSE 0 END AS brch_shoe_yes,
    CASE WHEN brch_other = 'Yes' THEN 1 ELSE 0 END AS brch_other_yes
  FROM trees
)
SELECT
  tree_id,
  root_stone_yes + root_grate_yes + root_other_yes +
  trunk_wire_yes + trnk_light_yes + trnk_other_yes +
  brch_light_yes + brch_shoe_yes + brch_other_yes AS problem_count
INTO trees_with_problems
FROM yes_values
ORDER BY problem_count DESC;
```

---

# PART 2: Improve the Schema

This section focuses on schema optimization through data type conversion and index creation.

## 2.1 Add Boolean Columns

**Objective:** Convert string-based Yes/No data to proper boolean columns for storage efficiency and query performance.

**Question:** Add 9 new boolean columns to the `trees` table to replace string-based problem indicators.

**Instructions:**

1. Add the following columns with default value `false`:
   - `root_stone_bool`
   - `root_grate_bool`
   - `root_other_bool`
   - `trunk_wire_bool`
   - `trnk_light_bool`
   - `trnk_other_bool`
   - `brch_light_bool`
   - `brch_shoe_bool`
   - `brch_other_bool`

**SQL to add columns:**
```sql
ALTER TABLE trees ADD COLUMN root_stone_bool BOOLEAN DEFAULT false;
ALTER TABLE trees ADD COLUMN root_grate_bool BOOLEAN DEFAULT false;
ALTER TABLE trees ADD COLUMN root_other_bool BOOLEAN DEFAULT false;
ALTER TABLE trees ADD COLUMN trunk_wire_bool BOOLEAN DEFAULT false;
ALTER TABLE trees ADD COLUMN trnk_light_bool BOOLEAN DEFAULT false;
ALTER TABLE trees ADD COLUMN trnk_other_bool BOOLEAN DEFAULT false;
ALTER TABLE trees ADD COLUMN brch_light_bool BOOLEAN DEFAULT false;
ALTER TABLE trees ADD COLUMN brch_shoe_bool BOOLEAN DEFAULT false;
ALTER TABLE trees ADD COLUMN brch_other_bool BOOLEAN DEFAULT false;
```

2. **Populate the new columns** by setting to `true` for all rows where the corresponding string column equals 'Yes':

```sql
UPDATE trees SET root_stone_bool = true WHERE root_stone = 'Yes';
UPDATE trees SET root_grate_bool = true WHERE root_grate = 'Yes';
UPDATE trees SET root_other_bool = true WHERE root_other = 'Yes';
UPDATE trees SET trunk_wire_bool = true WHERE trunk_wire = 'Yes';
UPDATE trees SET trnk_light_bool = true WHERE trnk_light = 'Yes';
UPDATE trees SET trnk_other_bool = true WHERE trnk_other = 'Yes';
UPDATE trees SET brch_light_bool = true WHERE brch_light = 'Yes';
UPDATE trees SET brch_shoe_bool = true WHERE brch_shoe = 'Yes';
UPDATE trees SET brch_other_bool = true WHERE brch_other = 'Yes';
```

3. **Verify** the data was properly migrated by checking a sample:
```sql
SELECT tree_id, root_stone, root_stone_bool FROM trees LIMIT 5;
```

---

## 2.2 Trees with Problems (Optimized with Booleans)

**Objective:** Recalculate tree problems using the new boolean columns.

**Question:** Recreate the trees with problems query using the new boolean columns. Note that boolean values cast to integers: TRUE → 1, FALSE → 0.

**Target table:** `trees_with_problems_bool`

**Expected columns:** `tree_id`, `problem_count`

**Key Concept - Boolean Casting:** In PostgreSQL, you can cast boolean to integer using `::int`:
```sql
root_stone_bool::int  -- Returns 1 for TRUE, 0 for FALSE
```

**Advantage:** This eliminates the need for a CTE with CASE statements.

**Hint:** Your query will be significantly simpler than the CTE version. Add all 9 boolean columns cast to integers.

**Solution:**
```sql
SELECT
  tree_id,
  root_stone_bool::int + root_grate_bool::int + root_other_bool::int +
  trunk_wire_bool::int + trnk_light_bool::int + trnk_other_bool::int +
  brch_light_bool::int + brch_shoe_bool::int + brch_other_bool::int AS problem_count
INTO trees_with_problems_bool
FROM trees
ORDER BY problem_count DESC;
```

---

## 2.3 Central Park Boundary Query

**Objective:** Use geographic bounding to filter relevant data.

**Question:** Find all trees located within Central Park using the following approximate boundaries.

**Central Park Geographic Bounds:**
- North latitude: 40.8019
- South latitude: 40.7829
- East longitude: -73.9485
- West longitude: -73.9730

**Target table:** `trees_in_central_park`

**Expected columns:** `tree_id`, `latitude`, `longitude`

**Instructions:** Assume Central Park is a rectangle and select all trees falling within these bounds.

**Hint:** Use BETWEEN for latitude and longitude ranges. Note that western longitudes are negative.

**Note:** Central Park contains approximately 8.6% of Manhattan's trees.

**Solution:**
```sql
SELECT tree_id, latitude, longitude
INTO trees_in_central_park
FROM trees
WHERE latitude BETWEEN 40.7829 AND 40.8019
  AND longitude BETWEEN -73.9730 AND -73.9485;
```

---

# PART 3: Data Normalization

This section covers advanced SQL techniques including window functions, advanced aggregation, and database design patterns.

## 3.1 Plant a Tree (Advanced: CTE + Window Functions + INSERT)

**Objective:** Use aggregation and window functions to calculate statistics, then insert a synthetic record.

**Question:** Plant a new tree in Central Park with average and most common attributes based on existing Central Park trees. Use the following specifications:
- Status: 'Alive'
- Health: 'Good'
- Problems: NULL (no problems)
- Location: Central Park center (40.7915, -73.9608)
- Neighborhood: Upper West Side
- Zipcode: 10024

**Target:** Insert one new row into the `trees` table

**Expected values for the new tree:**
- `tree_id`: MAX(tree_id) + 1
- `latitude` / `longitude`: 40.7915, -73.9608
- `tree_dbh`: Rounded average of Central Park trees
- `spc_latin` & `spc_common`: Most common species
- `user_type`: Most common collector type
- Other fields: As specified above

**Difficulty:** Advanced (CTE + window functions + data aggregation)

**Strategy:**
1. **Create a CTE** named `central_park_stats` that:
   - Filters to only Central Park trees (use the `trees_in_central_park` table from Part 2.3)
   - Calculates: average `tree_dbh` (rounded), most common `spc_latin`, most common `spc_common`, most common `user_type`
   - Uses `MODE() WITHIN GROUP (ORDER BY column)` to find the most common categorical values

2. **In the main query:** Use INSERT INTO...SELECT to insert one record from the CTE

**Key PostgreSQL Function:**
`MODE() WITHIN GROUP (ORDER BY column)` - Returns the most frequent value (statistical mode). If there's a tie, it returns the first value encountered.

**Hints:**
- The tree_id for the new tree should be `(SELECT MAX(tree_id) FROM trees) + 1`
- Reference `trees_in_central_park` from section 2.3 in your WHERE clause
- You can use a simple SELECT subquery to get the next tree_id
- If you struggle with the full CTE, manually look up the most common values and INSERT them directly

**Solution:**
```sql
WITH central_park_stats AS (
  SELECT
    ROUND(AVG(t.tree_dbh)) AS avg_tree_dbh,
    MODE() WITHIN GROUP (ORDER BY t.spc_latin) AS common_spc_latin,
    MODE() WITHIN GROUP (ORDER BY t.spc_common) AS common_spc_common,
    MODE() WITHIN GROUP (ORDER BY t.user_type) AS common_user_type
  FROM trees t
  WHERE t.tree_id IN (SELECT tree_id FROM trees_in_central_park)
)
INSERT INTO trees (
  tree_id, latitude, longitude, tree_dbh, status, health,
  spc_latin, spc_common, user_type, problems,
  zipcode, zip_city, boroname, nta_name
)
SELECT
  (SELECT MAX(tree_id) + 1 FROM trees),
  40.7915,
  -73.9608,
  avg_tree_dbh,
  'Alive',
  'Good',
  common_spc_latin,
  common_spc_common,
  common_user_type,
  NULL,
  '10024',
  'Manhattan',
  'Manhattan',
  'Upper West Side'
FROM central_park_stats;
```

**Verification:** Query the new tree to confirm insertion:
```sql
SELECT tree_id, spc_common, tree_dbh, latitude, longitude FROM trees WHERE latitude = 40.7915;
```

---

## 3.2 Create a View for Common Tree Species

**Objective:** Encapsulate query logic in a reusable view.

**Question:** Create a view named `v_species_summary` that shows, for each common species name:
- Species name (`spc_common`)
- Count of trees for that species
- Average diameter (`avg_dbh`)
- Average health rating (if numeric, or count per health category)

**Expected View Columns:** `spc_common`, `tree_count`, `avg_dbh`

**Instructions:**
```sql
CREATE OR REPLACE VIEW v_species_summary AS
SELECT
  spc_common,
  COUNT(*) AS tree_count,
  ROUND(AVG(tree_dbh)::numeric, 2) AS avg_dbh
FROM trees
WHERE spc_common IS NOT NULL
GROUP BY spc_common
ORDER BY tree_count DESC;
```

**Verification:**
```sql
SELECT * FROM v_species_summary LIMIT 10;
```

---

# PART 4: Functions

This section focuses on writing reusable SQL and PL/pgSQL functions.

## 4.1 SQL Function: Inches to Centimeters Conversion

**Objective:** Create a simple scalar function.

**Question:** Write a SQL function that converts inches to centimeters. Round the result to 1 decimal place. (1 inch = 2.54 cm)

**Function name:** `inches_to_cm`

**Input parameter:** `inches` (NUMERIC type)

**Returns:** NUMERIC type

**Solution:**
```sql
CREATE OR REPLACE FUNCTION inches_to_cm(inches NUMERIC)
RETURNS NUMERIC AS $$
  SELECT ROUND(inches * 2.54, 1);
$$ LANGUAGE SQL;
```

**Testing:**
```sql
SELECT inches_to_cm(10);     -- Should return 25.4
SELECT inches_to_cm(50);     -- Should return 127.0
```

---

## 4.2 PL/pgSQL Function: Tree Description

**Objective:** Write a conditional PL/pgSQL function that generates descriptive text.

**Question:** Write a function that takes a `tree_id` as input and returns a descriptive text string about the tree. The function should:
- For stump trees: return "Stump tree, stump has X cm of stump diameter"
- For other trees: return "{Status} tree, tree has X cm of height"
- Convert measurements from inches to centimeters (using your `inches_to_cm` function)
- Round to 1 decimal place

**Function name:** `tree_description`

**Input parameter:** `tree_id_input` (INTEGER type)

**Returns:** TEXT type

**Difficulty:** Intermediate (PL/pgSQL + conditional logic + type casting)

**Instructions:**
- Use PL/pgSQL language (not SQL)
- Use a CASE statement to handle different status values
- Query the trees table to get tree details
- Use your `inches_to_cm` function for unit conversion
- Remember to prefix input variables and internal variables appropriately

**Example calls and expected outputs:**
```sql
SELECT tree_description(6650);
-- Output: "Dead tree, tree has 5.1 cm of height"

SELECT tree_description(371966);
-- Output: "Alive tree, tree has 10.2 cm of height"

SELECT tree_description(1);  -- Assuming this is a stump
-- Output: "Stump tree, stump has X.X cm of stump diameter"
```

**Hint:** You can call one SQL function from within a PL/pgSQL function. Use:
```sql
SELECT inches_to_cm(tree_dbh) INTO variable_name FROM ...
```

**Solution:**
```sql
CREATE OR REPLACE FUNCTION tree_description(tree_id_input INT)
RETURNS TEXT AS $$
DECLARE
  v_status TEXT;
  v_tree_dbh INTEGER;
  v_stump_diam INTEGER;
  v_result TEXT;
BEGIN
  SELECT status, tree_dbh, stump_diam INTO v_status, v_tree_dbh, v_stump_diam
  FROM trees
  WHERE tree_id = tree_id_input;

  IF v_status = 'Stump' THEN
    v_result := 'Stump tree, stump has ' || ROUND(inches_to_cm(v_stump_diam)::numeric, 1) || ' cm of stump diameter';
  ELSE
    v_result := v_status || ' tree, tree has ' || ROUND(inches_to_cm(v_tree_dbh)::numeric, 1) || ' cm of height';
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;
```

---

## 4.3 Function: Find Trees with Specific Problem

**Objective:** Create a function that finds trees with a given problem.

**Question:** Write a function that takes a problem name as input and returns all tree_ids that have this specific problem. The `problems` column contains comma-separated values, so you'll need to parse them.

**Function name:** `get_trees_with_problem`

**Input parameter:** `problem_item` (TEXT type)

**Returns:** TABLE with column `id` (INTEGER)

**Difficulty:** Intermediate (PL/pgSQL + string parsing + RETURN QUERY)

**Key PostgreSQL Functions:**
- `STRING_TO_ARRAY(string, delimiter)` - Splits a string into an array
- `ANY(array)` - Array membership operator
- `RETURN QUERY` - Returns multiple rows from a query result

**Strategy:**
1. Split the `problems` string into an array using comma delimiter
2. Check if the input problem is in the array using the `ANY` operator
3. Return all matching tree_ids

**Solution:**
```sql
CREATE OR REPLACE FUNCTION get_trees_with_problem(problem_item TEXT)
RETURNS TABLE(id INT) AS $$
BEGIN
  RETURN QUERY
  SELECT trees.tree_id
  FROM trees
  WHERE problems IS NOT NULL
    AND problem_item = ANY(STRING_TO_ARRAY(problems, ','));
END;
$$ LANGUAGE plpgsql;
```

**Testing:**
```sql
-- First, see what problems exist:
SELECT DISTINCT item
FROM (
  SELECT STRING_TO_ARRAY(problems, ',') AS problem_array
  FROM trees
  WHERE problems IS NOT NULL
), UNNEST(problem_array) AS item
ORDER BY item;

-- Then query:
SELECT COUNT(*) FROM get_trees_with_problem('Debris');
```

---

# PART 5: Query Performance & Optimization

This section focuses on index creation and query plan analysis.

## 5.1 Query Plan Analysis - Before Indexing

**Objective:** Understand and interpret EXPLAIN output.

**Question:** Run the following query and capture the execution plan using EXPLAIN:

```sql
SELECT tree_id, spc_common, spc_latin, health, status
FROM trees
WHERE nta_name = 'Manhattanville';
```

**Instructions:**
1. Run `EXPLAIN (FORMAT JSON)` to get a detailed, machine-readable plan (or use default format)
2. Document what you observe:
   - What is the query doing? (Seq Scan, Bitmap Scan, etc.)
   - How many rows does it estimate vs. actual?
   - What is the estimated cost?

**Note:** Without an index, PostgreSQL performs a **Sequential Scan**, reading every row.

**Example EXPLAIN output (without index):**
```
Seq Scan on trees  (cost=0.00..1850.75 rows=903 width=47)
  Filter: ((nta_name)::text = 'Manhattanville'::text)
```

---

## 5.2 Create an Index on nta_name

**Objective:** Optimize queries that filter by neighborhood.

**Question:** Create a B-tree index on the `nta_name` column:

```sql
CREATE INDEX idx_trees_nta_name ON trees(nta_name);
```

---

## 5.3 Query Plan Analysis - After Indexing

**Objective:** Observe performance improvement from index usage.

**Question:** Run the same query from 5.1 again and capture the new execution plan:

```sql
EXPLAIN SELECT tree_id, spc_common, spc_latin, health, status
FROM trees
WHERE nta_name = 'Manhattanville';
```

**What changed?**
- PostgreSQL now uses a **Bitmap Index Scan** and **Bitmap Heap Scan** instead of Seq Scan
- The estimated cost should be significantly lower
- The query is now much faster

**Example EXPLAIN output (with index):**
```
Bitmap Heap Scan on trees  (cost=11.29..1476.70 rows=903 width=47)
  Recheck Cond: ((nta_name)::text = 'Manhattanville'::text)
  ->  Bitmap Index Scan on idx_trees_nta_name  (cost=0.00..11.06 rows=903 width=0)
        Index Cond: ((nta_name)::text = 'Manhattanville'::text)
```

**Document your observations:**
- Compare the "cost" values from 5.1 and 5.3
- Describe how the query plan changed
- Explain why this index helps (nta_name is frequently used in WHERE clauses)

---

## 5.4 Additional Index Suggestions (Optional)

Consider where else indexes might help. The following columns are candidates for indexing based on their use in queries:

**High-cardinality columns with frequent equality lookups:**
- `tree_id` (PRIMARY KEY - already indexed)
- `zipcode` (frequently filtered)
- `boroname` (frequently filtered)
- `spc_common` (frequently grouped/filtered)
- `status` (frequently filtered)

**Question (Optional):** Create one additional index on a column you think is frequently queried. Justify your choice.

---

## Submission Checklist

Before submitting, ensure:

- [ ] All queries from Parts 1-4 are saved in target tables with correct names
- [ ] All functions are created and tested
- [ ] Database backup created with `pg_dump` and saved as `.sql` file
- [ ] All answers to conceptual questions are documented
- [ ] EXPLAIN outputs from Part 5 are captured and documented
- [ ] Verified all target tables exist: `\d target_table_name`

---

## Tips for Success

1. **Test incrementally:** After each query, verify the results make sense
2. **Use temporary tables:** Don't try to do everything in one query
3. **Debug your CTEs:** Test each part of a CTE independently before combining
4. **Read error messages carefully:** They often point directly to the issue
5. **Format your queries:** Use proper indentation and clear aliases for readability
6. **Make backups:** After each major section, backup your database
7. **Document your work:** Add comments explaining complex logic

---

## Helpful PostgreSQL Resources

- [PostgreSQL Documentation - Aggregation Functions](https://www.postgresql.org/docs/current/functions-aggregate.html)
- [PostgreSQL Documentation - Window Functions](https://www.postgresql.org/docs/current/functions-window.html)
- [PostgreSQL Documentation - EXPLAIN](https://www.postgresql.org/docs/current/sql-explain.html)
- [PostgreSQL Documentation - PL/pgSQL](https://www.postgresql.org/docs/current/plpgsql.html)