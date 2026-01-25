---
layout: default_en
title: "Day 1"
page_title: "Introduction au Machine Learning"
summary: "Apprendre à entraîner un modèle de régression linéaire"
footer: 'Alexis Perrier - Skatai.com/ml2llm/'
slides_project_home: /ml2llm/
---


# Day 1

## [welcome slides](https://docs.google.com/presentation/d/1AlWWC7qnsAA0VvYOXJqpTWmhGn0dC3yxLRATP45Jqn4/edit?slide=id.p#slide=id.p)

- presentations
- scope
- google colab
- markdown

## des stats au Machine learning

[des stats au ML](https://skatai.com/initml/comprendre-machine-learning/)
    - importance des données
    - Modélisation statistique ou modélisation prédictive
    - [Machine learning definition](https://drive.google.com/drive/u/0/folders/1qf6SFOHZtW9pr0RqTZ_Fx36LBlqwN0mE)
    - Regression ou classification, Classification binaire ou multi class
    - supervisée vs non supervisée
    - [UCI datasets](https://archive.ics.uci.edu/datasets)
    - [sklearn](https://scikit-learn.org/) et [slides](https://docs.google.com/presentation/d/1eTGS1kxnTb5NVjU2V-FKnXfDGVaE_yc2GzdZ7YooveA/edit?slide=id.g326ce3170c7_0_34#slide=id.g326ce3170c7_0_34)
    - [statsmodels](https://www.statsmodels.org/stable/index.html)


## principe d'entrainement iteratif

[https://skatai.com/initml/modeles-algorithmes/](https://skatai.com/initml/modeles-algorithmes/)

- sqrt(2)
- erreur d'estimation
- learning rate

## Pandas dataframes

- [pandas dataframe](https://docs.google.com/presentation/d/1eTGS1kxnTb5NVjU2V-FKnXfDGVaE_yc2GzdZ7YooveA/edit?slide=id.g326ce3170c7_0_5#slide=id.g326ce3170c7_0_5)


## Regression lineaire avec scikit-learn

https://skatai.com/initml/etapes-construction-modele/

- variable cible et matrice de design
- import, fit, score
- coeff de determination
- fonction de cout
- metrique d'evaluation des performances
- MSE, RMSE, MAPE etc

### LR sur dataset advertising

[https://skatai.com/initml/regression-lineaire/](https://skatai.com/initml/regression-lineaire/)

[plus en detail](https://openclassrooms.com/fr/courses/5873596-perform-effective-data-modeling/6229141-implement-univariate-linear-regression)

- [linearité](https://openclassrooms.com/fr/courses/5873596-perform-effective-data-modeling/6191896-assess-linearity)
- conditions : linearité, normalisation, independance des variables
- ajouter un terme quadratique
- pratique sur advertising, enfants, ou autres datasets sur UCI
    - load dataset dans dataframe
    - exploration
    - nettoyage
    - normalisation
    - OLS avec statsmodel : construire plusieurs modeles
    - feature engineering : terme quadratiques, log etc
    - meilleur modele ?
- datasets:
    - auto mpg [https://archive.ics.uci.edu/ml/datasets/Auto+MPG](https://archive.ics.uci.edu/ml/datasets/Auto+MPG)

### Logistic regression

[https://openclassrooms.com/fr/courses/5873596-perform-effective-data-modeling/6233016-classify-with-logistic-regression](https://openclassrooms.com/fr/courses/5873596-perform-effective-data-modeling/6233016-classify-with-logistic-regression)

- pourquoi utiliser la regression logistique ?
- function logit
- metriques
- matrice de confusion
- loss function




