---
layout: prose
title: "Postgresql Query performance - Explain - Scans"
page_title: "SQL and relational Algebra"
summary: "SQL and relational Algebra"
footer: 'Alexis Perrier - Skatai.com'
---

# Scope

In this lesson we look at

- how SQL relates to relational algebra (and why we call them relational databases)
- assessing and improving query performance with the use of the EXPLAIN command and indexes.

## The _relation_ in _Relational database_

Relational database come from **relational algebra** theory.

A small example:

* A and B are _sets_ of objects: for instance A = {1,2,3}, B = {a,b,c}
* _tuples_ are combination of elements of these objects : (1,a), (1,b), …, (3, c)

In that context, a database **table** is a **subset** of all the possible combinations of the values of its columns. (in our case above with 2 sets of 3 elements each, we get 9 elements in total)

For instance, a _table_ with columns A and B that can respectively take the values {1,2,3} and {a,b,c} is :

```
| A   | B   |
| --- | --- |
| 1   | c   |
| 1   | b   |
| 3   | a   |
| 2   | b   |
```

# Relations Producing Relations: The Closure Property

One important concept from relation theory, is that

> an **operation** on a **relation** produces ... another **relation**!

This is called the **CLOSURE** property

When you query a table, the result is another table (a relation). This is fundamental to why SQL works the way it does.

## Why This Matters

### 1. **You can chain operations**

Because the output is always a relation, you can use it as input for another operation:

```sql
-- Each step produces a relation (table-like result)
SELECT * FROM trees              -- produces a relation
WHERE height > 15                -- produces a relation
ORDER BY circumference DESC      -- produces a relation
LIMIT 10;                        -- produces a relation
```

### 2. **Subqueries work naturally**

Since a query returns a relation, you can use it wherever you would use a table:

```sql
-- The subquery returns a relation, so we can query it like a table
SELECT arrondissement, avg_height
FROM (
    SELECT
        l.arrondissement,
        AVG(t.height) as avg_height
    FROM trees t
    JOIN locations l ON t.location_id = l.id
    GROUP BY l.arrondissement
) AS arrond_heights
WHERE avg_height > 20;
```

### 3. **CTEs are just named relations**

```sql
WITH tall_trees AS (              -- produces a relation
    SELECT * FROM trees
    WHERE height > 20
),
remarkable_tall_trees AS (        -- operates on a relation, produces a relation
    SELECT * FROM tall_trees
    WHERE remarkable = true
)
SELECT * FROM remarkable_tall_trees;  -- operates on a relation
```

## Another Example

- Step 1: Query trees → produces a RELATION

```sql
SELECT id, height, circumference
FROM trees
WHERE height IS NOT NULL;
```

This result IS A TABLE with columns: id, height, circumference

We can treat it like any other table!

- Step 2: Use that relation as input

```sql
WITH tree_measurements AS (
    SELECT id, height, circumference
    FROM trees
    WHERE height IS NOT NULL
)
-- Now query this relation like it's a regular table
SELECT
    COUNT(*) as tree_count,
    AVG(height) as avg_height,
    MAX(circumference) as max_circumference
FROM tree_measurements;
```

---

## What Makes It a "Relation"?

A relation has:
- **Rows** (tuples) - individual records
- **Columns** (attributes) - defined structure
- **No duplicate rows** (in theory, though SQL allows duplicates)
- **No inherent order** (though we can sort for display)

## Why "Closure" Matters

**Closure** means:
- Input: Relation(s)
- Operation: SELECT, JOIN, UNION, etc.
- Output: Always a Relation

This creates a **composable system** where you can build complex queries from simple parts:

