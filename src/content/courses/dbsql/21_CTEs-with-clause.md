---
layout: prose
title: "Postgresql CTEs"
page_title: "Postgresql CTEs"
summary: "CTEs"
footer: 'Alexis Perrier - alexisperrier.com/dbsql/  '
---

# Common Table Expressions (CTEs)

CTE stands for **Common Table Expression**.

A CTE is a style of SQL query, a **pattern**, that **simplifies the query**, instead of using subqueries.

The idea is to name the temporary set of results for a subquery to be able to use that set later in the query.

The overall structure follows this query structure:

```sql
WITH subquery_name AS (
    Some query
)
-- add other WITH expressions as needed
-- ...
-- then select, update, insert, etc from the named subqueries
SELECT *
FROM subquery_name
WHERE ...
```



They are essentially **named subqueries** or **auxiliary statements** that can be referenced multiple times within a main query, making complex queries easier to read and manage.

CTEs are useful in scenarios where you want to:

* Break down complex queries into simpler, more manageable parts.
* Refer to a subquery multiple times within a single query.
* Improve query performance by structuring subqueries in a readable way.

and even:

* Handle recursive queries for hierarchical data (such as organizational charts or family trees).


**performance**:  A useful property of `WITH` queries is that they are normally evaluated only once per execution of the parent query, even if they are referred to more than once by the parent query or sibling WITH queries.

Same output but much cleaner code

* It's very DRY: Don't Repeat Yourself
* Makes the final `select` easy to understand

## Advantage of the `WITH` clause:

* More readable, easier to debug
* Avoiding temporary tables: the temp subset is loaded into memory and not saved to disk. Faster.


## Example

Let's start with a simple example where we want to count the number of movies by director.

The following query comes to mind:

```sql
SELECT d.name as director, COUNT(*) as movie_count
FROM movies m
JOIN directors d ON m.director_id = d.id
GROUP BY d.name
ORDER BY movie_count DESC
LIMIT 5;
```

But we can also extract the counting query into its own set of results and select from it:

```sql
WITH director_movie_count AS (
    SELECT d.name as director, COUNT(*) as movie_count
    FROM movies m
    JOIN directors d ON m.director_id = d.id
    GROUP BY d.name
)
SELECT director, movie_count
FROM director_movie_count
ORDER BY movie_count DESC
LIMIT 5;
```

This will output the same result.

The advantage of using the CTE expression in this simple case is not that obvious.

## More Complex CTE

Imagine:

> You're a film investor. A data-driven film investor. You need to understand the movie industry trends so you can decide which directors you want to work with and what types of films you should invest in.

> You're curious about how the ratings and box office performance of movies have changed over the years. This could help you understand if there's a trend towards higher-quality films or if commercial success is diverging from critical acclaim.

Let's take a look at average ratings and gross revenue of movies over the years:

```sql
SELECT
    released_year,
    ROUND(AVG(imdb_rating)::numeric, 2) AS avg_rating,
    ROUND(AVG(gross)::numeric, 0) AS avg_gross
FROM movies
WHERE released_year IS NOT NULL AND gross IS NOT NULL
GROUP BY released_year;
```

You want to reuse these results to see how they evolve year after year. This is a job for the `LAG()` function!

So let's name the above query as `yearly_stats`:

```sql
-- name the data gathering query as: yearly_stats
WITH yearly_stats AS (
    SELECT
        released_year,
        ROUND(AVG(imdb_rating)::numeric, 2) AS avg_rating,
        ROUND(AVG(gross)::numeric, 0) AS avg_gross
    FROM movies
    WHERE released_year IS NOT NULL AND gross IS NOT NULL
    GROUP BY released_year
)
SELECT
    released_year,
    avg_rating,
    avg_gross,
    avg_rating - LAG(avg_rating) OVER (ORDER BY released_year) AS rating_change,
    avg_gross - LAG(avg_gross) OVER (ORDER BY released_year) AS gross_change
-- reuse the yearly_stats results from the named query
FROM yearly_stats
ORDER BY released_year DESC
LIMIT 10;
```

