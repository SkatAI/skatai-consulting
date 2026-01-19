---
layout: default_en
title: "Introduction au Machine Learning"
page_title: "Introduction au Machine Learning"
summary: "Comprendre les concepts fondamentaux du Machine Learning et ses applications"
footer: 'Alexis Perrier - Skatai.com/initml'
---

# Le Machine Learning

> Le machine Learning ou apprentissage automatique est partout. Quelques exemples frappants du ML au quotidien. ML par rapport à la Data Science et à l'IA. Motivation du cours, motivation de l'apprenant et but du projet de machine learning.

Sans pour cela remonter au [Turc méchanique](https://fr.wikipedia.org/wiki/Turc_m%C3%A9canique) du 17e siècle, on peut dire que l'intelligence artificielle (IA) est née en 1957 avec l'invention du __Perceptron__, première machine rudimentaire de classification automatique d'images.

S'ensuivit entre 1960 et 2010 une série de printemps et d'hivers de l'IA en fonction des progrès réalisés et de l'engouement du grand public pour le domaine. Ce n'est qu'avec l'explosion dans les dernières années de la puissance de calcul et de stockage des ordinateurs que l'IA a vraiment pris racine dans notre quotidien.

On parle aujourd'hui, d'IA citoyenne car nous avons à notre disposition des jeux de données, des librairies de machine learning puissantes et bien documentées ([scikit-learn](https://scikit-learn.org/stable/index.html)), des plateformes de travail en ligne ([google colab](https://colab.research.google.com/)) et multitudes de cours et tutoriaux. C'est une époque excitante pour le machine learning et la data science.

Toutefois, IA est un terme générique qui couvre aussi bien des visions de fin du monde que l'ingénierie logicielle de pointe. Depuis 2022 et le lancement de ChatGPT (basé sur GPT-3.5), le terme intelligence artificielle (IA), a pris du galon, est devenu pertinent.

Dans ce cours, nous parlerons uniquement de machine learning ou apprentissage automatique, laissant l'IA pour désigner les grands modèles de langues et les IA génératives.

Toutefois, le ML est la brique de base de l'IA, la chaîne dans le vélo, le moteur dans la voiture.

- Le ML a une tâche précise à accomplir: la **prédiction**.
- Le ML utilise des **algorithmes** pour développer des modèles prédictifs à partir de **jeux de données**.

Cette fonction prédictive est polymorphe et selon les besoins aura pour nom classification, supervision, détection, proposition, ranking, prévision ... mais à la base il y a toujours un but de prédiction sur la base de nouvelles données. Le modèle est entraîné sur des données historiques et évalué sur des données nouvelles qui lui sont inconnues.

Nous profitons de cette profusion de modèles prédictifs dans bien des domaines: proposition de contenu sur les plateformes, prévention et surveillance globale, évaluation des risques, optimisation des chaînes de production et de ventes, détection des anomalies, prévisions temporelles etc etc

Dans ce cours nous allons travailler sur le machine learning dit classique opposé au deep learning (apprentissage profond). Le ML classique se nourrit de jeux de données tabulaires, de taille raisonnable (< 1Gb) et disponibles dans un fichier csv. On va laisser les données plus lourdes, de type audio, images, vidéo, ainsi que  l'IA générative au deep learning et au réseaux de neurones.

A la base du ML, se trouve le jeu de données ou **dataset**. Sans data, pas de ML!

## Modélisation statistique ou modélisation prédictive;

> Etant donné un jeu de données, on peut approcher son exploitation de deux manières différentes:
Soit analyser la dynamique entre les variables, c'est la modélisation statistique, soit utiliser les données pour construire un modèle prédictif qui est l'approche Machine Learning.

Imaginons que  vous soyez responsable des données d'une plateforme de contenu en ligne dont le business modèle repose sur le nombre d'abonnements souscrits. On vous pose les 2 questions suivantes:

- Quel est le profil type des utilisateurs qui s'abonnent?
- Comment prédire si un nouvel utilisateur va s'abonner ou non?

Dans les 2 cas, on cherche à en savoir plus sur l'acte d'abonnement. La variable cible est binaire: abonnement ou non.

Cependant, ces questions imposent des approches différentes: **modélisation statistique** contre **modélisation prédictive**.

### Modélisation statistique
Dans la question relative au profil, on cherche à comprendre l'acte d'abonnement en fonction des caractéristiques des utilisateurs. On veut savoir ce qui distingue les personnes qui s'abonnent des autres.

On est dans une démarche d'analyse et d'interprétation de la dynamique entre les variables. Cette exploration statistique cherche à expliciter les relations entre les variables dans un but analytique. La modélisation statistique s'appuie sur des tests d'hypothèses et des modèles mathématiques pour évaluer les conclusions de l'analyse.

### Modélisation prédictive
Dans la question relative à la prédiction, on ne cherche qu'à prédire efficacement l'acte d'abonnement.
C'est l'approche machine learning. L'important est la justesse, la fiabilité des prédictions.  La compréhension des prédictions vient dans un second temps. Le modèle est assimilé à une boîte noire, l'important est sa performance pas de savoir comment il fonctionne.

On attend 2 choses du modèle prédictif
1. Des prédictions de qualité, une bonne performance que l'on va évaluer par une métrique bien choisie
2. La capacité à extrapoler: à généraliser ses prédictions à partir des données d'entraînement. On parle de robustesse du modèle face à de nouveaux échantillons.

Mesurer la performance du modèle implique  d'avoir  au préalable défini une métrique d'évaluation. Cette métrique va dépendre des données et de la tâche à réaliser.

Bien que l'on puisse utiliser les modèles statistiques pour de la prédiction, la puissance des modèles ML est sans commune mesure.


Le modèle statistique permet de comprendre l'influence des variables entre elles.
Mais le modèle prédictif d'être capable de généraliser à de nouvelles données. On parle de **robustesse** du modèle.


## Comprenez en quoi consiste le Machine Learning
> Construire un modèle prédictif consiste à l'entraîner sur des données, puis évaluer sa performance et enfin l’optimiser.
> Attentes: le modèle prédictif doit être capable d'être performant sur des données nouvelles, c’est la capacité de généralisation, d'extrapolation
> concepts: entraînement, évaluation, optimisation, généralisation,

Le but du ML est donc d'entraîner un modèle prédictif à partir d'un jeu de données. Mais en pratique comment cela se passe t-il?

<div class="boom">
Dans la suite quand on parle de jeux de données, pensez à une feuille de type google spreadsheet ou tableur excel. Les variables sont les colonnes, et les échantillons sont les lignes. On distingue la variable cible, qui est le sujet de la prédiction, des autres variables potentiellement prédictrices.
</div>

On part d'un jeu de données que l'on suppose exploitable. Concept fourre-tout qui suppose que les variables aient une relation entre elles. Corrélation, causalité, ... le dataset n'est pas un regroupement totalement aléatoire de données qui auraient été collectées on ne sait comment.

Prenons un exemple avec un jeu de données comprenant l'âge, la taille et le poids d'une centaine d'enfants. On suppose raisonnablement que la taille et l'âge d'un enfant sont liées à son poids.

Voici les étapes pour développer un modèle prédictif à partir d'un tel ce dataset.

### 1.  le travail sur la donnée:

Tout commence par un travail de transformation des données brutes pour les rendre compatibles avec le modèle de ML choisi: nettoyage, normalisation, numérisation etc ... On parle de data cleansing.

Ensuite, on découpe le dataset en 2.

Une partie des échantillons (train : entraînement) sont réservés à l'entraînement du modèle tandis que l'autre partie (test : évaluation) est mise de côté pour évaluer sa performance sur des données qu'il ne connaît pas. On va d'ailleurs répéter ce découpage plusieurs fois et de façon aléatoire pour s'assurer que le modèle performe dans tous les cas de répartition train / test. Cette méthode s'appelle la validation croisée (cross validation).

En parallèle, on va chercher à optimiser la perf du modèle en modifiant ses paramètres et en observant son score sur chaque version train / test du dataset.


## l’ approche supervisée ou non-supervisée

> Approches supervisées ou non-supervisées;
> Définition d'une variable cible; On évalue les modèles différemment selon que l'on soit en supervisé ou non-supervisé

Un distinction importante entre 2 types de ML classique sur des données tabulaires.

soit on essaie de prédire une des variables du dataset, soit on pense que les données appartiennent à plusieurs groupes et on va prendre à quelle groupe l'échantillon appartient.

- **approche supervisée**: On prédit le prix de location de l'appartement en fonction de sa superficie, localisation, étage etc
- **approche non supervisée**: On groupe les appartements en N groupes distinct et le modèle associe un appartement à un des groupes trouvés par l'algorithme.

### Regression ou classification

une autre distinction dans l'approche supervisée vient de la nature de la variable cible que l'on veut prédire.
si la variable est un chiffre (prix, taille, émission, ...) (on dit qu'elle est continue), alors on parlera de **régression**. si la variable cible est une catégorie, on parle de **classification**

### Classification binaire ou multi class

On parle de classification **binaire** en face d'un choix binaire: `0 ou 1` , survivra ou non, acheté ou non.

Et de classification **multi class** quand on a plus de 2 catégories: on distingue alors la nature ordonnée ou non d'un ensemble. par exemple : _jeune_, _adulte_, _vieux_ ou : _peu_ _moyen_ _beaucoup_ => ordinal
d'une classification multi class non ordonnée: _chat_, _chien_, _mouton_ ou _rouge_, _vert_, _bleu_, _jaune_

On a parlé de **variable cible**. En fait ce n'est pas toujours le cas et il faut distinguer en ML l'approche supervisée de l'approche non supervisée

Imaginez que vous avez un ensemble de photos de chats et de chiens. Vous souhaitez les classer automatiquement en utilisant un modèle de ML.

Dans le ML supervisé, il faut que chaque image de votre  dataset soit au préalable étiquetée en chat ou en chien. Cette étiquette / label est la variable cible que vous allez chercher à prédire. La labélisation  est le plus souvent réalisée par un humain et peut prendre beaucoup de temps et nécessiter beaucoup de ressources quant on traite des jeux de données avec beaucoup d'échantillons.
Une fois le dataset d'entrainement étiqueté on peut entraîner le modèle. Il s'agit d'un processus **supervisé** car le modèle apprend à partir d'exemples étiquetés.

En revanche, dans l'approche **non supervisée**, vous n'avez pas d'étiquettes pour les photos. Le modèle va essayer de regrouper automatiquement les photos en fonction de leurs caractéristiques similaires. Il regroupe les en grappes / cluster sans aucune connaissance préalable sur les espèces. On parle alors de **clustering**.

### Classification ou regression

En fonction de la nature de la variable cible, on parlera de
- **classification** lorsqu'on predit des categories: binaire (oui/non), ordinal (petit, moyen, grand) ou nominales (chat - chien - brebis , bleu-rose-vert-blanc, ...)
- et de **régression** lorsque l'on prédit une variable continue: prix, âge, salaire, volume, température etc

En résumé, le machine learning **supervisé** nécessite des données étiquetées pour entraîner le modèle à prédire des valeurs spécifiques, tandis que le machine learning **non supervisé** cherche à trouver des structures ou des groupements inhérents aux données sans avoir d'informations spécifiques liées à une quelconque prédiction prédéfinie. Il n'y a pas de variable cible.

On a donc 3 types de ML classique
- supervisé: régression et classification
- non supervisé: clustering

## À vous de jouer !


> Aller sur [UCI machine learning datasets](https://archive.ics.uci.edu/datasets) et comparer plusieurs datasets en observant à quelles approches ils correspondent.

Tout modèle prédictif repose sur un jeu de données. Sans données, pas de ML.

En 1978, David Aha, étudiant a University of California Irvine a créé un serveur mettant à disposition des jeux de données pour le machine learning. Ce serveur est maintenant une source incontournable des données pour le machine learning avec plus de 600 jeux de données, répertorié par tâche et type de donnée et vous allez l'explorer.

- Allez sur le site [https://archive.ics.uci.edu/datasets](https://archive.ics.uci.edu/datasets)
- le premier jeux de données est Iris, cliquez sur la vignette vous observez
    - la  tâche: classification
    - le nombre d'échantillon: 150
    - le  nombre de variable prédictive: attributes: 4
    - la date de donation: 1 juillet 1988
    etc

dans le menu de gauche utilisez  les filtres pour trouver les dataset
- data type: **tabular**
- task: on retrouve nos 3 grand groupe : classification, régression et clustering
- cliquez sur l'une des vignettes  et explorez la partie features
- La page montre les performances de certains algo
- et les papiers qui utilisent ce dataset (il y en a bien plus )

A votre tour.

- trouvez un dataset
- regardez ses variables
- ses caractéristiques ...

Il y a d'autres sources de dataset, nous reviendrons dessus au chapitre ...

Nous avons beaucoup parlé de **modèles** dans ce chapitre.
Nous allons maintenant préciser ce terme fourre-tout dans le contexte du ML.


## Recapitulatif

Voici un récapitulatif des points clés de ce chapitre sur l'introduction au Machine Learning :

**Définition et contexte**
- Le Machine Learning (ML) est la brique de base de l'IA, avec pour fonction principale la **prédiction** à partir de données historiques
- Il utilise des algorithmes pour développer des modèles prédictifs à partir de jeux de données tabulaires
- Distinction claire entre ML classique (données tabulaires < 1Go) et deep learning (données lourdes : audio, images, vidéos)

**Deux approches de modélisation**
- **Modélisation statistique** : comprendre les relations entre variables, analyser le "pourquoi"
- **Modélisation prédictive (ML)** : optimiser la justesse des prédictions, le modèle comme "boîte noire"

**Types d'apprentissage**
- **Supervisé** : prédiction avec variable cible étiquetée (classification ou régression)
- **Non supervisé** : découverte de structures sans variable cible (clustering)
- **Classification** : prédire des catégories (binaire ou multi-classes)
- **Régression** : prédire des valeurs continues (prix, âge, température)

**Processus ML**
- Préparation des données (nettoyage, normalisation)
- Division train/test pour l'entraînement et l'évaluation
- Validation croisée pour assurer la robustesse
- Optimisation des paramètres pour améliorer les performances

**Objectifs clés**
- Performance mesurée par des métriques appropriées
- **Généralisation** : capacité à prédire sur de nouvelles données inconnues
- Robustesse du modèle face à de nouveaux échantillons