```sql
-- Each WITH clause: relation → operation → relation
WITH
-- Relation 1: Large trees
large_trees AS (
    SELECT * FROM trees WHERE height > 25
),
-- Relation 2: Remarkable large trees (operates on relation 1)
remarkable_large AS (
    SELECT * FROM large_trees WHERE remarkable = true
),
-- Relation 3: With location info (operates on relation 2)
with_locations AS (
    SELECT
        r.*,
        l.arrondissement
    FROM remarkable_large r
    JOIN locations l ON r.location_id = l.id
)
-- Final operation on relation 3
SELECT
    arrondissement,
    COUNT(*) as remarkable_large_count
FROM with_locations
GROUP BY arrondissement;
```

## Contrast with Non-Relational Operations

If operations didn't return relations, you couldn't chain them:

```
❌ If SELECT returned just a number → can't join it
❌ If GROUP BY returned a list → can't filter it
✅ All operations return relations → infinitely composable
```


The **closure property** (operations on relations produce relations) is what makes SQL:
1. **Composable** - chain operations together
2. **Flexible** - use query results anywhere you'd use a table
3. **Powerful** - build complex queries from simple building blocks

> Every `SELECT`, `JOIN`, `WHERE`, `GROUP BY`, etc. takes relations as input and produces a relation as output. This is the foundation of relational algebra and why CTEs, subqueries, and views all work seamlessly together.


---

# Depth and Width in SQL SELECT Queries

## The Two Dimensions of a Relation (Table)

Every table has **two dimensions**:

1. **Depth** = Number of **rows** (records/tuples)
2. **Width** = Number of **columns** (attributes/fields)

## Visual Representation

```
           ← WIDTH (columns) →
      ┌────┬────────┬────────┬───────────┐
      │ id │ height │ circum │ remarkable│
      ├────┼────────┼────────┼───────────┤
↑     │ 1  │   15   │  120   │  false    │
│     │ 2  │   22   │  180   │  true     │
DEPTH │ 3  │   18   │  150   │  false    │
(rows)│ 4  │   25   │  200   │  true     │
│     │ 5  │   12   │  100   │  false    │
↓     └────┴────────┴────────┴───────────┘
```


## Depth: Filtering Rows with WHERE

**Depth filtering** reduces the **number of rows** by applying conditions.

```sql
-- Original: 100,000 trees (depth = 100,000)
SELECT * FROM trees;

-- Filtered depth: Only tall trees (depth = ~20,000)
SELECT * FROM trees
WHERE height > 20;

-- Further filtered depth (depth = ~5,000)
SELECT * FROM trees
WHERE height > 20 AND remarkable = true;
```

**Result**: Fewer rows, same columns

Before (depth = 5):

```
┌────┬────────┬────────┬───────────┐
│ id │ height │ circum │ remarkable│
├────┼────────┼────────┼───────────┤
│ 1  │   15   │  120   │  false    │
│ 2  │   22   │  180   │  true     │
│ 3  │   18   │  150   │  false    │
│ 4  │   25   │  200   │  true     │
│ 5  │   12   │  100   │  false    │
└────┴────────┴────────┴───────────┘
```

After `WHERE height > 20` => depth = 2:

```
┌────┬────────┬────────┬───────────┐
│ id │ height │ circum │ remarkable│
├────┼────────┼────────┼───────────┤
│ 2  │   22   │  180   │  true     │
│ 4  │   25   │  200   │  true     │
└────┴────────┴────────┴───────────┘
```

## Width: Selecting Columns

**Width filtering** reduces the **number of columns** by specifying which attributes to include.

```sql
-- Full width: all columns (width = 11)
SELECT * FROM trees;

-- Reduced width: only 3 columns (width = 3)
SELECT id, height, circumference FROM trees;

-- Minimal width: just 1 column (width = 1)
SELECT height FROM trees;
```

**Result**: Same rows, fewer columns

Before (width = 4):

```
┌────┬────────┬────────┬───────────┐
│ id │ height │ circum │ remarkable│
├────┼────────┼────────┼───────────┤
│ 1  │   15   │  120   │  false    │
│ 2  │   22   │  180   │  true     │
│ 3  │   18   │  150   │  false    │
└────┴────────┴────────┴───────────┘
```

After SELECT id, height (width = 2):