Now we calculate the correlation between the rating_change and gross_change using the previous main query as a named CTE and leveraging the `CORR()` function.

```sql
-- name the data gathering query as: yearly_stats
WITH yearly_stats AS (
    SELECT
        released_year,
        ROUND(AVG(imdb_rating)::numeric, 2) AS avg_rating,
        ROUND(AVG(gross)::numeric, 0) AS avg_gross
    FROM movies
    WHERE released_year IS NOT NULL AND gross IS NOT NULL
    GROUP BY released_year
),
-- Calculate the changes using LAG
yearly_changes AS (
    SELECT
        released_year,
        avg_rating,
        avg_gross,
        avg_rating - LAG(avg_rating) OVER (ORDER BY released_year) AS rating_change,
        avg_gross - LAG(avg_gross) OVER (ORDER BY released_year) AS gross_change
    FROM yearly_stats
)
-- Calculate correlation between rating_change and gross_change
SELECT
    CORR(gross_change, released_year) AS rating_gross_correlation,
    CORR(rating_change, released_year) AS rating_year_correlation,
    CORR(rating_change, gross_change) AS rating_gross_correlation,
    COUNT(*) FILTER (WHERE rating_change IS NOT NULL) AS years_with_changes,
    ROUND(AVG(rating_change)::numeric, 3) AS avg_rating_change,
    ROUND(AVG(gross_change)::numeric, 0) AS avg_gross_change
FROM yearly_changes;
```

all 3 correlations are close to 0. there is no correlation between the rating_change and gross_change or the released year. (movies were not better before :) )


## Director Versatility Across Genres

> Next, you want to identify directors who are versatile in their filmmaking style, as they might be able to adapt to different market demands. You create a **versatility score** based on the number of distinct genres they work in and the variance in their movies' ratings.

This versatility is measured by counting distinct genres and calculating the standard deviation of ratings.

We use the following formula

```
versatility_score = (genre_count × 2) + rating_std
```

Note: this does not make much sense, this is just for the sake off the exercise.

Let's first get the raw data, the stats.

We only keep directors with more than 3 movies so that the statistics make sense.

```sql
-- get the main sets of results
SELECT
    d.name as director,
    COUNT(DISTINCT m.id) AS movie_count,
    COUNT(DISTINCT g.id) AS genre_count,
    ROUND(AVG(m.imdb_rating)::numeric, 2) AS avg_rating,
    ROUND(STDDEV(m.imdb_rating)::numeric, 2) AS rating_std
FROM movies m
JOIN directors d ON m.director_id = d.id
LEFT JOIN movie_genres mg ON m.id = mg.movie_id
LEFT JOIN genres g ON mg.genre_id = g.id
WHERE m.imdb_rating IS NOT NULL
GROUP BY d.name
HAVING COUNT(DISTINCT m.id) >= 4;
```

Then calculate the versatility_score by reusing the above query as a named subquery:

```sql
WITH director_stats AS (
    SELECT
        d.name as director,
        COUNT(DISTINCT m.id) AS movie_count,
        COUNT(DISTINCT g.id) AS genre_count,
        ROUND(AVG(m.imdb_rating)::numeric, 2) AS avg_rating,
        ROUND(STDDEV(m.imdb_rating)::numeric, 2) AS rating_std
    FROM movies m
    JOIN directors d ON m.director_id = d.id
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    WHERE m.imdb_rating IS NOT NULL
    GROUP BY d.name
    HAVING COUNT(DISTINCT m.id) >= 4
)
SELECT
    director,
    movie_count,
    genre_count,
    avg_rating,
    ROUND((genre_count::numeric * 2 + COALESCE(rating_std, 0)), 2) AS versatility_score
FROM director_stats;
```

And finally we order by the `versatility_score` by re-using that last query as a named query `director_versatility`.

The final total query is:

