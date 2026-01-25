---
layout: default_en
title: "Day 4"
page_title: "Kaggle housing prices competition"
summary: "Kaggle housing prices competition"
footer: 'Alexis Perrier - Skatai.com/ml2llm/'
slides_project_home: /ml2llm/
---
<TitleSlide>

# Kaggle housing prices competition

</TitleSlide>
---

# Plan

- s'enregistrer sur Kaggle
- rejoindre la competition [Spaceship titanic](https://www.kaggle.com/competitions/spaceship-titanic)
- ouvrir un notebook Colab

## Data processing

- simple data processing
    - missing values : SimpleImputer (median) ou ajouter "missing" dans les categories
    - on garde les outliers pour le moment

## Design matrix et target vector

- numeriser les variables non numerique : creer les transformations (OrdinalEncoder)
    - categories sur train et test:
    - boolean

## Baseline

- sur le train.csv
    - etablir un baseline avec un simple model
        - 50/50
        - regression lineaire
- sur le test numerisee
    - predire avec le model

- creer le pipeline de traitement qui permet de soumettre dans la competition


## Modeles

- travailler avec les modeles suivants:
    - Modele lineaire
    - decision tree
    - entrainer une random forest avec parametres par defaut
    - optimiser
        - detecter overfit
        - cross validation
        - grid search + cross validation

## Revenir au traitement des données


- outliers:
    - cap
    - cap + flag
    - binning
- different categories encoding : label encoder, binary encoding,