```
┌────┬────────┐
│ id │ height │
├────┼────────┤
│ 1  │   15   │
│ 2  │   22   │
│ 3  │   18   │
└────┴────────┘
```


## Combining Depth × Width

A complete SELECT query creates a **subset in both dimensions**:

```sql
-- Reduce BOTH depth and width
SELECT id, height, circumference        -- ← WIDTH: 3 columns
FROM trees
WHERE height > 20 AND remarkable = true -- ← DEPTH: filtered rows
LIMIT 10;                               -- ← DEPTH: further limit
```

## Key Takeaways

1. **Depth (rows)** is controlled by:
   - `WHERE` clauses
   - `LIMIT`
   - `JOIN` conditions
   - `HAVING` (after GROUP BY)

2. **Width (columns)** is controlled by:
   - Column list in `SELECT`
   - Using `*` vs specific columns

3. **Every SELECT produces a subset**:
   - Subset of rows (depth filtering)
   - Subset of columns (width filtering)
   - Or both

4. **Optimization**: Select only what you need
   - Fewer columns = less data transfer
   - Fewer rows = faster processing

> Select only what you need

## Relational Algebra Terminology

- **Depth filtering (rows)** = **Selection** operation ($\sigma$)
- **Width filtering (columns)** = **Projection** operation ($\pi$)


> This is why SQL is based on **relational algebra**
> SQL is about creating subsets of relations in two dimensions!


----

## SQL is a declarative language

> Relational algebra is what makes SQL a declarative language

## What "Declarative" Means

**You describe WHAT you want, not HOW to get it**

You say: "Give me tall remarkable trees"

```sql
SELECT height, circumference
FROM trees
WHERE height > 20 AND remarkable = true;
```

You don't say:
- ❌ "Loop through each tree"
- ❌ "Check if height > 20"
- ❌ "If true, add to results array"
- ❌ "Return the array"

### vs Imperative (Python, JavaScript, etc.)

**You describe HOW to do it, step by step**

You write the exact steps

```python
results = []
for tree in trees:
    if tree.height > 20 and tree.remarkable == True:
        results.append({
            'height': tree.height,
            'circumference': tree.circumference
        })
return results
```

SQL is declarative **because** it operates on relations (tables):

1. **Relations are sets** - no order, no duplicates (in theory, see below)
2. **Operations on sets are mathematical** - they describe transformations, not procedures
3. **The database engine decides HOW** - you just describe WHAT

**DECLARATIVE**: You describe the result you want

---

## Declarative Works with Relations

> Operations produce relations → composable → declarative

Because operations always return relations, you can describe complex queries declaratively:

```sql
-- Each part describes WHAT, not HOW
WITH tall_trees AS (
    SELECT * FROM trees WHERE height > 20     -- WHAT: tall trees
),
remarkable_tall AS (
    SELECT * FROM tall_trees WHERE remarkable = true  -- WHAT: remarkable ones
)
SELECT
    COUNT(*) as total,                        -- WHAT: count them
    AVG(circumference) as avg_circum          -- WHAT: average circumference
FROM remarkable_tall;
```

**Imperative equivalent** would be:

HOW: step by step instructions

```python
tall_trees = []
for tree in all_trees:
    if tree.height > 20:
        tall_trees.append(tree)

remarkable_tall = []
for tree in tall_trees:
    if tree.remarkable:
        remarkable_tall.append(tree)

total = len(remarkable_tall)
sum_circum = 0
for tree in remarkable_tall:
    sum_circum += tree.circumference
avg_circum = sum_circum / total if total > 0 else 0
```


## Summary

**Depth × Width** and **Declarative** are connected concepts:

| Concept | What it means | Example |
|---------|---------------|---------|
| **Depth × Width** | The shape/size of results | "100 rows × 3 columns" |
| **Declarative** | How you express queries | "Give me X where Y" not "loop, check, add" |

**The connection:**
- SQL operates on **relations** (tables)
- Relations enable **set-based thinking**
- Set-based operations are naturally **declarative**
- You describe the **WHAT** (depth × width of results)
- Database figures out the **HOW** (execution plan)


