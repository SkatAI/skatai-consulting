

**solution:**
```sql
select * from trees order by random() limit 1;
```

_Write a query to find out if some values of idbase have more than 2 rows_

**solution:**

```sql
SELECT idbase, COUNT(*)
FROM trees
GROUP BY idbase
HAVING COUNT(*) > 1;
```

---

* create a new column ```remarkable_bool```
* get the proper values in the new column from the old column
* drop the old column
* rename the new column into the old column name

**solution**

```sql
ALTER TABLE trees ADD COLUMN remarkable_bool BOOLEAN;

UPDATE trees
SET remarkable_bool =
    CASE
        WHEN remarkable = 'OUI' THEN TRUE
        WHEN remarkable = 'NON' THEN FALSE
        WHEN remarkable = '' THEN NULL
        ELSE NULL
    END;

ALTER TABLE trees DROP COLUMN remarkable;

ALTER TABLE trees RENAME COLUMN remarkable_bool TO remarkable;
```


---

* We add a column ```geolocation``` with type POINT.
* Update the new column with POINT values  : use the functiosn ```TRIM(SPLIT_PART(geo_point_2d, ',', n))``` to extract the latitude and longitude
* delete the original ```geo_point_2d``` column

**solution**
```sql
ALTER TABLE trees ADD COLUMN geolocation POINT;

UPDATE trees
SET geolocation = point(
    TRIM(SPLIT_PART(geo_point_2d, ',', 2))::float,
    TRIM(SPLIT_PART(geo_point_2d, ',', 1))::float
);

ALTER TABLE trees DROP COLUMN geo_point_2d;
```

---

so to calculate the distance between A and B with coords (a,b) and (c,d)

**solution**
N = 10

```sql

WITH given_tree AS (
  SELECT id, geolocation
  FROM trees
  WHERE id = 1234
)
SELECT
  t.id,
  t.geolocation,
  ROUND(
    SQRT(
      POW((t.geolocation[0] - gt.geolocation[0]) * 73000, 2) +
      POW((t.geolocation[1] - gt.geolocation[1]) * 111000, 2)
    )
  ) AS distance_meters
FROM trees t, given_tree gt
WHERE t.id != gt.id
ORDER BY t.geolocation <-> gt.geolocation
LIMIT 9;
```

---

To finish our work on the trees table, we'd like to flag trees that have anomalies


**solution**
```sql
alter table trees add column anomaly bool default FALSE NOT NULL;
```

Then find some weird trees

* find the trees that are too tall
* same thing for the circumference

to find anomalies in the circumference, you can convert the circumference to the diameter with

**solution**
```sql
select circumference / PI() as diameter from trees
```

**solution**
```sql
alter table trees add column diameter float;
```

and update the diameter column with
**solution**
```sql
update trees
set diameter = circumference / PI();
```

---

You can use the function ```PERCENTILE_CONT(p)``` with ```p``` as the percentile value (0.5 for median, 0.9, 0.99 etc ...)

**solution**
```sql
SELECT
    COUNT(diameter) AS count,
    AVG(diameter) AS mean,
    STDDEV(diameter) AS stddev,
    MIN(diameter) AS min,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY diameter) AS q05,
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY diameter) AS q1,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY diameter) AS median,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY diameter) AS q3,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY diameter) AS q95,
    PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY diameter) AS q99,
    MAX(diameter) AS max
FROM trees;

```

---

the 100m threshold is arbitrary. For a real data analysis and we would have to find more relevant thresholds.

**solution**
```sql
update trees set anomaly = TRUE where (diameter > 100) or (height > 100);
```

and to flag the trees with duplicate idabase
**solution**
```sql
update trees set anomaly = true where  idbase IN (
    SELECT idbase
    FROM trees
    GROUP BY idbase
    HAVING COUNT(*) > 1
);
```


---
