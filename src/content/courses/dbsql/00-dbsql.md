---
layout: default_en
title:  "Relational databases"
page_title:  "Relational databases"
summary: "A course in intermediate databases and postgresql"
slides_project_home: /courses/dbsql/
---

A course in intermediate databases and postgresql taught at Epita

**Day 1**: why databases, why postgresql, install

- [welcome](/courses/dbsql/dbsql_welcome/)
- [install](/courses/dbsql/dbsql_install/)
- [wrap up](/courses/dbsql/dbsql_wrapup/)

**Day 2**: postgresql configuration files, RDBMS Architecture, SQL overview, load a dataset, basic queries recap,

- [postgres server](/courses/dbsql/dbsql_server/)
- [RDBMS & SQL](/courses/dbsql/rdbms/)
- [loading dataset](/courses/dbsql/dbsql_loading_dataset/)
- [wrap up](/courses/dbsql/dbsql_wrapup-2/)

**Day 3**: SQL, Query basics, ACID, practice in IMDB and trees

- [SQL Queries - Explore IMDB](/courses/dbsql/select_imdb/)

**Day 4**: OLAP vs OLTP, Normalization, Anomalies, normal forms,

- [OLAP vs OLTP + normalization + anomalies](/courses/dbsql/database-design-normalization/)

**Day 5**: Normalization practice

- [Practice: Improve trees](/courses/dbsql/dbsql_improve_trees/)
- [Practice: Normalization Trees dataset](/courses/dbsql/normalize-treesdb/)
- [Practice: Normalization Trees dataset - solution](/courses/dbsql/normalize-treesdb_solution/)

<!--
More practice on normalization:
- [Practice: Normalization WorldHits dataset](/courses/dbsql/normalization_lab/)
 -->
**Day 6**: windows functions

- [Window Functions and CTEs Introduction](/courses/dbsql/window-fct-cte_intro/)
- [Windows functions](/courses/dbsql/window-functions/)
- [Windows functions exercises](/courses/dbsql/02_window-functions_lab/)
- [Windows functions exercises - solution](/courses/dbsql/worklab-window-fct-cte-treesdb_normalized_solution/)

**Day 7**: CTEs

- [CTEs](/courses/dbsql/ctes-with-clause/)
- [CTEs Lab](/courses/dbsql/worklab-window-fct-cte-treesdb_normalized/)
- [CTEs Lab - solution](/courses/dbsql/worklab-window-fct-cte-treesdb_normalized_solution/)

**Day 8** [10/09]: Query performances

- [Query performance intro](/courses/dbsql/explain-scans_intro/)
- [SQL and Relational Algebra](/courses/dbsql/sql_relational_algebra/)
- [Query performance - Explain - Scans](/courses/dbsql/explain_query_performance/)
- [More on Bitmap Heap and Index Scans - pg_stats table](/courses/dbsql/extra_content_bitmap/)

**Day 9** [10/10]: Graded worksheet

- normalization
- Window functions
- CTEs

- [graded worksheet](/courses/dbsql/ademe_worksheet/)

**Day 10** [10/17]: indexes, query optimizer, EXPLAIN, scan algorithms, energy database

- [Database Indexes Introduction](/courses/dbsql/indexes_intro/)

- [Review with the Database Scan Algorithms Quiz](/courses/dbsql/algorithms_quiz/)

- [Database Indexes Implementation](/courses/dbsql/indexes/)

- [Indexing Practice Lab](/courses/dbsql/lab-on-indexes/)

**Day 11** [10/23]: views, PL/pgSQL, functions, triggers, stored procedures


- [Views and Functions Introduction](/courses/dbsql/views_functions_pslsql_intro/)
- [PostgreSQL Views](/courses/dbsql/views/)

- [Views Exercise](/courses/dbsql/views_exercise/)
- [Views Exercise Solutions](/courses/dbsql/views_exercise_solution/)

- [SQL Functions COALESCE and Strings](/courses/dbsql/sql-functions/)
- [SQL Functions Solutions](/courses/dbsql/sql-functions_solutions/)

**Day 12** [10/24]: function design, PL/pgSQL, BAN API, HTTP extension

- [PL/pgSQL Functions](/courses/dbsql/plpgsql-functions/)
- [SHA256 Functions Worksheet](/courses/dbsql/functions_worksheet/)
- [Writing Scalable Functions](/courses/dbsql/writing-functions/)

**Day 13** [10/31]: transactions, ACID, triggers, authentication, roles

- [Installing HTTP Extension Windows](/courses/dbsql/install-http-ext-windows11/)
- [BAN API Integration Workshop](/courses/dbsql/functions_worksheet_ban_api/)


**Day 14** [11/07]: Big Query

- [BigQuery](/courses/dbsql/bigquery/)
- [SQL anti patterns](/courses/dbsql/sql_anti_patterns/)
- [New york trees](/courses/dbsql/new_york_trees/)



see also:


- [Database Triggers and Procedures](/courses/dbsql/triggers-procedures/)
- [PostgreSQL Authentication](/courses/dbsql/authentication/)
- [PostgreSQL Roles Management](/courses/dbsql/roles/)

**Day 15** [11/10]: graded exam on the New York trees dataset

- [Exam New york trees](/courses/dbsql/new_york_trees_exam/)
