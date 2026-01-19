---
layout: default_en
title: "Intro to databases - Aero 2025-26 - IPSA"
slides_project_home: /ipsadb/imdb/
footer: 'Alexis Perrier - In311 - Intro to databases - Aero 2025-26 - IPSA'
---

# From the raw database to a semi normalized db


Since SQLite has some limitations (notably: you **can’t directly add a primary key or change column types in-place with `ALTER COLUMN`**), the correct approach is to:

* **Create a new table** with the desired schema (including a primary key and proper data types)
* **Copy all data** from the old table into the new table (casting text to numeric types)
* **Drop the old table and rename the new one**
* **Save this database as `imdb01`** (just as a new file when you `.save imdb01.sqlite` in the CLI)

---

## Step-by-step SQL

```sql
-- 1. Create a new table with correct types and a primary key
CREATE TABLE imdb_raw_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    Poster_Link TEXT,
    Series_Title TEXT,
    Released_Year INTEGER,
    Certificate TEXT,
    Runtime TEXT,
    Genre TEXT,
    IMDB_Rating REAL,
    Overview TEXT,
    Meta_score REAL,
    Director TEXT,
    Star1 TEXT,
    Star2 TEXT,
    Star3 TEXT,
    Star4 TEXT,
    No_of_Votes INTEGER,
    Gross REAL
);

-- 2. Copy data from old table into the new table, casting where needed
INSERT INTO imdb_raw_new (
    Poster_Link, Series_Title, Released_Year, Certificate, Runtime, Genre,
    IMDB_Rating, Overview, Meta_score, Director,
    Star1, Star2, Star3, Star4, No_of_Votes, Gross
)
SELECT
    Poster_Link,
    Series_Title,
    CAST(Released_Year AS INTEGER),
    Certificate,
    Runtime,
    Genre,
    CAST(IMDB_Rating AS REAL),
    Overview,
    CAST(Meta_score AS REAL),
    Director,
    Star1,
    Star2,
    Star3,
    Star4,
    CAST(No_of_Votes AS INTEGER),
    CAST(REPLACE(Gross, ',', '') AS REAL)  -- remove commas like "1,234,567"
FROM imdb_raw;

---

## 4. Save the database as `imdb01`



```sql
.save imdb01.db
```

---

> Now let's normalize

---



```sql
BEGIN TRANSACTION;

-- 1) Actors table
CREATE TABLE IF NOT EXISTS actors (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- 2) Join table movie_actors (many-to-many)
CREATE TABLE IF NOT EXISTS movie_actors (
    movie_id INTEGER NOT NULL,
    actor_id INTEGER NOT NULL,
    PRIMARY KEY (movie_id, actor_id),
    FOREIGN KEY (movie_id) REFERENCES imdb_key_types(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES actors(id) ON DELETE CASCADE
);

-- (Optional but recommended) lookup indexes
CREATE INDEX IF NOT EXISTS idx_movie_actors_movie ON movie_actors(movie_id);
CREATE INDEX IF NOT EXISTS idx_movie_actors_actor ON movie_actors(actor_id);
CREATE INDEX IF NOT EXISTS idx_actors_name ON actors(name);

-- 3) Fill actors table from Star1..Star4 (deduplicated, trimmed, non-empty)
INSERT OR IGNORE INTO actors(name)
SELECT name FROM (
    SELECT TRIM(Star1) AS name FROM imdb_key_types
    UNION
    SELECT TRIM(Star2) FROM imdb_key_types
    UNION
    SELECT TRIM(Star3) FROM imdb_key_types
    UNION
    SELECT TRIM(Star4) FROM imdb_key_types
)
WHERE name IS NOT NULL AND name <> '';

-- 4) Populate movie_actors by mapping each movie's Star1..Star4 to actor ids
INSERT OR IGNORE INTO movie_actors(movie_id, actor_id)
SELECT m.id, a.id
FROM imdb_key_types m
JOIN actors a ON a.name = TRIM(m.Star1)
WHERE m.Star1 IS NOT NULL AND TRIM(m.Star1) <> '';

INSERT OR IGNORE INTO movie_actors(movie_id, actor_id)
SELECT m.id, a.id
FROM imdb_key_types m
JOIN actors a ON a.name = TRIM(m.Star2)
WHERE m.Star2 IS NOT NULL AND TRIM(m.Star2) <> '';

INSERT OR IGNORE INTO movie_actors(movie_id, actor_id)
SELECT m.id, a.id
FROM imdb_key_types m
JOIN actors a ON a.name = TRIM(m.Star3)
WHERE m.Star3 IS NOT NULL AND TRIM(m.Star3) <> '';

INSERT OR IGNORE INTO movie_actors(movie_id, actor_id)
SELECT m.id, a.id
FROM imdb_key_types m
JOIN actors a ON a.name = TRIM(m.Star4)
WHERE m.Star4 IS NOT NULL AND TRIM(m.Star4) <> '';

COMMIT;
```

Notes:

* Assumes `imdb_key_types` has an `id INTEGER PRIMARY KEY` (the movie id).
* `INSERT OR IGNORE` safely skips duplicates and blank/NULL names.
* `TRIM()` keeps names consistent (avoids duplicates due to stray spaces).





