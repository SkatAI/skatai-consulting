---
layout: default_en
title: "Introduction au Machine Learning"
page_title: "Introduction au Machine Learning"
summary: "Quiz final sur les modèles avancés et l'ensemble learning"
footer: 'Alexis Perrier - Skatai.com/initml'
---

# Quiz P4

Q1)
Vous avez scindé votre jeu de données en 2 sous-ensembles, entraînement et test.
Vous observez le score de votre modèle sur ces 2 sous-ensemble

Dans quel cas pouvez vous conclure que le modèle overfit ?

">>" veut dire très supérieur à

- le score(test) == score(train)
- le score(test) << score(train)
- le score(test) >> score(train)

Reponse

Dans le 2ème cas, quand le score sur le sous ensemble de test est bien inférieur au score sur le sous ensemble d'entraînement, on peut conclure que le modèle overfit.




Q2) arbres de decision

Considérons un modèle d'arbre de décision simple

Quelle affirmation est vraie?

Un arbre de décision dont la profondeur max_depth n'est pas limité
- a forcément un biais élevé
- n'overfit jamais
- peut overfitter

Reponse

Limiter la profondeur maximale d'un arbre de décision permet de limiter sa tendance naturelle a over fitter.
La réponse 3 est donc vraie. Un arbre de décision dont le paramètre de profondeur maximum n'est pas limité aura en effet tendance à overfitter.

Q3)
Quelle affirmation est vraie

- Dans le modèle Ridge le terme de régularisation ajoute une contrainte sur les coeff de la régression
- Le but de la régularisation est de réduire le biais d'un modèle
- Il n'est pas possible de régulariser une forêt aléatoire car il n'y a pas de paramètre de type L2 comme dans Ridge
- le paramètre alpha du modèle ridge correspond au nombre de variable de la régression

https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html

La bonne réponse est la première. le paramètre alpha est un terme de régularisation de type L2 permettant de tempérer le overfitting du modèle.


Voir le cours P4C2, pour le fait que les autres réponses sont fausses

Q4)

Quelle affirmation est vraie ?



- l'objectif de la validation croisée est de maximiser la sélection des données d'apprentissage pour accroître la  performance  du modèle.

- La validation croisée est utilisée pour évaluer les performances d'un modèle sur le sous-ensemble d'entraînement

- La validation croisée garantit qu'un modèle donnera de bons résultats sur des données de production.

- La validation croisée permet d'obtenir une estimation robuste de la performance du modèle.

La réponse 4 est la bonne. La validation croisée permet d'estimer la performance d'un modèle sur plusieurs sous-ensemble successifs du jeu de données initial. De cette façon, la performance du modèle n'est plus évaluée sur un sous-ensemble de test particulier mais sur plusieurs. L'évaluation est donc plus robuste.


Q5)
Quelle affirmation est vraie ?


- l'apprentissage d'ensemble consiste à combiner ensemble  plusieurs type de modèle, par exemple une régression logistique et une forêt aléatoire
- l'apprentissage d'ensemble consiste à associer de multiples instances d'un modèle de faible performance pour obtenir un modèle global plus performant
- La méthode du bagging consiste à supprimer les modèles les plus faibles et ne garder que les instances les plus performantes pour constituer le modèle d'ensemble
- pour une classification, le bagging utilisera le vote majoritaire pour déterminer la catégorie prédite par le modèle d'ensemble


Réponses 2 et 4. voir chapitre P4C3

La réponse 1 est une méthode appelé stacking qui met en oeuvre des modèles de type différents

la réponse 3 ne correspond à aucune méthode particulière.


Q6)
Quelle affirmation est vraie ?

Les modèles obtenue par la technique du bagging
Le bagging permet de
- accroître la vitesse d'entraînement du modèle de base
- reduire l'overfit
- rendre les modèle plus robuste
- n'est disponible que pour les arbres de décision

reponses 2 et 3

Comme il y a plus de modele a entraîné, le baggin aurait plutot tendance à accroitre le temps d'entrainement par rapport au modèle de base

le bagging peut être appliqué à toute sortes de modèles de, régression, k-means etc

Q7)
Quelle affirmation est vraie ?


- Les forêts aléatoires consiste à combiner de nombreuses instances d'arbres de décision entraînées en parallèle
- Les forêts aléatoires sont seulement utilisées pour la classification
- chaque arbre de décision est entraîné sur l'intégralité des données
- chaque arbre de décision est entraîné sur l'intégralité des variables disponibles



Response 1

- il y a des version de forêt aléatoire pour la régression et la classification dans scikit-learn
- chaque arbre peut être entraîné sur une partie des données et une partie des variables

Q8)

dans le cadre d'un nouveau projet de machine learning
Etablir un benchmark permet de


- etablir un benchmark avec un modèle simple de type régression linéaire ou régression logistique permet de quantifier les gains obtenus avec des modèles plus complexes
- Sur un nouveau dataset, entraîner en premier lieu un gradient boosting permet d'obtenir les meilleures performances. pas besoin de considérer des modèles plus simples
- les forêts aléatoires sont difficile a paramétrer et sont à considérer que si le gradient boosting ne donne pas des résultats satisfaisant
- Le benchmarking en début de projet sert à évaluer les ressources informatiques qui seront nécessaires au projet de machine learning

Response 1
C'est en effet le but du benchmarking. Fixer les attentes et valider que les modèles plus complexes apportent bien des gains de performance.

Optimiser  un gradient boosting peut se  révéler compliqué et ne serait pas le premier type de modèle a entraîné dans le cadre d'un nouveau projet

Réponse 3: c'est plutôt le contraire. les forêts aléatoires ont moins de paramètres que le gradient boosting et sont donc plus faciles à entraîner

Enfin on parle ici de performance de prédiction des modèles et non des performances du matériel informatique nécessaire au projet.
