---
title: "Scikit-learn's Out-of-Core Classifiers for Large Data"
date: 2015-10-30
author: Alexis Perrier
description: "Scikit learn implements out of core or batch processing in several algorithms. High speed boost when working on Large datasets."
tags: [Scikit-learn, Machine Learning, Large Data]
---

Here the scenario: A new kaggle competition, a new dataset. Gigabites? ouch! Cold shivers as you
anticipate hours waiting to extract features, train models and middle of the night cold feet as you're _just checking_ that your script is still running.

A data set is said to be large when it exceeds 20% of the available RAM for a single machine. Which for your standard MacBook Pro with 8Gb of RAM, corresponds to a meager 2Gb dataset — size that is becoming more and more frequent these days.

Of course before you actually run out of memory, your machine will slow down to a crawl and your frustration will increase in inverse proportions.

To deal with large data, first aid kit strategies consists in sampling the data to only consider a subset of the whole data or reaching out for more RAM by going to the cloud. Amazon offers boxes with plenty of RAM for pennies/hour. Other options are to use libraries such as Apache Spark’s MLlib, or platforms such as H2O or Dato’s GraphLab Create. R also has a streaming package.

However, if scikit-learn is your weapon of choice for machine learning, you should stick with it and make the best of its out-of-core processing capabilities.

The rest of the story is on the Open Data Science Conference [Blog](https://www.opendatascience.com/blog/): [Riding on Large Data with Scikit-learn](https://www.opendatascience.com/blog/riding-on-large-data-with-scikit-learn/) by yours truly.
