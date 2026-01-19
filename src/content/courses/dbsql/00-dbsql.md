---
layout: default_en
title:  "Relational databases"
page_title:  "Relational databases"
summary: "A course in intermediate databases and postgresql"
slides_project_home: /dbsql/
---

# Relational databases - SQL and postgresql

**Day 1**: why databases, why postgresql, install

- [welcome](/dbsql/welcome/)
- [install](/dbsql/install/)
- [wrap up](/dbsql/S01-wrapup/)

**Day 2**: postgresql configuration files, RDBMS Architecture, SQL overview, load a dataset, basic queries recap,

- [postgres server](/dbsql/postgres-server-config-files/)
- [RDBMS & SQL](/dbsql/RDBMS_SQL/)
- [loading dataset](/dbsql/loading_dataset/)
- [wrap up](/dbsql/S02-wrapup/)

**Day 3**: SQL, Query basics, ACID, practice in IMDB and trees

- [SQL Queries - Explore IMDB](/dbsql/explore_imdb/)

**Day 4**: OLAP vs OLTP, Normalization, Anomalies, normal forms,

- [OLAP vs OLTP + normalization + anomalies](/dbsql/normalization/)

**Day 5**: Normalization practice

- [Practice: Improve trees](/dbsql/improve_trees/)
- [Practice: Normalization Trees dataset](/dbsql/normalization_trees/)
- [Practice: Normalization Trees dataset - solution](/dbsql/normalization_trees_solution/)

<!--
More practice on normalization:
- [Practice: Normalization WorldHits dataset](/dbsql/normalization_lab/)
 -->
**Day 6**: windows functions

- [Window Functions and CTEs Introduction](/dbsql/window_ctes_intro/)
- [Windows functions](/dbsql/windows_functions/)
- [Windows functions exercises](/dbsql/window_lab/)
- [Windows functions exercises - solution](/dbsql/window_trees_normalized_lab_solutions/)

**Day 7**: CTEs

- [CTEs](/dbsql/ctes/)
- [CTEs Lab](/dbsql/window_ctes_trees_normalized_lab/)
- [CTEs Lab - solution](/dbsql/ctes_trees_v03_normalized_lab_solution/)

**Day 8** [10/09]: Query performances

- [Query performance intro](/dbsql/S06_intro/)
- [SQL and Relational Algebra](/dbsql/sql_relational_algebra/)
- [Query performance - Explain - Scans](/dbsql/explain_query_performance/)
- [More on Bitmap Heap and Index Scans - pg_stats table](/dbsql/bitmap_scans/)

**Day 9** [10/10]: Graded worksheet

- normalization
- Window functions
- CTEs

- [graded worksheet](/dbsql/worldhitsdb-graded-worksheet/)

**Day 10** [10/17]: indexes, query optimizer, EXPLAIN, scan algorithms, energy database

- [Database Indexes Introduction](/dbsql/indexes_intro/)

- [Review with the Database Scan Algorithms Quiz](/dbsql/algorithms_quiz/)

- [Database Indexes Implementation](/dbsql/indexes/)

- [Indexing Practice Lab](/dbsql/indexes_lab/)

**Day 11** [10/23]: views, PL/pgSQL, functions, triggers, stored procedures


- [Views and Functions Introduction](/dbsql/views_functions_intro/)
- [PostgreSQL Views](/dbsql/views/)

- [Views Exercise](/dbsql/views_exercise/)
- [Views Exercise Solutions](/dbsql/views_solutions/)

- [SQL Functions COALESCE and Strings](/dbsql/sql_functions/)
- [SQL Functions Solutions](/dbsql/sql_functions_solutions/)

**Day 12** [10/24]: function design, PL/pgSQL, BAN API, HTTP extension

- [PL/pgSQL Functions](/dbsql/plpgsql_functions/)
- [SHA256 Functions Worksheet](/dbsql/sha256_worksheet/)
- [Writing Scalable Functions](/dbsql/writing_functions/)

**Day 13** [10/31]: transactions, ACID, triggers, authentication, roles

- [Installing HTTP Extension Windows](/dbsql/http_extension_windows/)
- [BAN API Integration Workshop](/dbsql/ban_api_workshop/)


**Day 14** [11/07]: Big Query

- [BigQuery](/dbsql/bigquery/)
- [SQL anti patterns](/dbsql/sql_anti_patterns/)
- [New york trees](/dbsql/new_york_trees_dataset/)



see also:


- [Database Triggers and Procedures](/dbsql/triggers_procedures/)
- [PostgreSQL Authentication](/dbsql/authentication/)
- [PostgreSQL Roles Management](/dbsql/roles/)

**Day 15** [11/10]: graded exam on the New York trees dataset

- [Exam New york trees](/dbsql/new_york_trees_dataset_exam/)
