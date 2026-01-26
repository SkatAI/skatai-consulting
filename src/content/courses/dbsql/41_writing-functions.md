---
layout: slides
title: "Writing Scalable Functions"
page_title: "Writing Scalable Functions"
summary: "function design, PL/pgSQL, best practices, exception handling"
footer: 'Alexis Perrier - Skatai.com  https://discord.gg/DDbh5AyHYH'
---

# Writing functions

> some examples in this page are based on the Worldhits database. You can find it [here](/assets/db/worldhits_backup.sql). Restore in psql with

```sql
\i <path to the sql file>/worldhits_backup.sql
```

This will (re)create a database `worldhitsdb` and connect to it.

The database contains only one table called `tracks` with the following  schema

```sql
\d+ tracks
                                                                    Table "public.tracks"
      Column      |          Type          | Collation | Nullable |              Default               | Storage  | Compression | Stats target | Description
------------------+------------------------+-----------+----------+------------------------------------+----------+-------------+--------------+-------------
 id               | integer                |           | not null | nextval('tracks_id_seq'::regclass) | plain    |             |              |
 track            | character varying(255) |           |          |                                    | extended |             |              |
 artist           | character varying(255) |           |          |                                    | extended |             |              |
 album            | character varying(255) |           |          |                                    | extended |             |              |
 year             | integer                |           |          |                                    | plain    |             |              |
 duration         | integer                |           |          |                                    | plain    |             |              |
 time_signature   | integer                |           |          |                                    | plain    |             |              |
 danceability     | double precision       |           |          |                                    | plain    |             |              |
 energy           | double precision       |           |          |                                    | plain    |             |              |
 key              | integer                |           |          |                                    | plain    |             |              |
 loudness         | double precision       |           |          |                                    | plain    |             |              |
 mode             | integer                |           |          |                                    | plain    |             |              |
 speechiness      | double precision       |           |          |                                    | plain    |             |              |
 acousticness     | double precision       |           |          |                                    | plain    |             |              |
 instrumentalness | double precision       |           |          |                                    | plain    |             |              |
 liveness         | double precision       |           |          |                                    | plain    |             |              |
 valence          | double precision       |           |          |                                    | plain    |             |              |
 tempo            | double precision       |           |          |                                    | plain    |             |              |
 popularity       | integer                |           |          |                                    | plain    |             |              |
Indexes:
    "tracks_pkey" PRIMARY KEY, btree (id)
Access method: heap
```

---

## Context

In the last session, we started to write SQL functions and PL/pgSQL functions.

To start today's class I'd first like to go over

- General best practice to write functions
- Specifics of PL/pgSQL functions

---

# Functions that scale

> How would you define what is a well written function ?

We can look at 2 aspects to begin with **naming** and **single responsibility principle** (SRP)

---

## Naming

A good way to name function is to have its name that starts with an action verb followed by the name of the object it acts upon.

For instance

- retrieve_use_record
- count_hits
- convert_rows_to_json


Some additional best practices for naming functions:

- **Be specific**: Names should precisely describe the function's task.
- Use **consistent** terminology: Stick to a specific style or terminology throughout your codebase.
- **Avoid abbreviations**: Write full words to keep things clear unless abbreviations are universally understood in your team or project.
- **Length**: Aim for names that are long enough to be descriptive but not overly verbose.

---

### Single responsibility principle

The SRP comes down to :

> **A function has one job and one job only !**


- this facilitates comprehension
- this helps with writing automated tests
- this greatly reduces bugs and erratic behaviors


Don't

- extract data and transform it,
- log in a user and send an email,
- launch the video, update views counts, and generate subtitles,

 ... in the same function

