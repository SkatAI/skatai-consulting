---
layout: prose
title: "The New York Trees census dataset"
page_title: "The New York Trees census dataset"
summary: "census of all the trees in Manhattan"
slides_project_home: /dbsql/
footer: 'Alexis Perrier - alexisperrier.com - relational databases - The New York Trees census dataset'
---

# Trees of New York

Browsing along the bigquery public dataset, on a rainy day in october, I stumbled on the [New York City trees dataset](https://console.cloud.google.com/bigquery?ws=!1m4!1m3!3m2!1sbigquery-public-data!2snew_york_trees).

Well well well, this looks like a great dataset for a nice exam.

The main dataset for the 2015 survey has 673k trees for a total uncompressed file size of 122 Mb. Bit too much for your laptops. I extracted all the trees in Manhattan.

This subset is available [https://alexisperrier.com/assets/db/new_york_trees.sql](/assets/db/new_york_trees.sql)


In a psql session, you can restore the dataset with

```
\i <path to the sql file>/new_york_trees.sql
```

or the equivalent for windows.


This will create

- the `new_york_trees` database
- the `trees` table

which holds 65423 trees.


The data schema is a bit different than the Paris dataset


| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| tree_id | INTEGER | PRIARY KEY
| created_at | DATE | The date tree points were collected in the census software |
| tree_dbh | INTEGER | Diameter of the tree, measured at approximately 54" / 137cm above the ground. |
| stump_diam | INTEGER | Diameter of stump measured through the center, rounded to the nearest inch. |
| status | STRING | Indicates whether the tree is alive, standing dead, or a stump. |
| health | STRING | Indicates the user's perception of tree health. |
| spc_latin | STRING | Scientific name for species, e.g. "Acer rubrum" |
| spc_common | STRING | Common name for species, e.g. "red maple" |
| user_type | STRING | This field describes the category of user who collected this tree point's data. |
| root_stone | STRING | Indicates the presence of a root problem caused by paving stones in tree bed |
| root_grate | STRING | Indicates the presence of a root problem caused by metal grates in tree bed |
| root_other | STRING | Indicates the presence of other root problems |
| trunk_wire | STRING | Indicates the presence of a trunk problem caused by wires or rope wrapped around the trunk |
| trnk_light | STRING | Indicates the presence of a trunk problem caused by lighting installed on the tree |
| trnk_other | STRING | Indicates the presence of other trunk problems |
| brch_light | STRING | Indicates the presence of a branch problem caused by lights (usually string lights) or wires in the branches |
| brch_shoe | STRING | Indicates the presence of a branch problem caused by sneakers in the branches |
| brch_other | STRING | Indicates the presence of other branch problems |
| address | STRING | Nearest estimated address to tree |
| zipcode | INTEGER | Five-digit zipcode in which tree is located |
| zip_city | STRING | City as derived from zipcode. This is often (but not always) the same as borough. |
| boroname | STRING | Name of borough in which tree point is located |
| nta_name | STRING | NTA name corresponding to the neighborhood tabulation area from the 2010 US Census that the tree point falls into. |
| latitude | FLOAT | Latitude of point, in decimal degrees |
| longitude | FLOAT | Longitude of point, in decimal degrees |


---
# Enjoy and explore

Once you have restored the database

make sure you have 65423 trees

Things you can start exploring

values of
- `root_...`, `trnk_...`,  `brch_...`
- `problems`
- `spc_common`
- `status` and `health`

---

# Scope of the exam

- basic querying
- CTEs
- window functions
- index creation
- explain a query plan
- create a view
- write simple functions in SQL
- write simple functions in pgplsql




