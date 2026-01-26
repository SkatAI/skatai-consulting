---
layout: slides
title: "Intro to databases - Aero 2025-26 - IPSA"
slides_project_home: /ipsadb/sql/
footer: 'Alexis Perrier - In311 - Intro to databases - Aero 2025-26 - IPSA'
---
<TitleSlide>

# In311 - Intro to databases
## Aero 2025-26 - IPSA
### SQL

<div class="boom">
## [SkatAI.com/ipsadb/sql](/ipsadb/sql)
<br />
</div>

</TitleSlide>
---

# Course outline

* **Lecture 1**: Introduction, types of DBMS, modeling methods, normalization
* **Tutorial 1**: Case study: Modeling
* **Lecture 2**: Relational databases and SQL language
* **Tutorial 2**: Case study: SQL query / Relational algebra
* **Lab 1–2**: Case study: Modeling / Implementation
* **Synthesis project (written exam)**: Complete case study – from modeling to querying

<div class="boom">
## [SkatAI.com/ipsadb/sql](/ipsadb/sql)
<br />
</div>

---

# Today

- RDBMS architecture
- Normalization and anomalies
- SQL language
- SQLite demo
- Relational algebra
- ACID properties

---

<div class="center">
<img src="/images/ipsadb/rdbms_architecture.png" width='70%' style='display: block; margin: auto; ' alt= "RDBMS Architecture">

Created by Claude Opus 4.1 with prompt <br />_"a simple sketch or diagram of an RDBMS architecture, keep it simple"_

This architecture shows how a SQL query flows from the client through various processing layers before reaching the actual data on disk, with each component playing a crucial role in ensuring efficient, reliable database operations.

</div>

---

# RDBMS Components

## **Client Applications Layer**

**SQL Clients, Web Apps, BI Tools**

These are the programs that users interact with to send SQL queries to the database. They connect to the RDBMS server using protocols like JDBC, ODBC, or native database drivers. (python, nodejs, Java, etc)

---
## **Query Processor**
- **Parser**

Checks SQL syntax and converts queries into an internal format the database can understand. It validates that tables and columns exist and that the user has proper permissions.

- **Optimizer**

Determines the most efficient way to execute a query by analyzing different execution plans. It considers factors like available indexes, table statistics, and join methods to minimize resource usage. This is what makes `Postgresql` super efficient.

- **Executor**

Carries out the optimized query plan by coordinating with other components to retrieve or modify data according to the SQL command.

---

# Example of a query plan with `EXPLAIN`

```sql
Explain
SELECT * FROM trees tr
JOIN taxonomy ta on ta.id = tr.taxonomy_id
JOIN tree_species sp on sp.id = ta.species_id
WHERE tr.circumference > 50 and sp.species = 'tomentosa';
```


<img src="/images/ipsadb/query_plan_trees.png" width='100%' style='display: block; margin: auto; ' alt= "Query Processor">

---
## **Storage Engine**
- **Data Access Methods**

Manages how data is physically stored and retrieved from disk.

It handles different storage structures like heap files, `B-trees` for indexes, and implements algorithms for efficient data access.

---

<img src="/images/ipsadb/storage-engine-diagram.svg" width='100%' style='display: block; margin: auto; ' alt= "Storage Engine">

---

## **Transaction Manager**
- **ACID Properties**

Ensures database transactions are

- _Atomic_: all-or-nothing
- _Consistent_: maintains data integrity
- _Isolated_: concurrent transactions don't interfere
- _Durable_: committed changes persist even after system failures

---

## **Buffer Manager**

**Memory Cache**

- Keeps frequently accessed data pages in RAM to reduce disk I/O.
- Manages the buffer pool using replacement algorithms like LRU (Least Recently Used) when memory is full.

---

## **Lock Manager**

**Concurrency Control**

- Coordinates multiple users accessing the database simultaneously by managing locks on data.
- Prevents conflicts and ensures transaction isolation through various locking protocols.

---

## **Database Files**

- **Data Files** - Store the actual table records and rows containing your business data.

- **Index Files** - Contain sorted pointers to data locations, speeding up queries by avoiding full table scans.

- **Log Files** - Record all database changes for recovery purposes, allowing the system to restore data after crashes or rollback uncommitted transactions.

---


# Components

<img src="/images/ipsadb/component-families-diagram.svg" width='70%' style='display: block; margin: auto; ' alt= "Component families and tools">

---

# Component families and tools

## **Data Manipulation**:
- **Internal (SQL)**

The **primary language** for interacting with the database from within. Users and applications use SQL commands (SELECT, INSERT, UPDATE, DELETE) to query and modify data directly.

- **External (Import/Export)**

Tools and utilities for moving data in and out of the database. This includes bulk loading tools, data migration utilities, and export functions for backing up or transferring data to other systems.

> in postgresql we have command line executables: `createdb`, `dropdb`, `pg_dump`, `pg_restore`, `pg_dumpall`, `pg_restoreall`

---

### **Database Exploitation**
**Organization and Optimization**

Administrative functions that maintain database performance. This involves organizing data structures, managing storage allocation, and optimizing query execution paths to ensure fast response times.

In postgresql , we have for instance

- `Autovacuum` reclaims storage space by cleaning up dead tuples.
- `TOAST` (oversized attribute storage) manages large field values.
- `VACUUM` / `REINDEX` / `CLUSTER`: Manual commands to reorganize data and indexes for better performance.

---

### **Core Components**