```sql
WITH director_stats AS (
    SELECT
        d.name as director,
        COUNT(DISTINCT m.id) AS movie_count,
        COUNT(DISTINCT g.id) AS genre_count,
        ROUND(AVG(m.imdb_rating)::numeric, 2) AS avg_rating,
        ROUND(STDDEV(m.imdb_rating)::numeric, 2) AS rating_std
    FROM movies m
    JOIN directors d ON m.director_id = d.id
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    WHERE m.imdb_rating IS NOT NULL
    GROUP BY d.name
    HAVING COUNT(DISTINCT m.id) >= 4
),
director_versatility AS (
    SELECT
        director,
        movie_count,
        genre_count,
        avg_rating,
        ROUND((genre_count::numeric * 2 + COALESCE(rating_std, 0)), 2) AS versatility_score
    FROM director_stats
)
SELECT
    director,
    movie_count,
    genre_count,
    avg_rating,
    versatility_score
FROM director_versatility
ORDER BY versatility_score DESC
LIMIT 10;
```

Imagine what you can do now with CTEs and window functions!

### What Does This Query Do?

```sql
WITH director_yearly_stats AS (
    SELECT
        d.name as director,
        m.released_year,
        AVG(m.imdb_rating) AS avg_rating,
        COUNT(*) AS movie_count
    FROM movies m
    JOIN directors d ON m.director_id = d.id
    WHERE m.released_year IS NOT NULL
    GROUP BY d.name, m.released_year
),
director_growth AS (
    SELECT
        director,
        SUM(movie_count) AS total_movies,
        ROUND(MIN(avg_rating)::numeric, 2) AS min_rating,
        ROUND(MAX(avg_rating)::numeric, 2) AS max_rating,
        ROUND((MAX(avg_rating) - MIN(avg_rating))::numeric, 2) AS rating_growth
    FROM director_yearly_stats
    GROUP BY director
    HAVING SUM(movie_count) >= 3 AND COUNT(DISTINCT released_year) >= 2
)
SELECT
    director,
    total_movies,
    min_rating,
    max_rating,
    rating_growth
FROM director_growth
ORDER BY rating_growth DESC
LIMIT 10;
```

This query identifies directors whose quality has improved significantly over time by comparing their lowest and highest average ratings across different years.

### UNION


before moving to MATERIALIZED CTEs, I need to explain `UNION`.

**`UNION`** combines the results of two or more SELECT statements into a single result set.

## UNION vs UNION ALL

| Feature | UNION | UNION ALL |
|---------|-------|-----------|
| **Duplicates** | Removes duplicate rows | Keeps ALL rows (including duplicates) |
| **Performance** | Slower (must check for duplicates) | Faster (no duplicate checking) |
| **Sorting** | Implicitly sorts to find duplicates | No sorting |
| **Use case** | When you need unique rows | When you want all rows or know there are no duplicates |

## Simple Example:

```sql
-- UNION (removes duplicates)
SELECT 'Action' AS genre
UNION
SELECT 'Action' AS genre
UNION
SELECT 'Drama' AS genre;
-- Result: 2 rows (Action, Drama)

-- UNION ALL (keeps duplicates)
SELECT 'Action' AS genre
UNION ALL
SELECT 'Action' AS genre
UNION ALL
SELECT 'Drama' AS genre;
-- Result: 3 rows (Action, Action, Drama)
```

## Practical Movie Database Example:

```sql
-- Get both high-rated AND high-grossing movies (some may be both)
SELECT
    title,
    imdb_rating,
    gross,
    'High Rated' AS category
FROM movies
WHERE imdb_rating > 8.5

UNION ALL  -- Keeps duplicates if a movie is both high-rated AND high-grossing

SELECT
    title,
    imdb_rating,
    gross,
    'High Grossing' AS category
FROM movies
WHERE gross > 500000000;
```

**With UNION ALL:** A movie like "The Dark Knight" (high rating AND high gross) would appear TWICE - once in each category

**With UNION:** It would appear only ONCE (PostgreSQL would remove the duplicate)

## Performance Impact:

