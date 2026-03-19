---
layout: prose
title: "SQL Functions Solutions"
page_title: "SQL Functions Solutions"
summary: "CONCAT_WS, COALESCE, REPLACE, string manipulation"
footer: 'Alexis Perrier - alexisperrier.com  https://discord.gg/DDbh5AyHYH'
---

# Exercise on concatenate

Using the `treesdb_v03`, concatenate multiple columns into one

columns are :

- name
- genre
- species
- variety
- domain
- arrondissement

also

- if one value is null, replace with `UNK`, using `COALESCE`.
- use `concat_ws` to add a '-' (upper dash) between all the columns
- replace all the spaces with a column value with '_' with `REPLACE()`

see <https://www.postgresql.org/docs/current/functions-string.html>

Note: you don't have to return all the rows each time. You can limit to N random() rows;

```sql
WITH tree_taxonomy AS (
    SELECT
        tx.id,
        tn.name AS tree_name,
        tg.genre,
        ts.species,
        tv.variety
    FROM
        public.trees t
    JOIN public.taxonomy tx ON t.taxonomy_id = tx.id
    JOIN public.tree_names tn ON tx.name_id = tn.id
    JOIN public.tree_genres tg ON tx.genre_id = tg.id
    JOIN public.tree_species ts ON tx.species_id = ts.id
    JOIN public.tree_varieties tv ON tx.variety_id = tv.id
)
SELECT
    replace(
    concat_ws('-',
        COALESCE(tt.tree_name, 'UNK'),
        COALESCE(tt.genre, 'UNK'),
        COALESCE(tt.species, 'UNK'),
        COALESCE(tt.variety, 'UNK'),
        COALESCE(td.domain, 'UNK'),
        COALESCE(l.arrondissement, 'UNK')
    ), ' ', '_')
FROM
    tree_taxonomy tt
JOIN public.trees t ON tt.id = t.id
JOIN public.tree_domains td ON t.domain_id = td.id
JOIN public.locations l ON t.location_id = l.id
order by random() limit 2;
```