- **SQL Layer** - The query processing interface that interprets SQL commands, validates syntax, checks permissions, and translates high-level queries into low-level operations the database engine can execute.

- **Compacting and Cold Recovery** - Maintenance operations that reclaim unused space (compacting) and restore the database from backups or after unexpected shutdowns (cold recovery). These ensure data integrity and efficient storage usage.

- **Database Core (Tables, Views, Index)**

The logical database structure:
  - **Tables**: Store actual data in rows and columns
  - **Views**: Virtual tables created from queries that provide customized data presentations
  - **Indexes**: Sorted data structures that speed up data retrieval operations

add : functions, triggers, sequences, etc

---

### **File System Layer**

**NTFS, NFS, etc.** - The underlying operating system file systems where database files are physically stored. The database management system interfaces with these file systems to read and write data to disk. Common examples include:
  - ext4 (Linux)
  - NFS (Network File System for Unix/Linux)
  - APFS (macOS)
  - NTFS (Windows)

---
<TitleSlide>

<img src="/images/ipsadb/SQL-logo.png" width='70%' style='display: block; margin: auto; ' alt= "SQL Evolution">

</TitleSlide>
---

# Why Learn SQL in 2025?

1. **Universal**: Every database speaks SQL
2. **Stable**: Skills last your entire career
3. **Powerful**: Complex operations in few lines
4. **Required**: Every tech job posting mentions it
5. **Gateway**: Opens doors to data science, analytics, engineering

<div class="boom">
**Master SQL, and you'll never lack job opportunities**
<br />
<br />
</div>

---

# SQL

