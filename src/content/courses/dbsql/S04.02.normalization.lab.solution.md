---
layout: default_en
title: "Normalization Lab Solutions"
page_title: "Normalization Lab Solutions"
summary: "normalization, spotify dataset, SQL aggregation"
footer: 'Alexis Perrier - Skatai.com  https://discord.gg/DDbh5AyHYH'
---

# solution to S04 practice on normalization

## Part 1 : explore the data

1. how many artists?

```sql
select count(distinct artist) from tracks;
```

2. number of tracks per artist?

```sql
SELECT artist, COUNT(*) AS track_count
FROM tracks
GROUP BY artist
ORDER BY track_count desc;
```

3. Who are the artists with 1 track only?

```sql
SELECT artist
FROM tracks
GROUP BY artist
HAVING COUNT(*) = 1;
```

or re-using the query from Q2:

```sql
SELECT artist
FROM (
    SELECT artist, COUNT(*) AS track_count
    FROM tracks
    GROUP BY artist
) AS artist_counts
WHERE track_count = 1;
```

4. what is the average track duration per artist?

```sql
SELECT artist, AVG(duration) AS avg_duration
FROM tracks
GROUP BY artist;
```

## II Why normalize?

Why is the artist column a good candidate for normalization ?
Think of anomalies and list 2 reasons.

> Insertion error: adding an artist with no track forces us to add null values to many rows
> Update error: if an artist changes name, then we have to update multiple tracks at once
> Deletion error: multiple artist have only one track. so if we delete the traclk, the aritst name diseapers.

So the ```artist``` column checks all 3 types of anomalies.

### III Normalization

1. create a new artists table: id as primary key and name as text (or varchar)

```sql
CREATE table artists (
    id serial primary key,
    name VARCHAR(255)
);
```

2. import the sorted artist names from tracks to the artists table

```sql
INSERT INTO artists (name)
SELECT DISTINCT t.artist
FROM tracks t
WHERE t.artist IS NOT NULL
order by t.artist;
```

3. add a artist_id INT colun in trees

```sql
ALTER TABLE tracks ADD COLUMN artist_id INTEGER;
```

4. reconcile both tables by updating the trees.artist_id with the correct artists.id

```sql
UPDATE tracks t
SET artist_id = a.id
FROM artists a
WHERE t.artist = a.name;
```

5. make the trees.artists_id a foreign key referencing the artists table

```sql
ALTER TABLE tracks
ADD CONSTRAINT fk_tracks_artists
FOREIGN KEY (artist_id)
REFERENCES artists(id);
```

6. check that there is no gap between the 2 tables: count the number of rows where trees.artist != artists.name

```sql
select count(*)
from tracks t
join artists a on a.id = t.artist_id
where t.artist != a.name;
```

7. delete the artist column in the tracks table

```sql
ALTER TABLE tracks
DROP COLUMN artist;
```

### VI Update the queries

1. how many artists?

```sql
select count() from artists;
```

2. number of tracks per artist?

```sql
SELECT a.name AS artist_name, COUNT(t.id) AS track_count
FROM artists a
JOIN tracks t ON a.id = t.artist_id
GROUP BY a.name;
```

3. Who are the artists with 1 track only?

```sql
SELECT artist_name
FROM (
    SELECT a.name AS artist_name, COUNT(t.id) AS track_count
    FROM artists a
    JOIN tracks t ON a.id = t.artist_id
    GROUP BY a.name
) AS artist_track_counts
WHERE track_count = 1;
```

4. what is the average track duration per artist?

```sql
SELECT a.name AS artist_name,
    ROUND(AVG(t.duration),2) AS avg_duration
FROM artists a
JOIN tracks t ON a.id = t.artist_id
GROUP BY a.name;
```