```sql
-- SLOWER - must sort and deduplicate
SELECT director_name FROM movies WHERE released_year = 2020
UNION
SELECT director_name FROM movies WHERE released_year = 2021;

-- FASTER - just appends results
SELECT director_name FROM movies WHERE released_year = 2020
UNION ALL
SELECT director_name FROM movies WHERE released_year = 2021;
```

**Best Practice:** Use `UNION ALL` when:
- You know there won't be duplicates
- You want to keep duplicates
- Performance matters and you have large datasets

Use `UNION` when:
- You specifically need unique rows across both queries
- You're okay with the performance cost


## MATERIALIZED

Back to the main story.

We've seen the simple `WITH ... AS` clause.

> A useful property of WITH queries is that **they are normally evaluated only once per execution of the parent query**, even if they are referred to more than once by the parent query or sibling WITH queries.
> Thus, *expensive calculations* that are needed in multiple places can be placed within a WITH query to avoid redundant work.

The downside is that:

> The multiply-referenced `WITH` query will be evaluated as written, without suppression of rows that the parent query might discard afterwards.

#### For instance

Here's a CTE query that illustrates how a multiply-referenced WITH query is evaluated in full, without optimization:

The query `director_performance` is referenced twice in the main query.

```sql
-- CTE referenced twice
WITH director_performance AS (
    SELECT
        d.id,
        d.name AS director_name,
        COUNT(m.id) AS movie_count,
        AVG(m.imdb_rating) AS avg_rating,
        SUM(m.gross) AS total_gross,
        STRING_AGG(DISTINCT g.name, ', ' ORDER BY g.name) AS genres
    FROM directors d
    JOIN movies m ON d.id = m.director_id
    JOIN movie_genres mg ON m.id = mg.movie_id
    JOIN genres g ON mg.genre_id = g.id
    WHERE m.imdb_rating IS NOT NULL
    GROUP BY d.id, d.name
)
-- First query: High rated directors
SELECT
    'High Rated' AS category,
    director_name,
    movie_count,
    ROUND(avg_rating::numeric, 2) AS avg_rating,
    total_gross,
    genres
FROM director_performance
WHERE avg_rating >= 8.0

UNION ALL

-- Second query: High grossing directors
SELECT
    'High Grossing' AS category,
    director_name,
    movie_count,
    ROUND(avg_rating::numeric, 2) AS avg_rating,
    total_gross,
    genres
FROM director_performance
WHERE total_gross > 1000000000
ORDER BY category, avg_rating DESC;
```

**What PostgreSQL does:**

1. **Evaluates `expensive_calculation` ONCE** - processes ALL rows, creates complete result set
2. **Stores the full result** in memory/temp storage
3. **Both references** use the same pre-computed result
4. **No optimization** - even though the first SELECT only needs rows with `avg_rating > 8.0` and the second only needs rows with `total_gross > 1000000000`, PostgreSQL computes ALL rows first



**The key point:**
- Even though we only need **8 total rows** from the output (5 + 3)
- PostgreSQL computes **ALL rows** in `all_combinations` (potentially thousands)
- The CTE is **NOT optimized** based on what the parent query discards

**Contrast with a subquery (which DOES get optimized):**