[wikipedia.org/wiki/SQL](https://en.wikipedia.org/wiki/SQL)

- created 1970s, standard (ANSI, ISO) since 1986
- declarative language
- composed of sub languages / modules
- implementations varies across vendors

---

<img src="/images/ipsadb/sql-evolution-timeline.svg" width='100%' style='display: block; margin: auto; ' alt= "SQL Evolution">

---
# Evolution since the 1970s

SQL was created in the **early 1970s**. Here are the major features added through its evolution:


**SQL-86 (SQL-87) - First ANSI Standard**
- Basic SELECT, INSERT, UPDATE, DELETE operations
- Simple JOIN syntax
- Basic data types (INTEGER, CHAR, VARCHAR)

**SQL-89 (SQL1)**
- Integrity constraints (PRIMARY KEY, FOREIGN KEY)
- Basic referential integrity

**SQL-92 (SQL2)**
- New data types (DATE, TIME, TIMESTAMP, INTERVAL)
- Outer joins (LEFT, RIGHT, FULL)
- CASE expressions
- CAST function for type conversion
- Support for dynamic SQL

**SQL:1999 (SQL3)**
- Regular expressions
- Object-oriented features (user-defined types, methods)
- Array data types
- Window functions (ROW_NUMBER, RANK)
- Common Table Expressions (WITH clause)

**SQL:2003**
- XML data type and functions
- MERGE statement (UPSERT)
- Auto-generated values (IDENTITY, sequences)
- Standardized window functions

**SQL:2006**
- Enhanced XML support
- XQuery integration
- Methods for storing and retrieving XML

**SQL:2008**
- TRUNCATE statement
- INSTEAD OF triggers
- Enhanced MERGE capabilities

**SQL:2011**
- Temporal databases (system-versioned tables)
- Enhanced window functions
- Improvements to CTEs

**SQL:2016**
- JSON support (JSON data type and functions)
- Row pattern recognition

**SQL:2023 (Latest)**
- SQL/PGQ (Property Graph Queries)
- Multi-dimensional arrays
- More JSON features
- Graph database capabilities

---

# Why SQL Survived 50 Years

```python
# Python changes every few years
print "Hello"     # Python 2 (dead)
print("Hello")    # Python 3

# JavaScript changes constantly
var x = 5;        // Old way
let x = 5;        // New way
const x = 5;      // Newer way
```

```sql
-- SQL from 1990s still works today!
SELECT * FROM users WHERE age > 18;
```

**SQL is the `COBOL` that actually stayed relevant**

---

## SQL vs Programming Languages

**Imperative** (Python/Java/C++): "HOW to do it"
```python
results = []
for user in users:
    if user.age > 21 and user.country == 'France':
        results.append(user.name)
return sorted(results)
```

---

**Declarative** (SQL): "WHAT you want"


*You describe the result, the database figures out HOW*

**Declarative** means you **describe *what* you want**, not **how to do it**.

In SQL, you **state the result** you want, and the database (query planner) figures out **how to get it**.

```sql
SELECT name FROM students WHERE grade > 15;
```

* You **declare**: “Give me the names of students with grade > 15.”
* You **don’t say**: “Go through each student row, check grade, and collect names.”

✅ You focus on **what**, not **how** — that’s why SQL is declarative.


---

# SQL + Modern Tools

SQL isn't just for database admins anymore:

- **Data Scientists**: SQL + Python/R
- **Analysts**: SQL + Tableau/PowerBI
- **Engineers**: SQL + ORMs
- **Product Managers**: SQL + Metabase
- **Machine Learning**: SQL + Feature stores

```python
# Modern data stack
df = pd.read_sql("SELECT * FROM events WHERE date > '2024-01-01'", conn)
model.train(df)
```

---

### SQL Security: Bobby Tables

<img src="/images/ipsadb/exploits_of_a_mom_2x.png" width='100%' style='display: block; margin: auto; ' alt= "xkcd SQL injection">


from [XKCD comics](https://xkcd.com/327/)

```sql
-- NEVER do this
query = f"SELECT * FROM users WHERE name = '{user_input}'"

```

If the user enters: '; DROP TABLE users; '

The  query becomes:

```sql
SELECT * FROM users WHERE name = '';
DROP TABLE users;
```

Boom! no more user table!

**Always use parameterized queries!**

---

# Midjourney

animate this cartoon

<video src="/images/ipsadb/exploits_of_a_mom.mp4" width='100%' controls></video>


---

# SQL Dialects
## Same Language, Different Accents

| Standard SQL | PostgreSQL | MySQL | SQL Server |
|-------------|------------|-------|------------|
| `SUBSTRING()` | `SUBSTRING()` | `SUBSTRING()` | `SUBSTRING()` |
| ❌ | `LIMIT 10` | `LIMIT 10` | `TOP 10` |
| ❌ | `STRING_AGG()` | `GROUP_CONCAT()` | `STRING_AGG()` |
| ❌ | `::TEXT` | ❌ | `CAST AS VARCHAR` |

**Core SQL (90%) is identical everywhere**
*Fancy features (10%) vary*



---
<img src="/images/ipsadb/sql_sub_languages.png" width='80%' style='display: block; margin: auto; ' alt= "SQL Sub Languages">

---

# The SQL Family Tree

```
SQL
├── DDL (Data Definition Language)
│   └── CREATE, ALTER, DROP
├── DML (Data Manipulation Language)
│   └── INSERT, UPDATE, DELETE
├── DQL (Data Query Language)
│   └── SELECT, FROM, WHERE, JOIN
├── DCL (Data Control Language)
│   └── GRANT, REVOKE
└── TCL (Transaction Control Language)
    └── COMMIT, ROLLBACK, BEGIN
```

**You'll use DML and DQL 90% of the time**



---

### **1. DDL - Data Definition Language**

Defines and manages database structure
- _CREATE_: Builds new database objects (tables, indexes, views, schemas)
- _ALTER_: Modifies existing structures (add/drop columns, change data types)
- _DROP_: Permanently removes database objects

---

### CREATE

```sql
create database ipsadb;
```

```sql
create table students (
    id serial primary key,
    name varchar(100) not null,
    age int not null,
    grade int not null
);
```

```sql
ALTER table students ADD COLUMN graduation_year int;
```

```sql
DROP table students;
```

---

# create database

suffices to just

```sh
sqlite3 <database name>.db
```

adding `db` or `.db` as suffix is good practice


---
# create table in sqlite

<img src="/images/ipsadb/sqlite_create_table.png" width='80%' style='display: block; margin: auto; ' alt= "SQL Create Table">

[create table](https://sqlite.org/lang_createtable.html)

---
# Simple version

```sql
CREATE TABLE <table_name> (
    id serial primary key,
    <column_name> <data_type> <constraints>,
    <column_name> <data_type> <constraints>,
    <column_name> <data_type> <constraints>,
    <column_name> <data_type> <constraints>,
);
```

**with index and keys**:

```sql
CREATE TABLE <table_name> (
    id serial primary key,
    <column_name> <data_type> <constraints>,
    <column_name> <data_type> <constraints>,
    <column_name> <data_type> <constraints>,
    <column_name> <data_type> <constraints>,
    INDEX <index_name> (<column_name>),
    UNIQUE INDEX <index_name> (<column_name>),
    FOREIGN KEY (<column_name>) REFERENCES <table_name>(<column_name>),
);
```


---

# Create table

<div class="columns">
<div markdown="1">

**in postgresql**

```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hire_date DATE NOT NULL,
    salary NUMERIC(10, 2) NOT NULL,
    department_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
</div>
<div markdown="1">

**in sqlite**

```sql
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    hire_date DATE NOT NULL,
    salary NUMERIC NOT NULL,
    department_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
</div>
</div>

---

# Create table documentation

<div class="center">

Let's look at the postgresql documentation for the create table statement:

<img src="/images/ipsadb/create_table_documentation_postgresql.png" width='100%' style='display: block; margin: auto; ' alt= "Create Table">

[https://www.postgresql.org/docs/current/sql-createtable.html](https://www.postgresql.org/docs/current/sql-createtable.html)


</div>


---

### **2. DML - Data Manipulation Language**

Manages data within tables
- _INSERT_: Adds new rows of data to tables
- _UPDATE_: Modifies existing data values in rows
- _DELETE_: Removes specific rows from tables
- _MERGE_: Performs "_upsert_" operations: insert or update based on conditions

---
# Insert

```sql
INSERT INTO <table_name> (<column_name>, <column_name>, <column_name>, <column_name>)
VALUES (<value>, <value>, <value>, <value>);
```

for  instance

```sql
INSERT INTO courses (title, description, semester, hours)
VALUES (
  "intro to databse",
  "the best intro to database course in the universe ",
  "fall 2025",
  4
);
```

> the id gets auto-incremented
> any date time now with default value NOW() gets instanciated


---

# make sure

- data type match : you cannot insert an INT into a TEXT columns
- you can insert multiple rows in one query
- constraints will throw errors if not respected (unicity, foreign keys, etc )

It is **good practice** to use default values for date time columns and always have for tracabiliy purposess the 2 colums:

- `created_at`
- `updated_at`

---
## Update

```sql
UPDATE <table_name>
SET <column_name> = <value>,
  <column_name> = <value>
WHERE <condition>;
```

for instance:

```sql
UPDATE courses
SET title = "intro to databse",
    description = "the best intro to database course in the universe",
    semester = "fall 2025",
    hours = 4
WHERE id = 1;
```

---

### **3. DQL - Data Query Language**

Retrieves data from the database
- _SELECT_: Fetches data from one or more tables
- _FROM_: Specifies source tables
- _WHERE_: Filters results based on conditions
- _JOIN_: Combines rows from multiple tables

```sql
SELECT <column_name>, <column_name>
FROM <table_name>
WHERE <condition>;
```

for instance:

```sql
SELECT title, description
FROM courses
WHERE semester = "fall 2025";
```

joining on the teacher id:

```sql
SELECT title, description, teachers.name
FROM courses
JOIN teachers ON courses.teacher_id = teachers.id
WHERE semester = "fall 2025";
```


---

### **4. DCL - Data Control Language**

Controls access and permissions
- _GRANT_: Gives specific privileges to users/roles
- _REVOKE_: Removes previously granted privileges
- _DENY_: Explicitly prevents access (Microsoft SQL Server specific)

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON <table_name> TO <user_name>;
```

for instance:

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON courses TO Alexis;
```

---

### **5. TCL - Transaction Control Language**

Manages database transactions
- _COMMIT_: Permanently saves all changes in a transaction
- _ROLLBACK_: Undoes all changes in current transaction
- _SAVEPOINT_: Sets a point within transaction to rollback to

---
# transaction example

```sql
BEGIN TRANSACTION;

-- Update all course credits by 1
UPDATE courses
SET credits = credits + 1;

-- Give all teachers a 10% raise
UPDATE teachers
SET salary = salary * 1.10;

-- Check if any teacher salary is now over 200000
IF EXISTS (SELECT 1 FROM teachers WHERE salary > 200000)
  BEGIN
      -- Something went wrong, undo everything
      ROLLBACK;
      PRINT 'Rolled back - salary too high';
  END
ELSE
  BEGIN
      -- Everything looks good, save the changes
      COMMIT;
      PRINT 'Changes saved successfully';
  END
```


---



Both COMMIT and ROLLBACK are "terminal" commands for a transaction - they save/undo the work AND close the transaction in one go.

There's no "END TRANSACTION" command in SQL. Once you COMMIT or ROLLBACK, you're done!

---

> **Important Note**: Some database texts combine **DQL** with **DML** since `SELECT` statements can be considered data manipulation, resulting in 4 sub-languages instead of 5.


---

# Also in DQL

**Aggregate Functions (DQL)**
- `COUNT()`, `SUM()`, `AVG()`, `MAX()`, `MIN()`
- Used with `GROUP BY` for summarizing data

**Scalar Functions (DQL)**
- `COALESCE()` - Handles NULL values
- `CAST() / CONVERT()` - Type conversion
- `SUBSTRING(), CONCAT(), TRIM()` - String manipulation
- `DATEADD(), DATEDIFF()` - Date operations
- `ROUND(), FLOOR(), CEILING()` - Math functions

**Clauses & Operations (DQL)**
- `GROUP BY` - Groups rows for aggregation
- `HAVING` - Filters grouped results
- `ORDER BY` - Sorts result sets
- `DISTINCT` - Removes duplicates
- `UNION/INTERSECT/EXCEPT` - Set operations

**Window Functions (DQL)**
- `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`
- `LAG()`, `LEAD()` - Access other rows
- Running totals and moving averages

**Conditional Logic (DQL)**
- `CASE WHEN` - Conditional expressions

---

## **Why They're DQL**

All these functions and clauses:
- Are used within SELECT statements
- Don't modify data (read-only operations)
- Transform how data is retrieved or displayed
- Don't change database structure or permissions

**Note:** Some databases like PostgreSQL consider these part of the broader "SELECT statement syntax" rather than separate categories, but they all fall under the DQL umbrella since they're used for querying data.

---

# DDL:  Data Definition Language

```sql
-- Create the structure
CREATE TABLE songs (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    duration_seconds INTEGER,
    release_date DATE
);

-- Modify the structure
ALTER TABLE songs ADD COLUMN genre TEXT;

-- Destroy the structure
DROP TABLE songs;  -- ⚠️ Everything gone!
```

---

# DML: Living in the House
## Data Manipulation Language

```sql
-- Create: Add new data
INSERT INTO songs (title, artist, duration_seconds)
VALUES ('Flowers', 'Miley Cyrus', 200);

-- Read: Query data
SELECT title, artist FROM songs WHERE duration_seconds < 180;

-- Update: Modify existing data
UPDATE songs SET genre = 'Pop' WHERE artist = 'Taylor Swift';

-- Delete: Remove data
DELETE FROM songs WHERE release_date < '2000-01-01';
```

> **The everyday SQL you write**

---

# The SELECT Statement
## Your Swiss Army Knife

```sql
SELECT     -- What columns?
FROM       -- What table?
WHERE      -- What rows?
GROUP BY   -- How to group?
HAVING     -- Filter groups?
ORDER BY   -- What order?
LIMIT      -- How many?
```

**This pattern solves 82% of your data questions**


---
<TitleSlide>

<img src="/images/ipsadb/dilbert_made_up_numbers.png" width='1000' style='display: block; margin: auto; ' alt= "Dilbert made up numbers">

</TitleSlide>
---

# SQL Reads Like English

```sql
-- Almost natural language
SELECT name, age
FROM students
WHERE grade > 15
ORDER BY age DESC
LIMIT 10;
```

**Translates to:**
"Show me the names and ages of students with grades above 15, sorted by age (oldest first), but only the top 10"

*This is why SQL survived: humans can read it*

---

### The Power of JOINs

<div class="columns">
<div markdown="1">
Without JOIN (multiple queries):


<div style="width: 100%">

```sql
# Get user
user = db.query("
  SELECT * FROM users WHERE id = 42
")
# Get their orders
orders = db.query(f"
  SELECT *
  FROM orders
  WHERE user_id = {user.id}
")
# Get order details
for order in orders:
    items = db.query(f"
      SELECT *
      FROM items
      WHERE order_id = {order.id}
    ")
```

</div>
</div>
<div markdown="1">
With JOIN (one query):
```sql
SELECT u.name, o.date, i.product
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN items i ON o.id = i.order_id
WHERE u.id = 42;
```

</div>
</div>

---
<TitleSlide>

# Joins

</TitleSlide>
---



### **What is a JOIN?**
A JOIN combines rows from two or more tables based on a related column between them.

### **Basic JOIN Syntax**
```sql
SELECT columns
FROM table1
JOIN table2
ON table1.column = table2.column;
```

- join on `keys`
- for readability purposes, you can use aliases (`from trees tr`)

---
### Example : the tree database

<img src="/images/ipsadb/ERD-trees-normalized.png" width="100%" style="display: block; margin: auto; " alt="ERD trees normalized" />

---

using aliases
```sql
SELECT * FROM trees tr
JOIN taxonomy ta on ta.id = tr.taxonomy_id
JOIN tree_species sp on sp.id = ta.species_id
WHERE tr.circumference > 50 and sp.species = 'tomentosa';
```

instead of

```sql
SELECT * FROM trees
JOIN taxonomy on taxonomy.id = trees.taxonomy_id
JOIN tree_species on tree_species.id = taxonomy.species_id
WHERE trees.circumference > 50 and tree_species.species = 'tomentosa';
```

---


### **Types of JOINs**

**1. INNER JOIN (Default)**
Returns only matching records from both tables.
```sql
SELECT customers.name, orders.order_date
FROM customers
INNER JOIN orders
ON customers.customer_id = orders.customer_id;
```

---

```sql
SELECT
    m.movie_id,
    m.title,
    m.release_year,
    a.actor_name,
    a.role
FROM movies m
LEFT JOIN actors a ON m.movie_id = a.movie_id
ORDER BY m.title;
```

**Result example:**

movie_id | title           | release_year | actor_name    | role
|---------|-----------------|--------------|---------------|-------------
| 1       | The Matrix      | 1999         | Keanu Reeves  | Neo
| 1       | The Matrix      | 1999         | Laurence F.   | Morpheus
| 2       | Inception       | 2010         | Leonardo D.   | Cobb

These movies with no actors will not be shown


movie_id | title           | release_year | actor_name    | role
|---------|-----------------|--------------|---------------|-------------
| 3       | Documentary XYZ | 2023         | NULL          | NULL
| 4       | Silent Film     | 1920         | NULL          | NULL


---

**2. LEFT JOIN (LEFT OUTER JOIN)**

Returns all records from the left table, and matched records from the right table.

```sql
SELECT customers.name, orders.order_date
FROM customers
LEFT JOIN orders
ON customers.customer_id = orders.customer_id;
```

*NULL values appear for customers with no orders*

---

Simple LEFT JOIN: All movies, even those without actors

```sql
SELECT
    m.movie_id,
    m.title,
    m.release_year,
    a.actor_name,
    a.role
FROM movies m
LEFT JOIN actors a ON m.movie_id = a.movie_id
ORDER BY m.title;
```

**Result example:**

| movie_id | title           | release_year | actor_name    | role
|---------|-----------------|--------------|---------------|-------------
| 1       | The Matrix      | 1999         | Keanu Reeves  | Neo
| 1       | The Matrix      | 1999         | Laurence F.   | Morpheus
| 2       | Inception       | 2010         | Leonardo D.   | Cobb
| 3       | Documentary XYZ | 2027         | NULL          | NULL
| 4       | Silent Film     | 1920         | NULL          | NULL


The key point: **LEFT JOIN keeps ALL movies**, even if they have no actors in the actors table. Those movies will show NULL values for the actor columns.
This is useful for:

Seeing all movies in your database (with or without cast info)
Finding movies that have no actors assigned yet (like documentaries or movies with missing data)
Making sure you don't lose any movies from your results just because actor data is incomplete

---

**3. RIGHT JOIN (RIGHT OUTER JOIN)**

Returns all records from the right table, and matched records from the left table.

```sql
SELECT customers.name, orders.order_date
FROM customers
RIGHT JOIN orders
ON customers.customer_id = orders.customer_id;
```
*NULL values appear for orders with no customer info*

---

**4. FULL OUTER JOIN**

Returns all records when there's a match in either table.

```sql
SELECT customers.name, orders.order_date
FROM customers
FULL OUTER JOIN orders
ON customers.customer_id = orders.customer_id;
```
*Note: Not supported in MySQL, use UNION of LEFT and RIGHT JOIN*

---

**FULL OUTER JOIN**:

All movies AND all actors, even unmatched ones

```sql
SELECT
    m.movie_id,
    m.title,
    m.release_year,
    a.actor_name,
    a.role
FROM movies m
FULL OUTER JOIN actors a ON m.movie_id = a.movie_id
ORDER BY m.title, a.actor_name;
```

**Result example**:


| movie_id | title           | release_year | actor_name    | role
|---------|-----------------|--------------|---------------|-------------
| NULL     | NULL            | NULL         | Alphonse     | NULL
| NULL     | NULL            | NULL         |    Nephew of Alphonse    | NULL
| 1        | The Matrix      | 1999         | Keanu Reeves  | Neo
| 2        | Inception       | 2010         | Leonardo D.   | Cobb
| 3        | Documentary XYZ | 2023         | NULL          | NULL
| 4        | Silent Film     | 1920         | NULL          | NULL

The key difference: FULL OUTER JOIN keeps EVERYTHING from both tables:

- All movies (even those with no actors)
- All actors (even those not assigned to any movie)

This creates three groups in your results:

- Matched records - Movies with their actors
- Movies with no actors - NULLs in actor columns
- Actors with no movies - NULLs in movie columns


---

**5. CROSS JOIN**

Returns the Cartesian product of both tables (every row paired with every row).

```sql
SELECT customers.name, products.product_name
FROM customers
CROSS JOIN products;
```

---

<img src ="/images/ipsadb/sql-joins-diagram.svg" width="100%" style="display: block; margin: auto; " alt="ERD customers orders" />


---

### **Performance Tips**
- Always JOIN on **indexed** columns when possible
- Use INNER JOIN when you only need matching records
- Be careful with CROSS JOIN - can produce huge result sets
- Filter early with WHERE clauses to reduce data processing

### **Common Mistakes to Avoid**
- *Ambiguous column names* (always use table prefixes)
- Forgetting the ON clause (creates a CROSS JOIN)
- Wrong JOIN type (using INNER when you need LEFT)
- Not considering NULL values in OUTER JOINs





---
<TitleSlide>

# Why normalize ?
## to avoid anomalies

</TitleSlide>
---


# Anomalies

So, given a database, how do you know if it needs to be normalized?

There are 3 types of *anomalies* that you can look for:

- insertion
- update
- deletion

A normalized database will solve these anomalies.

---

## Insertion anomalies

Consider the table of teachers and their courses

| id  | teacher | course               |
| --- | ------- | -------------------- |
| 1   | Bjorn  | Intermediate Database |
| 2   | Sofia   | Crypto Currencies     |
| 3   | Hussein | Data Analytics        |


Now a new teacher (Alexis), is recruited by the school. The teacher does not have a course assigned to yet. If we want to insert the teacher in the table we need to put a ```NULL``` value in the course column.

**NULL values are to be avoided!!!**  (more on that later)

More generally:

- in a relation where an item (A) has many (or has one) other items (B), but A and B are in the same table.
- so for a new item A without items B, inserting the new A means the value for B has to be null

---

<img src="/images/ipsadb/insertion-anomaly-diagram.svg" width='80%' style='display: block; margin: auto; ' alt= "Insertion Anomaly">


---

# Update anomaly

Consider now the following movies, directors, year and production house


| id | Film | Director | Production House |
|---------|----------|--------------|----------------------|
| 1       | Sholay                  | Ramesh Sippy               | Sippy Films           |
| 2       | Dilwale Dulhania Le Jayenge | Aditya Chopra           | Yash Raj Films        |
| 3       | Kabhi Khushi Kabhie Gham | Karan Johar                | Dharma Productions    |
| 4       | Kuch KuchwHota Hai       | Karan Johar                | Dharma Productions    |
| 5       | Lagaan                  | Ashutosh Gowariker         | Aamir Khan Productions|
| 6       | Dangal                  | Nitesh Tiwari             | Aamir Khan Productions|
| 7       | Bajrangi Bhaijaan        | Kabir Khan                 | Salman Khan Films     |
| 8       | My Name Is Khan          | Karan Johar               | Dharma Productions    |
| 9       | Gully Boy               | Zoya Akhtar               | Excel Entertainment   |
| 10      | Zindagi Na Milegi Dobara | Zoya Akhtar                | Excel Entertainment   |

(chatGPT knows Bollywood 😄)

If one of the production house changes its name, we need to update multiple rows.

In a small example like this one, this is not a problem since the query is trivial
but in large databases some rows may not be updated.

- **human error** when writing the update query or doing manual updates
- **Redundant Data**: updating multiple rows _at the same time_  can cause performance issues in large databases with millions of records.
- **Data Locking**: In a multi-user environment, updating several rows at once may lock parts of the database, affecting performance and potentially leading to delays in accessing data for other users or systems.
- if changes are made in stages or **asynchronously**, data can temporarily or permanently enter an inconsistent state.


By moving the production house data in its own separate table, then updating its name would only impact one row!

---

<img src="/images/ipsadb/update-anomaly-diagram.svg" width='80%' style='display: block; margin: auto; ' alt= "Update Anomaly">

---

## Deletion errors

Here is a table about programmers, languages and (secret) projects

| Developer_Name | Language  | Project_Name              |
|----------------|-----------|---------------------------|
| Lisa           | Python    | Atomic  Blaster |
| Bart          | Java      | Invisible tank  |
| Montgomery    | Python    | Atomic Blaster  |
| Maggie | JavaScript| Exploding  Squirrel |
| Ned | C++       | War AI |
| Homer | Python    | Atomic Blaster |
| Marge | Ruby      | War AI|


Let's say that for imperative reasons we need to cover up the existence of the  _War AI_ project. And we will delete all rows that mention that project in the databse. Then an unfortunate consequence is that we will also also delete all mentions of Marge and Ned since they are not involved in other projects.

So by deleting an attribute we also remove certain valus of other attributes.

---

<img src="/images/ipsadb/deletion-anomaly-diagram.svg" width='80%' style='display: block; margin: auto; ' alt= "Deletion Anomaly">


---

## In short

When you have different but related **natural / logical entities** packed together in the same table, this causes anomalies and you need to normalize.

---

# The problem with null values

Why is it a problem to have NULL values in a column?

- **Ambiguity**: Null can mean "*unknown*", "*not applicable*" or "*missing*" leading to confusion.

- Null values require **special handling** and complicates
    - **queries**: (`IS NULL` vs `=`) .
    - **data analysis**:  `NULL` values are ignored in aggregate functions (like `SUM`, `COUNT`).

- Impacts **indexing and performance**: since Nulls are excluded from indexes

- **Violates normalization**: indicates poor database design or incomplete relationships.

So avoid NULL values if you can!

---

<img src="/images/dbsql/null-values-headache.png" width='60%' style='display: block; margin: auto; ' alt= "Null Values Headache">


---
<TitleSlide>

# SQLITE

<img src="/images/ipsadb/SQLite370.png" width='100%' style='background-color: #FFF; display: block; margin: auto; ' alt= "Create Table">

[https://sqlite.org](https://sqlite.org)

</TitleSlide>
---

# SQLITE

- SQLite stores the entire database, consisting of definitions, tables, indices, and data, as a single cross-platform file.

- SQLite is [everywhere](https://en.wikipedia.org/wiki/SQLite#Notable_uses)

---
# install sqlite on Mac

SQLite comes pre-installed on macOS. First check your version:

```bash
sqlite3 --version
```

or install it with Homebrew:

```bash
brew install sqlite
```

---
# sqlite3 on windows

## **Installing SQLite on Windows - Quick Guide**

### **Method 1: Download Precompiled Binaries (Easiest)**

1. **Download SQLite**:
   - Go to https://www.sqlite.org/download.html
   - Under "Precompiled Binaries for Windows"
   - Download `sqlite-tools-win-x64-*.zip` (or win32 for 32-bit)

2. **Extract Files**:
   - Create folder `C:\sqlite`
   - Extract the ZIP contents to this folder
   - You should see `sqlite3.exe`, `sqldiff.exe`, and `sqlite3_analyzer.exe`

3. **Add to System PATH**:
   - Open "System Properties" → "Environment Variables"
   - Under "System Variables", find and select "Path"
   - Click "Edit" → "New"
   - Add `C:\sqlite`
   - Click "OK" on all windows

4. **Verify Installation**:
   - Open Command Prompt (cmd) or PowerShell
   - Type:
   ```cmd
   sqlite3 --version
   ```

### **Method 2: Using Chocolatey Package Manager**

1. **Install Chocolatey** (if not installed):
   - Open PowerShell as Administrator
   - Run:
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

2. **Install SQLite**:
   ```powershell
   choco install sqlite
   ```

3. **Verify**:
   ```powershell
   sqlite3 --version
   ```

### **Method 3: Using Windows Package Manager (winget)**

```powershell
winget install SQLite.SQLite
```

### **GUI Options for Windows**
- **DB Browser for SQLite** - Free, user-friendly GUI
- **SQLiteStudio** - Free, portable, no installation needed
- **HeidiSQL** - Free, supports multiple database types

### **Common Windows Issues**
- **"sqlite3 is not recognized"** - PATH not set correctly, restart Command Prompt
- **Access denied** - Run as Administrator or change installation location
- **32 vs 64-bit** - Download the version matching your Windows architecture


---

# GUI

- [https://sqlitebrowser.org/](https://sqlitebrowser.org/)
- [https://sqlitestudio.pl/](https://sqlitestudio.pl/)


<img src="/images/ipsadb/dbbrowser_sqlite.png" width='80%' style='display: block; margin: auto; ' alt= "sqlitebrowser">

---

# Useful SQLite Commands

- `.help`: Show all commands
- `.tables`: List all tables
- `.schema`: Show table structures
- `.quit`: Exit SQLite
- `.databases`: List attached databases


These are specific to sqlite3

In postgresql you can use

```bash
\l: list databases
\c <database_name>: connect to a database
\d: list tables
\d <table_name>: show table structure
\q: quit
```

---

You can work in the terminal

```bash
sqlite3 <database_name> ".schema"
sqlite3 <database_name> ".tables"
sqlite3 <database_name> ".databases"
```

or execute a sql file

```bash
sqlite3 <database_name> < <sql_file>
```

Note the `<` before the sql file name


or open a sqlite session

```bash
sqlite3 <database_name>
```

and then run your queries and commands

---
<TitleSlide>

# lets go !

</TitleSlide>
---

# Normalize imdb dataset

we are working on the [imdb 1000 dataset](https://www.kaggle.com/datasets/omarhanyy/imdb-top-1000) a list of top 1000 movies on IMDB.

- The original data is available [here](/assets/data/imdb_top_1000.csv) (with header)
- The data with no header is available [here](/assets/db/imdb_top_1000_no_header.csv). we need this to import the data in sqlite

The we will create a raw database, a database with primary key and proper data types, and a normalized database.

- The raw database is available [here](/assets/db/imdb_raw.db)
- The database with primary key and proper data types is available [here](/assets/db/imdb_key_types.db)
- The database normalized (actors only) is [here](/assets/db/imdb_normalized.db)

---

# The plan

1. create a database, a table and import the csv file
2. explore the data with simple queries
3. address one type of anomaly and normalize the data
4. query the normalized data
5. fully normalized data, and queries with joins


---

## Create the database

in sqlite suffices to just type

```bash
sqlite3 imdb_raw.db
```

this creates the database `imdb_raw.db` in the current directory. It's empty

<img src="/images/ipsadb/create_empty_sqlitedb.png" width='80%' style='display: block; margin: auto; ' alt= "sqlite3">


Let's go back to the database in sqlite

```bash
sqlite3 imdb_raw.db
```

and list the tables, there is none

```sql
.tables
```

So we create the 1st table with a `CREATE TABLE` statement

The original file has 11 columns: `rank`, `title`, `description`, `genre`, `duration`, `year`, `rating`, `votes`, `revenue`, `metascore`, `imdb_score`, ....


We want to create the table with the same column names. we'll use a single `TEXT` type for all the columns to simplify things.

```sql
CREATE TABLE imdb_raw (
  Poster_Link   TEXT,
  Series_Title  TEXT,
  Released_Year TEXT,           -- keep TEXT for now (there are often odd values)
  Certificate   TEXT,
  Runtime       TEXT,           -- e.g., "142 min"
  Genre         TEXT,           -- comma-separated
  IMDB_Rating   TEXT,
  Overview      TEXT,
  Meta_score    TEXT,
  Director      TEXT,
  Star1         TEXT,
  Star2         TEXT,
  Star3         TEXT,
  Star4         TEXT,
  No_of_Votes   TEXT,
  Gross         TEXT            -- e.g., "$44,008,000" or empty
);
```


We can check that the table exists with

```sql
.tables
```

and check the schema with

```sql
.schema
```

And we can import the data with

```sql
.mode csv
.import imdb_top_1000_no_header.csv imdb_raw
```

> we need to remove the header row from the csv before importing it. so here iI've used a no header version of the dataset.

> to see the results with columns as lines, change the mode : `.mode lines`s

Let's check what we have with 2 queries

```sql
SELECT * FROM imdb_raw LIMIT 5;
```


And the title

```sql
SELECT Series_Title FROM imdb_raw LIMIT 5;
```

How many rows do we have

```sql
SELECT COUNT(*) FROM imdb_raw;
```

This should return 1000.

---
<TitleSlide>

# Primary keys & data types

All columns have text for type for now. We need to change that

</TitleSlide>
---

# SQlite is limited on DML

What SQLite CAN'T do with ALTER TABLE:

- DROP COLUMN (only added in version 3.35.0, 2021)
- ADD CONSTRAINT (foreign keys, checks)
- DROP CONSTRAINT
- ALTER COLUMN (change data type, add/remove NOT NULL)
- RENAME COLUMN (only added in version 3.25.0, 2018)

---

# How you would do it in postgresql or mysql

```sql
ALTER TABLE imdb
ALTER COLUMN IMDB_Rating TYPE FLOAT USING IMDB_Rating::FLOAT;
```

---

# adding a primary key in postgres

```
ALTER TABLE imdb
ADD PRIMARY KEY (id);
```


---

we need to be able to identify each row uniquely.

This is the role of the **primary key**.

Each table should have a primary key.

It's an auto *incrementing* integer that is **unique** to each row.


in our case, working with sqlite, creatig the primary key is a bit complex. we leave it for now.

in standard sql, like postgresql, adding the key would take 2 steps

1. create the column

```
ALTER TABLE imdb_raw
ADD COLUMN raw_id SERIAL;
```

2. make it the primary key

```
ALTER TABLE imdb_raw
ADD PRIMARY KEY (raw_id);
```

---

# Explore the dataset that we have

```sql
SELECT     -- What columns?
FROM       -- What table?
WHERE      -- What rows?
```
to which we can add:

```
ORDER BY   -- What order?
LIMIT      -- How many?
```

and finally  (out of the scope of this course)

```
GROUP BY   -- How to group?
HAVING     -- Filter groups?
```

---

# types

we imported all the data as text.

we want to change the types of some columns.

- Released_Year → INTEGER
- Runtime → INTEGER (remove " min")
- IMDB_Rating → REAL
- Meta_score → INTEGER
- No_of_Votes → INTEGER



---
<TitleSlide>

# Normalization

</TitleSlide>
---

# Normalization

- actors: create one table with actors, and one join many to many table because movies have many actors

- genres: we can create a table with genres, and one join many to many table because movies have many genres

- directors: we can create a table with directors, and one join many to one table because movies have one director


---

# SQL

<div class="boom">
The sequence of sql statements to add a primary key, chage datatypes and normalize the dataset is available [here](/ipsadb/imdb/)
</div>

---

# Projection

when we select a set of columns and not all the columns we are doing a **projection**

```sql
select * from imdb_raw -- returns all the columns
```

whereas

```sql
select Series_Title, Released_Year from imdb_raw -- returns only the Series_Title and released year column
```

we can apply functions to the columns during the filtering


for instance let's calculate some stats on the IMDB rating

```sql
select avg(IMDB_Rating), max(IMDB_Rating), min(IMDB_Rating) from imdb_raw;
```





---
# Filtering

when we select a set of rows and not all the rows we are doing a **filtering**

```sql
select Series_Title from imdb_raw where IMDB_Rating > 8;
```
we can use multiple conditions

```sql
select Series_Title
from imdb_raw
where IMDB_Rating > 8
AND Released_Year > 2000;
```

```sql
select Series_Title
from imdb_raw
where IMDB_Rating > 8
OR Released_Year > 2000;
```