The **relational model** (operations on relations produce relations) enables the **declarative style** (describe what, not how), which lets you think in terms of **depth × width** (the shape of your result set) rather than procedural steps!



---

# Appendix: Why No Duplicates in Relational Algebra?

## The Mathematical Foundation

Relational algebra is based on **set theory**, and in mathematics, **sets cannot have duplicates by definition**.

```
Mathematical Set:
{1, 2, 3, 3, 4}  ❌ Not a valid set
{1, 2, 3, 4}     ✅ Valid set (no duplicates)

A set either contains an element or it doesn't.
You can't have "two copies" of the same element.
```

## What is a Relation in Theory?

A **relation** is defined as:
- A **set of tuples** (rows)
- Over a set of attributes (columns)

Since it's a **set**, by definition:
- Each tuple must be **unique**
- Order doesn't matter
- No duplicates allowed

## Why This Makes Sense Theoretically

### 1. **Identity and Meaning**

In relational theory, a tuple represents a **fact** or **proposition**.


> Trees relation represents facts:
> "There exists a tree with id=1, height=15, circumference=120"
> "There exists a tree with id=2, height=22, circumference=180"

**If you have duplicates**, what does it mean?

This doesn't make sense in relational theory:

```sql
id | height | circumference
---|--------|-------------
1  |   15   |    120
1  |   15   |    120       ← Same fact stated twice?
```

**Questions:**
- Does the same tree exist twice?
- Are there two identical trees?
- Is this a counting error?

The duplicate adds **no new information**: it's the same fact repeated.

### **Set Operations Should Work Cleanly**

Mathematical set operations (union, intersection, difference) assume no duplicates:

```
Set A = {1, 2, 3}
Set B = {2, 3, 4}

A ∪ B = {1, 2, 3, 4}        ✅ Well-defined
A ∩ B = {2, 3}              ✅ Well-defined
A - B = {1}                 ✅ Well-defined
```

If sets had duplicates, these operations become ambiguous:

```
"Set" A = {1, 2, 2, 3}      ❌ Not really a set
"Set" B = {2, 3, 3, 4}      ❌ Not really a set

A ∪ B = ???
- {1, 2, 3, 4}?
- {1, 2, 2, 3, 3, 4}?
- {1, 2, 2, 2, 3, 3, 3, 4}?
```

Which is correct? No way to know.

### **Primary Keys Enforce Uniqueness**

In pure relational theory, **every relation must have a key**: a set of attributes that uniquely identifies each tuple.

```sql
-- Trees table with proper key
CREATE TABLE trees (
    id INTEGER PRIMARY KEY,    -- Ensures uniqueness
    height INTEGER,
    circumference INTEGER
);

-- Each tuple is unique by definition
-- No two rows can have the same id
```

**Key properties:**
- Minimal: no attribute can be removed and still identify the tuple
- Unique: no two tuples have the same key value

If duplicates existed, the key wouldn't be unique!

## SQL's Deviation from Theory

SQL allows duplicates because it's **practical**, but it's technically not pure relational algebra.

### SQL Tables are "Bags" (Multisets), not Sets

SQL allows this:

```sql
SELECT height FROM trees;

Result:
height
------
15
15      ← Duplicate!
22
15      ← Another duplicate!
18
```

This is a **bag** (multiset), not a **set**.

**Why SQL allows this:**

1. **Performance** - removing duplicates is expensive (requires sorting or hashing)
2. **Practical need** - sometimes you want to count duplicates
3. **Convenience** - forcing DISTINCT everywhere would be annoying

### When SQL Enforces Set Behavior

SQL gives you **DISTINCT** to get pure set behavior:

```sql
-- Bag behavior (SQL default)
SELECT height FROM trees;
-- Result: 15, 15, 22, 15, 18

-- Set behavior (relational theory)
SELECT DISTINCT height FROM trees;
-- Result: 15, 18, 22
```