**When this matters:**
- Large datasets where the CTE generates many rows but you only need a few
- Multiple references to the same CTE (it's computed once, stored once, reused)
- Performance tuning - **sometimes removing CTEs and using subqueries can be faster**


The query optimizer will sometimes choose to store the results of the WITH query in a temporary table, or not.

So there are cases where we want to enforce or avoid storing the results of the WITH query into a temp table. We can do that by adding `MATERIALIZED` or `NOT MATERIALIZED` to the WITH clause:

# MATERIALIZED vs NOT MATERIALIZED

```sql
WITH <query_name> AS <MATERIALIZED | NOT MATERIALIZED> (
    <query>
)
SELECT * FROM <query_name>
WHERE <condition>
LIMIT <limit>;
```


## What They Do

### MATERIALIZED
- PostgreSQL **executes the CTE completely**
- **Stores the entire result set** in memory or disk (like a temporary table)
- The main query then **reads from this stored result**
- The CTE is **isolated** from the rest of the query - no optimizations pass through

### NOT MATERIALIZED
- PostgreSQL **does NOT execute the CTE separately**
- Instead, it **merges/inlines the CTE code** into the main query
- The optimizer treats it as if you wrote a subquery
- Optimizations from the main query (WHERE, LIMIT, etc.) **can be pushed into the CTE**


## Practical Difference

### Example: Only need 10 rows

```sql
WITH data AS <MATERIALIZED | NOT MATERIALIZED> (
    SELECT * FROM movies  -- 10,000 rows
)
SELECT * FROM data
WHERE imdb_rating > 9.0  -- Only 10 rows match
LIMIT 10;
```

**With MATERIALIZED:**
1. Execute `SELECT * FROM movies` → gets all 10,000 rows
2. Store all 10,000 rows
3. Scan stored result for `imdb_rating > 9.0`
4. Return 10 rows

**With NOT MATERIALIZED:**
1. Merge the queries together as: `SELECT * FROM movies WHERE imdb_rating > 9.0 LIMIT 10`
2. PostgreSQL can use indexes, skip scanning unnecessary rows
3. Stop after finding 10 matching rows
4. Only process ~10-100 rows instead of 10,000

---

## When CTE is Referenced Multiple Times

```sql
WITH stats AS  <MATERIALIZED | NOT MATERIALIZED>  (
    SELECT director_id, COUNT(*) as cnt, AVG(rating) as avg
    FROM movies
    GROUP BY director_id
)
SELECT * FROM stats WHERE cnt > 10
UNION ALL
SELECT * FROM stats WHERE avg > 8.0;
```

**With MATERIALIZED:**
- Compute the aggregation **once**
- Store the result
- Both SELECT statements read from the **same stored result**
- The aggregation runs **1 time**

**With NOT MATERIALIZED:**
- The aggregation gets **inlined into each SELECT**
- The aggregation runs **2 times** (once for each UNION branch)
- May be slower if the aggregation is expensive

---

## Default Behavior

- **PostgreSQL < 12**: CTEs are always MATERIALIZED (optimization fence)
- **PostgreSQL 12+**: CTEs are NOT MATERIALIZED by default (unless referenced multiple times)

---

## Summary

**MATERIALIZED** = Execute separately, store complete result, use stored data

**NOT MATERIALIZED** = Inline into main query, allow optimizer to work across the whole query
#### Recursive

Using `RECURSIVE`, a WITH query can refer to its own output. A simple example is this query to sum the integers from 1 through 100:

```sql
WITH RECURSIVE t(n) AS (
    VALUES (1)
  UNION ALL
    SELECT n+1 FROM t WHERE n < 100
)
SELECT sum(n) FROM t;
```

More on recursive WITH queries in <https://www.postgresql.org/docs/current/queries-with.html#QUERIES-WITH-RECURSIVE>


## Key takeaways

1. **CTEs are named subqueries** - They use the `WITH ... AS` syntax to break complex queries into readable, reusable parts that can be referenced multiple times in the main query.

2. **Evaluated once per execution** - When a CTE is referenced multiple times, PostgreSQL computes it once and reuses the result, avoiding redundant calculations for expensive operations.

3. **MATERIALIZED vs NOT MATERIALIZED** - `MATERIALIZED` forces PostgreSQL to compute and store the full result (like a temp table), while `NOT MATERIALIZED` allows the optimizer to inline the CTE and push down filters for better performance.

4. **CTEs improve code readability and maintainability** - They follow the DRY principle (Don't Repeat Yourself), make queries easier to debug, and avoid creating actual temporary tables on disk by keeping data in memory.

5. **UNION vs UNION ALL matters** - `UNION` removes duplicates (slower, requires sorting), while `UNION ALL` keeps all rows (faster, no deduplication), so choose based on whether you need unique results.

## Further Readings

* Documentation: <https://www.postgresql.org/docs/current/queries-with.html>
* YouTube techFTQ channel: <https://www.youtube.com/watch?v=QNfnuK-1YYY>