Read more [about the SRP on wikipedia ](https://en.wikipedia.org/wiki/Single-responsibility_principle)

---

## How to write a good prompt ?

Which leads me to good **prompting** techniques

Working with an LLM can be frustrating and depressing. Not because the answers are wrong (might be when it comes to coding) but because if done without effort, lazily, it kills the pleasure we get from creative work.

Instead of simply asking a questions and copy pasting the answer, you need to really engage with the LLM.

Difference between

from ;
> What are best practices for naming functions?

to

> I'm looking into best practices to name a function in a high level programming language  (python, ... or even PL/pgSQL).
> For instance:
> - the function name starts with a **verb** followed by the name of the object it acts upon.
> What do you think ?


In short, for a good prmpt

- give context <- most important part of the prompt
- ask for review, opinion or feedback
- reword what you understood


What are your techniques for writing efficient prompts ?

---

## PL/pgSQL functions

### The structure of a PL/pgSQL function

The following sections are taken from [https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-block-structure/](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-block-structure/). Please refer to this site for further details.

---

#### Blocks

PL/pgSQL blocks have a structure that includes a **declaration section** (optional) and an **execution section** (mandatory). Inside a block, variables are declared first, followed by the logic executed. Blocks can be nested, with labels for referencing.

Example:

```sql
DO $$
DECLARE
    total_sales NUMERIC;
BEGIN
    SELECT SUM(amount) INTO total_sales FROM sales;
    RAISE NOTICE 'Total Sales: %', total_sales;
END $$;
```

Here, `total_sales` is declared, a query calculates the total sales, and the result is displayed using `RAISE NOTICE`.

---

#### Variables

In PL/pgSQL, variables are declared in the **declaration section** of a block and hold temporary data. You can initialize them upon declaration using `:=` or by copying another variable's data type using `%TYPE`. Variables can have different scopes depending on where they're declared.

Example:

```sql
CREATE OR REPLACE FUNCTION calculate_discount()
RETURNS NUMERIC AS $$
DECLARE
    total_sales NUMERIC := 0;
    discount NUMERIC;
BEGIN
    SELECT SUM(amount) INTO total_sales FROM sales;
    discount := total_sales * 0.1;
    RAISE NOTICE 'Total Sales: %, Discount: %', total_sales, discount;
    RETURN discount;
END $$
LANGUAGE plpgsql;
```

This declares and initializes variables and uses them in calculations.

---

#### Select INTO

In PL/pgSQL, the `SELECT INTO` statement assigns the result of a query to variables. This is useful when retrieving a single value or multiple columns into variables within a function. You can use `SELECT INTO` to process values and perform further calculations or return the result.

---

**Example**: Total Play Count for a Spotify Artist

```sql
CREATE OR REPLACE FUNCTION get_artist_popularity(artist_name TEXT)
RETURNS NUMERIC AS $$
DECLARE
    total_plays NUMERIC;
BEGIN
    SELECT SUM(popularity) INTO total_plays
    FROM tracks
    WHERE artist = artist_name;

    RAISE NOTICE 'Total plays for %: %', artist_name, total_plays;
    RETURN total_plays;
END $$
LANGUAGE plpgsql;
```

This function calculates the total play count for an artist in the Spotify database by selecting the sum of `play_count` for all tracks associated with the given artist name.

> you can see the code of a given function with `\sf`, for instance `\sf get_artist_play_count`

Call the function with

```sql
SELECT get_artist_popularity('Angelique Kidjo');
```

---

#### RECORD Types

In PL/pgSQL, **record types** allow you to handle rows of data without needing to define a fixed structure. A record can hold a row from any table or query, and its fields are dynamically assigned at runtime. You can use `%ROWTYPE` to copy the structure of a table.

This function retrieves the top artist by number of tracks from a Spotify-like database.

```sql
CREATE OR REPLACE FUNCTION get_top_artist()
RETURNS RECORD AS $$
DECLARE
    artist_record RECORD;
BEGIN
    SELECT artist, COUNT(*) as plays INTO artist_record
    FROM tracks
    GROUP BY artist
    ORDER BY plays DESC
    LIMIT 1;
    RETURN artist_record;
END $$
LANGUAGE plpgsql;
```

Call the function with

```sql
SELECT get_top_artist();
```

---
# returning a set of records

> the function get_top_artist only returns one record. Because the type of the returned value is RECORD.

If you want to return multiple records you must declare the returned type as SETOF RECORD.

```sql
CREATE OR REPLACE FUNCTION get_top_artists(n INT)
RETURNS SETOF RECORD AS $$
DECLARE
    artist_record RECORD;
BEGIN
    FOR artist_record IN
        SELECT artist, COUNT(*) AS plays
        FROM tracks
        GROUP BY artist
        ORDER BY plays DESC
        LIMIT n
    LOOP
        RETURN NEXT artist_record;
    END LOOP;
    RETURN; -- Important:  Indicates the end of the result set
END $$
LANGUAGE plpgsql;
```

A bit complex for what we need.

In fact this function errors out with

```bash
ERROR:  0A000: materialize mode required, but it is not allowed in this context
CONTEXT:  PL/pgSQL function get_top_artists(integer) line 12 at RETURN NEXT
LOCATION:  exec_init_tuple_store, pl_exec.c:3689
```

And I did not have time tto troubleshoot it.

---
# returnning a table / relation insetad

Simply return a relation instead of a set of records

```sql
CREATE OR REPLACE FUNCTION get_top_artist(n INT)
RETURNS TABLE (artist TEXT, plays BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT t.artist::TEXT, COUNT(*) AS plays
    FROM tracks t
    GROUP BY t.artist
    ORDER BY plays DESC
    LIMIT n;
END $$
LANGUAGE plpgsql;
```

> note the use of `::TEXT` to cast the artist name to text.


---


#### Declaring constant

To define a constant in PL/pgSQL, you use the following syntax:

```sql
constant_name CONSTANT data_type = expression;
```

---

# Naming Conventions in PL/pgSQL Functions

### Input Parameters:

- Prefix with `p_`: Prefix input parameter names with `p_` (for "parameter"). This clearly distinguishes them from column names and local variables within the function.


### Declared Variables:

- Prefix with `v_`: Prefix local variable names with `v_` (for "variable"). This helps to differentiate them from column names and input parameters.

### And

- Use descriptive names that clearly indicate the purpose of the variable.
- Use a consistent case style, such as lowercase with underscores (snake_case).



---

#### RAISE NOTICE and EXCEPTION

In PL/pgSQL, errors and messages are handled using `RAISE` to display notices, warnings, or errors. You can also use error-handling blocks with `EXCEPTION`. Messages provide valuable debugging information.

Here’s a function example

```sql
CREATE OR REPLACE FUNCTION calculate_streaming_revenue(p_artist_name VARCHAR(255))
RETURNS NUMERIC AS $$
DECLARE
    v_total_revenue NUMERIC := 0;
BEGIN
    BEGIN
        SELECT SUM(popularity * 0.003) INTO v_total_revenue -- popularity as proxy for streams and a fixed revenue per stream
        FROM tracks t
        WHERE t.artist = p_artist_name;

        IF v_total_revenue IS NULL THEN
            RAISE NOTICE 'No streams found for artist: %', p_artist_name;
            RETURN 0;
        ELSE
            RAISE NOTICE 'Total Revenue for Artist %: %', p_artist_name, v_total_revenue;
            RETURN v_total_revenue;
        END IF;

    EXCEPTION
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Error calculating revenue for artist %', p_artist_name;
    END;
END $$
LANGUAGE plpgsql;
```



This function
- calculates an artist’s total streaming revenue and raises a message if no streams are found.
- uses an error handler that raises an exception if any unforeseen error occurs during the calculation process.

for instance

```sql
SELECT calculate_streaming_revenue('Angelique Kidjo');
```

> Note : The `LOCATION: exec_stmt_raise, pl_exec.c:3925` in the NOTICE output of the function isn't an error. It's simply part of the informational message generated by the RAISE NOTICE statement in the PL/pgSQL function. PostgreSQL includes the location in the source code where the RAISE NOTICE statement was executed to aid in debugging, if needed.

---

#### If Then Else

In PL/pgSQL, `IF-THEN-ELSE` statements allow conditional logic. You can check conditions and perform different actions depending on the result.

Example:

```sql
CREATE OR REPLACE FUNCTION get_artist_popularity(p_artist_name VARCHAR(255))
RETURNS TEXT AS $$
DECLARE
    v_max_popularity INT;
BEGIN
    SELECT MAX(popularity) INTO v_max_popularity
    FROM tracks
    WHERE artist = p_artist_name;

    IF v_max_popularity IS NULL THEN
        RETURN 'Artist not found';
    ELSIF v_max_popularity > 80 THEN
        RETURN 'Very Popular';
    ELSIF v_max_popularity > 50 THEN
        RETURN 'Moderately Popular';
    ELSE
        RETURN 'Less Popular';
    END IF;
END $$
LANGUAGE plpgsql;
```

This function returns an artist's popularity description based on their popularity score.

```sql
SELECT get_artist_popularity('Angelique Kidjo');
```

---
# OOOPS

we how have multiple functions with the same name: `get_artist_popularity`. but taking fifferent parameters type although very similar (both strings).

```sql
 Schema |         Name          | Result data type |       Argument data types       | Type
--------+-----------------------+------------------+---------------------------------+------
 public | get_artist_popularity | numeric          | artist_name text                | func
 public | get_artist_popularity | text             | p_artist_name character varying | func
```

we can either remove one of the functions or make sure we call the right function with the right parameters by casting the string to the right type.

```sql
SELECT get_artist_popularity('Angelique Kidjo'::text);
```
returns

```bash
 get_artist_popularity
-----------------------
                   211
(1 row)
```


while the new function

```sql
SELECT get_artist_popularity('Angelique Kidjo'::character varying);
```
returns

```bash
 get_artist_popularity
-----------------------
 Less Popular
(1 row)
```


---

#### Looping

In PL/pgSQL, loops allow you to repeat actions multiple times. You can use basic loops, `FOR`, `WHILE`, and `EXIT` to control the flow.

Example:

```sql
CREATE OR REPLACE FUNCTION get_top_streams(p_artist_id INT)
RETURNS INT AS $$
DECLARE
    v_total_streams INT := 0;
    v_track RECORD;
BEGIN
    FOR v_track IN SELECT streams FROM tracks t join artists a on a.id = t.artist_id WHERE a.id = p_artist_id LOOP
        v_total_streams := v_total_streams + v_track.streams;
    END LOOP;
    RETURN v_total_streams;
END $$
LANGUAGE plpgsql;
```

This function loops through an artist's tracks to calculate the total streams.

---

### Function overloading

In PL/pgSQL, function overloading allows you to create multiple functions with the same name but different parameter types or numbers. PostgreSQL automatically selects the appropriate function based on the provided arguments.

Example:

```sql
CREATE OR REPLACE FUNCTION get_artist_revenue(p_artist_id INT)
RETURNS NUMERIC AS $$
BEGIN
    RETURN (SELECT SUM(streams * revenue_per_stream) FROM tracks WHERE artist_id = p_artist_id);
END $$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_artist_revenue(p_artist_name TEXT)
RETURNS NUMERIC AS $$
BEGIN
    RETURN (SELECT SUM(streams * revenue_per_stream) FROM tracks WHERE artist = p_artist_name);
END $$
LANGUAGE plpgsql;
```

This example overloads the `get_artist_revenue` function to accept either an artist's ID or name.


---

## Naming parameters and variables

In PL/pgSQL, using prefixes like `v_` for variables and `p_` for parameters helps distinguish between the two and makes the code more readable. This convention avoids confusion when variables and parameters have similar names, making it clear which are local to the function and which are passed in.

For example:

- `v_total_sales` for a variable holding total sales.
- `p_artist_id` for a function parameter representing an artist's ID.

Other common prefixes include `r_` for records and `c_` for constants.


---

# Practice

Let's write the function or set of functions that creats the hash from the tree attributes.

For the sake of simplicity we will use the non normalized version of the `treesdb`: `treesdb_v02`

- available [here: treesdb_v02.sql](/assets/db/treesdb_v02.sql)
- restore in a psql session with `\i <path>/treesdb_v02.sql`
- Then connect to `treesdb_v02` database on your local

---
# Goal


The goal is to create a sha256 generated hash string for each tree using a concatenation of some of its attributes:  genre, varieties, species, and longitude and latitude (geolocation[0], geolocation[1])

We write a series of functions. Each with a unique task

- concatenate tree attributes
- generate the hash string
- inserts the has string into a new column

---

## Viewing existing functions

You can view the functions you created and their input types with `\df`

and their definition with `\sf <function_name>`

---

## concatenation

First write a function that concatenates the tree attributes: genre, species, variety, lon, lat





```sql
CREATE OR REPLACE FUNCTION concat_tree_attributes(p_tree_id integer)
RETURNS text AS
$$
DECLARE
    -- declare all your variables here
    v_concatenated_text text;
    -- ...

BEGIN
    -- Fetch the tree attributes, write the select query unsing coalesce to replace null values with 'UNK'
    -- use INTO to store the values in the variables
    -- use CAST(geolocation[0] AS text) to convert the longitude to text


    -- Concatenate the attributes with '-' and replace spaces with '_'
    -- ...

    RETURN v_concatenated_text;
END;
$$
LANGUAGE plpgsql;
```

In this function, identify

- the `RETURNS` data type declaration
- the `$$`
- the declaration of internal variables
- in the select statement, the `INTO`
- how we split the calls to concat and REPLACE over 2 lines instead of chaining them ?

---

### Test test test and test again

It's important to always test your functions.

At least on a few examples. Take a random `tree_id` and look at the output of the function.

```sql
select concat_tree_attributes(88);
                concat_tree_attributes
-------------------------------------------------------
 Prunus-UNK-Kanzan-2.387247686120145-48.86610339939845
```

ok now the second function. But first let's check that the sha256 extension is installed

---

## Activate Extension

The sha256 function is part of the `pgcrypto` extension

You can list installed extension with

```sql
\dx
```

On `treesdb_v02` you should just see PL/pgSQl.

```sql
\dx
                 List of installed extensions
  Name   | Version |   Schema   |         Description
---------+---------+------------+------------------------------
 plpgsql | 1.0     | pg_catalog | PL/pgSQL procedural language
```

---

Activate the `pgcrypto` extension with

```sql
CREATE EXTENSION pgcrypto;
```

and now it's listed

```sql
\dx
                  List of installed extensions
   Name   | Version |   Schema   |         Description
----------+---------+------------+------------------------------
 pgcrypto | 1.3     | public     | cryptographic functions
 plpgsql  | 1.0     | pg_catalog | PL/pgSQL procedural language
 ```

To list all extensions available for installation

```sql
select * from pg_available_extensions order by name;
```

which returns

```bash
        name        | default_version | installed_version |                  comment
--------------------+-----------------+-------------------+--------------------------------------------------
 adminpack          | 2.1             | [null]            | administrative functions for PostgreSQL
 amcheck            | 1.3             | [null]            | functions for verifying relation integrity
 autoinc            | 1.0             | [null]            | functions for autoincrementing fields
 bloom              | 1.0             | [null]            | bloom access method - signature file based index
 ...
```

---

## generate hash

as we've seen, you should combine the `digest` and `encode` functions to generate a hash.

as such

```sql
encode(digest(<some text>, 'sha256'), 'hex');
```


```sql
CREATE OR REPLACE FUNCTION generate_sha256_hash(p_input_text text)
RETURNS text AS
$$
DECLARE
    v_hashed_text text;
BEGIN
    -- Generate SHA-256 hash and convert it to a hexadecimal string
    -- ...

    RETURN v_hashed_text;
END;
$$
LANGUAGE plpgsql;

```

Note

- the name and type of the input parameter
- the data type that is returned

---

### again: test test test

Your function should return:

```sql
select generate_sha256_hash('hello world');
                       generate_sha256_hash
------------------------------------------------------------------
 b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9
```


### Create a new column in the trees table


simply done with

```sql
alter table trees add column hash text;
```

### and insert the hash into the column

Given a tree id and its hash, the last function inserts the hash into the corresponding tree