## Practical Examples: Why Duplicates are Problematic

### Example 1: Counting

```sql
-- With duplicates, results are misleading
SELECT arrondissement
FROM locations
WHERE arrondissement IS NOT NULL;

-- Returns 100,000 rows with many duplicates
-- '16ème', '16ème', '16ème', '16ème', ...

-- What you actually want:
SELECT DISTINCT arrondissement
FROM locations
WHERE arrondissement IS NOT NULL;

-- Returns 20 unique arrondissements
```

### Example 2: Set Operations

```sql
-- UNION (set behavior) - removes duplicates
SELECT height FROM trees WHERE height > 20
UNION
SELECT height FROM trees WHERE remarkable = true;
-- Result: unique heights

-- UNION ALL (bag behavior) - keeps duplicates
SELECT height FROM trees WHERE height > 20
UNION ALL
SELECT height FROM trees WHERE remarkable = true;
-- Result: duplicates if a tree is both tall AND remarkable
```

### Example 3: Aggregations

```sql
-- Duplicates affect counts
SELECT COUNT(*) FROM (
    SELECT height FROM trees
) subquery;
-- Counts duplicates: 100,000

SELECT COUNT(*) FROM (
    SELECT DISTINCT height FROM trees
) subquery;
-- Counts unique values: 150
```

---

## Theoretical vs Practical Trade-off

### Relational Theory (Pure)
```
✅ No duplicates (it's a set)
✅ Clean mathematical operations
✅ Unambiguous semantics
❌ Expensive to enforce (requires checking)
❌ Less flexible for real-world needs
```

### SQL (Practical)
```
✅ Fast (no duplicate checking by default)
✅ Flexible (bags when needed, sets when needed)
✅ Can count/aggregate duplicates
❌ Not pure relational algebra
❌ Can lead to unexpected results
```

---

## When Duplicates Actually Matter

### Problem Case: Aggregations without GROUP BY

```sql
-- This probably has duplicates you don't want
SELECT
    tn.name,
    t.height
FROM trees t
JOIN taxonomy tax ON t.taxonomy_id = tax.id
JOIN tree_names tn ON tax.name_id = tn.id;

-- If a tree name appears 5000 times, you get 5000 rows
-- When calculating average, this skews results!

-- Better:
SELECT
    tn.name,
    AVG(t.height) as avg_height    -- Handles duplicates correctly
FROM trees t
JOIN taxonomy tax ON t.taxonomy_id = tax.id
JOIN tree_names tn ON tax.name_id = tn.id
GROUP BY tn.name;
```

### Safe Case: When Duplicates Are Meaningful

```sql
-- Here duplicates are meaningful - we want to count them
SELECT
    l.arrondissement,
    COUNT(*) as tree_count    -- Count includes duplicates
FROM trees t
JOIN locations l ON t.location_id = l.id
GROUP BY l.arrondissement;

-- Each row represents one tree
-- Multiple trees in same arrondissement = valid duplicates
```

---

## Summary

### Why no duplicates in relational algebra?

1. **Mathematical foundation** - relations are sets, sets have no duplicates
2. **Semantics** - duplicate tuples add no new information
3. **Operations** - set operations (∪, ∩, −) are well-defined without duplicates
4. **Keys** - every relation has a key that ensures uniqueness

### Why SQL allows duplicates?

1. **Performance** - checking for duplicates is expensive
2. **Practicality** - sometimes you need to count/process duplicates
3. **Flexibility** - use DISTINCT when you need set behavior

### Key Takeaway


- Relational Theory: Relations are SETS (no duplicates)
- SQL Implementation: Tables are BAGS (duplicates allowed)
- SQL gives you DISTINCT to enforce set behavior when needed.


**Best practice:** Think about whether your query should return a **set** or a **bag**:

- Use `SELECT DISTINCT` when you want unique values (set)
- Use `SELECT` when duplicates are meaningful (bag)
- Use `GROUP BY` + aggregates when processing groups of duplicates


