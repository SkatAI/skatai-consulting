---
layout: slides
title: "Relational databases - Install postgresql on Mac and Windows"
slides_project_home: /dbsql/
footer: 'Alexis Perrier - Skatai.com - Install - https://discord.gg/DDbh5AyHYH'
---
<TitleSlide>

# Installing postgresql

</TitleSlide>
---

# My setup (recommended)

I work in the terminal on the command line

with `postgresql` installed and running in the background

and use `psql` and related postgresql command `pgdump` `pg_restore` `createdb`, ...


## Alternative

Use a UI interface `pgAdmin`.

- no terminal hurdle, easier to get started
- but I can never remember where to click.

---
# Prerequisites

- good grasp of the terminal. On windows there's many different types of terminals. very confusing. use `wsl` or ??? with **admin** permissions.
- you should be able to set the `PATH` environment variable.

---

# all you need to know


- Install PostgresQL 16 on Local

[https://www.postgresql.org/download/](https://www.postgresql.org/download/)

[https://www.enterprisedb.com/downloads/postgres-postgresql-downloads](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

- for mac: use brew and follow [https://atlassc.net/2024/03/11/installing-postgresql-on-macos-with-homebrew](https://atlassc.net/2024/03/11/installing-postgresql-on-macos-with-homebrew)
- for Windows : [https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/)


---

## Windows

I wrote a  detailled step by step guide for windows users here:

[dbsql/installing_on_windows/](/courses/dbsql/dbsql_install/)


## PgAdmin

for mac: [https://www.postgresql.org/download/macosx/](https://www.postgresql.org/download/macosx/)

or [https://postgresapp.com/](https://postgresapp.com/)

## Postico

for mac: [https://eggerapps.at/postico/](https://eggerapps.at/postico/)

---

# Goal

make sure you know how to

- start and stop `postgres`
    - `brew services start postgresql@16`
    - `brew services stop postgresql@16`
- check that `postgres` is running with
    - `launchctl list | grep postgres`
- connect with `psql` in the terminal
    - `psql -U postgres | your_local_username`
- list users with `\du` : you should see 1 or 2 users
    - `postgres`
    - your own name

---
<TitleSlide>

# Meta commands

`\`

</TitleSlide>
---

# list databases, tables, users etc

Postgresql has a specific syntax to list databases, tables, users etc, all start with `\`


```sql
\l # list databases
\c <database_name># connect to a database
\du # list users
```

and
```
\d # list all tables, views, sequences
\dt # list tables
\d <table_name> # shows columns of a specific table
```

```sql
\df # list functions
\dn # list schemas
\dv # list views
```

and most important (a bit like exiting `vim`):

```
\q # quit
```

https://commandprompt.com/education/postgresql-basic-psql-commands/


---

# Practice

take a few minutes to go through this tutorial

[https://tomcam.github.io/postgres/](https://tomcam.github.io/postgres/)

---

# Pgadmin

this seems like a good walkthrough for windows (screenshots are windows)

[https://www.tpointtech.com/connect-to-a-postgresql-database-server](https://www.tpointtech.com/connect-to-a-postgresql-database-server)


and this for both mac and windows

[https://neon.com/postgresql/postgresql-getting-started/connect-to-postgresql-database#2-connect-to-postgresql-database-server-using-pgadmin](https://neon.com/postgresql/postgresql-getting-started/connect-to-postgresql-database#2-connect-to-postgresql-database-server-using-pgadmin)


---

# EOD

- check if postgres is running with `launchctl list | grep postgres` or `brew services list`
- start | stop it with `brew services start | stop postgresql@16`
- create a database
    - use `createdb` in the terminal
    - or in pgadmin
- connect to a local database ( `psql` | pgadmin  )


---

# Next

[Wrapup](/courses/dbsql/dbsql_wrapup/)