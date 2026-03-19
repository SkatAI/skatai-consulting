---
layout: prose
title: "Window Functions and CTEs Introduction"
page_title: "Window Functions and CTEs Introduction"
summary: "Intermediate databases - Epita Fall 2025"
footer: 'Alexis Perrier - alexisperrier.com/dbsql/  '

---

# Session 5

## Last time

We saw:

- OLAP vs OLTP databases
- ERD and how to generate it in pgAdmin, also generating the SQL that creates the schema
- insertion, update and deletion anomalies
- the problem with ```NULL``` values and why it's best to avoid them
- anomalies
- normalization
- normal forms: 1NF, 2NF, 3NF

We started working on the normalization of the trees table

---

# recap normalization on the domain column

Taking the column ```domain``` as example, let's first make sure that the column is a good candidate for normalization

```domain``` is a categorical column, with null values and many uniques.
We have inserts, updates and deletion anomalies. normalization is a must.

The process has the following steps:


1. create the new table with correct values
- create a new ```domains``` table (id, domain)
- import UNIQUE and NOT NULL domain values from trees to the table ```domains```.
  - Best if values are sorted alphabetically.
  - extra processing may be needed: lowercase, trim, remove special characters
2. reconcile the data in the main trees table
  - add a ```domain_id``` key in the trees table
  - reconcile the foreign key with the primary key: ```trees.domain_id``` with the ```domain.id```
  - add a constraint on that key so that it is a foreign key in the trees table referencing the domains table
3. check and clean
  - check that all trees records have a valid ```domain_id```
  - drop the ```domain``` column in trees

## Today and next time

### Window functions and CTEs

We'll use the movies db dataset to work with:

- window functions : ROW_NUMBER(), RANK(), ... , OVER(Partition by ...)
- Common Table Expressions : WITH ... AS (sql) SELECT ....
- practice on the trees db

## EOD

- you can write queries using window function and CTEs
