---
layout: slides
title: "modern NLP"
slides_project_home: /ml2llm/
footer: 'Modern NLP '
---
<TitleSlide>

# NLP
## Natural Language Processing
### _Style moderne_

</TitleSlide>
---
<TitleSlide>

# NLP moderne - Embeddings

</TitleSlide>
---
# Embeddings

Le problème : comment trouver des textes similaires ?

Dans un large corpus, comment trouver des phrases, des paragraphes qui traitent de sujets similaires ?

Ou dit autrement, comment calculer une **distance** entre 2 textes qui conservent le sens des textes, distance sémantique?

---

# Distance

Comment calculer une distance entre 2 textes pour pouvoir dire que

- `banane` est plus proche de `pomme` qu'il ne l'est de `avion` ;
- `le chien aboie` est plus proche de `le chat miaule` qu'il ne l'est de `l'avion décolle`, …

<div class="boom" markdown="1">
d(_fenêtre_, _porte_) < d(_fenêtre_, _café_)
</div>

Avant 2013 : compter les mots et leurs fréquences relatives
La méthode, rudimentaire, appelée [tf-idf](https://fr.wikipedia.org/wiki/TF-IDF), fonctionnait bien pour la détection de spam, nécessite beaucoup de pré-traitement de texte (stopwords, lemmatization, ...). OOV, ne peut pas passer à l'échelle pour de grands vocabulaires, sensible aux fautes de frappe, etc etc

---
# Word2vec 2013

Thomas Mikolov @Google [Efficient Estimation of Word Representations in Vector Space](https://arxiv.org/abs/1301.3781)


<div class="columns" markdown="1">
<div markdown="1">

Distance sémantique de mots similaires

<div class="boom" markdown="1">
Queen - Woman = King - Man

<br />
France + capital = Paris
<br />
Germany + capital = Berlin
</div>

mais toujours pas de **désambiguïsation contextuelle** : les **vers** de terre = je vais **vers** la table.

</div>
<div markdown="1">
<img src="/images/inwai/word2vec_001.png" alt="word2vec" width=400 class="center">
</div>
</div>

---

# word2vec 2013

Chaque mot est un vecteur de grande dimension

<img src="/images/inwai/word2vec_002.jpg" alt="word2vec" width=1200 class="center">

---
# CBOW vs skip-gram

- CBOW (Continuous Bag-of-Words): Predict the target word (center word) from the surrounding context words.
- skip-gram: Predict the context words from the target word (center word).


<img src="/images/inwai/cbow_skip_gram.webp" alt="cbow skip gram" width=1200 class="center">

[cbow-skipgram](https://medium.com/@fraidoonomarzai99/word2vec-cbow-skip-gram-in-depth-88d9cc340a50)


---
# Cosine similarity

Une fois que vous avez les embeddings (vecteurs, séries de nombres) de 2 textes (phrases, mots, tokens, ...), leur distance est donnée par la similarité cosinus de leurs embeddings

<img src="/images/inwai/word2vec_003_cosine.jpg" alt="word2vec cosine similarity" width=400 class="center">

<img src="/images/inwai/word2vec_004.jpg" alt="word2vec cosine similarity" width=800 class="center">



---

## Word2Vec (2013)
- **Static embeddings** : chaque mot = 1 vecteur fixe
- **Pas de contexte** : "avocat" (fruit, profession) → même vecteur
- Capture la **similarité** (king - man + woman ≈ queen)
- Basé sur la co-occurrence des mots
- Shallow neural network (1-2 couches)

---

# Évolution des Word Embeddings

## BERT/GPT (2018+)
- **Contextual embeddings** : même mot = vecteurs différents selon le contexte
- "bank of the river" vs "bank account" → vecteurs différents
- Utilise les **Transformers** et le mécanisme d'**attention**
- Capture le contexte dans les deux directions (BERT) ou unidirectionnel (GPT)
- Deep neural networks (12-96 couches)

---

# Comment le contexte sémantique est préservé ?

## Mécanisme d'attention
- Chaque mot "regarde" tous les autres mots de la phrase
- Calcule des **scores d'attention** : quels mots sont importants pour comprendre ce mot
- Exemple : "The **cat** sat on the **mat**"
  - "sat" prête attention à "cat" (qui fait l'action) et "mat" (où)

## Positional encoding
- Ajoute l'information de **position** dans la phrase
- Permet de distinguer "Le chien mord l'homme" vs "L'homme mord le chien"

## Layers empilées
- Chaque couche capture des relations **plus abstraites**
- Couches basses : syntaxe
- Couches hautes : sémantique complexe


---

<img src="/images/inwai/attention-mechanism-diagram.svg" alt="attention mechanism diagram" width=1200 class="center">

---

# Exemple de workflow :


1. Charger un modèle d'embedding pré-entraîné.
2. Passer les phrases dans le modèle.
3. Obtenir un vecteur de dimension N (embedding) pour chaque phrase.
4. Utiliser ces embeddings pour la tâche en aval.


<img src="/images/inwai/embedding-workflow.png" alt="Embedding workflow" width="100%" class="center">


---

# Embeddings spécialisés

Différentes entreprises optimisent pour différentes priorités—facilité d'utilisation, support multilingue, expertise de domaine, ou reduction des coûts !


## **Principales entreprises de modèles d'Embedding**

**OpenAI** – Embeddings polyvalents, usage général
- *Spécialité* : Embeddings de texte de haute qualité qui fonctionnent dans de nombreux domaines
- *Focus* : API facile à utiliser, performance solide prête à l'emploi
- *Modèles populaires* : text-embedding-3-small, text-embedding-3-large

**Cohere** – Embeddings multilingues, orientés entreprise
- *Spécialité* : Excellente recherche sémantique et support multilingue (100+ langues)
- *Focus* : Applications business, RAG (Retrieval Augmented Generation)
- *Caractéristique remarquable* : Embeddings spécialisés pour différents cas d'usage (recherche, classification)

**Voyage AI** – Embeddings personnalisables, spécifiques au domaine
- *Spécialité* : Embeddings adaptés à des industries spécifiques (finance, juridique, santé)
- *Focus* : Précision maximale grâce à l'adaptation au domaine
- *Approche* : Modèles fine-tunés qui comprennent la terminologie spécialisée

**Jina AI** – Embeddings multimodaux et open-source
- *Spécialité* : Embeddings texte, image et cross-modaux
- *Focus* : Solutions adaptées aux développeurs, personnalisables, économiques
- *Caractéristique remarquable* : Embeddings à contexte long (8K+ tokens)

**Google (Vertex AI)** – Embeddings intégrés et évolutifs
- *Spécialité* : Intégration transparente avec l'écosystème Google Cloud
- *Focus* : Échelle entreprise, modalités multiples
- *Modèles* : Gecko (texte), embeddings multimodaux

---

# Ressources


- [https://platform.openai.com/docs/guides/embeddings](https://platform.openai.com/docs/guides/embeddings)
- [https://airbyte.com/data-engineering-resources/openai-embeddings](https://airbyte.com/data-engineering-resources/openai-embeddings)


---
# RAG : Retrieval Augmented Generation


**La limitation du context window des LLMs**

Les Large Language Models ont une **context window**—une limite sur la quantité de texte qu'ils peuvent traiter à la fois (typiquement 32K-200K tokens, soit ~25-150 pages).

**Le défi :**
- Votre entreprise a 10 000+ documents, des millions de pages de données
- Les LLMs ne peuvent pas tout lire en une fois—ça ne rentre pas dans la context window
- Sans les bonnes informations, les LLMs hallucinent ou disent "Je ne sais pas"

**Comment RAG résout cela :**

**Avant RAG :**
Vous demandez : *"Quelle est notre politique de retour pour l'électronique ?"*
Le LLM pense : "Je n'ai pas accès aux politiques spécifiques de cette entreprise... Je vais faire une supposition éclairée basée sur les pratiques courantes" ❌

**Avec RAG :**
1. Votre question est convertie en embedding
2. RAG recherche dans TOUS vos documents et **récupère seulement les 3-5 pages les plus pertinentes** (vos documents de politique de retour)
3. Ces pages spécifiques sont insérées dans le prompt du LLM comme contexte
4. Le LLM répond en se basant sur VOTRE politique réelle ✓

---

RAG agit comme un **système de recherche intelligent** qui trouve l'aiguille dans la botte de foin, puis donne SEULEMENT cette aiguille au LLM comme contexte. De cette façon, le LLM a toujours les bonnes informations pour répondre avec précision—sans avoir besoin de faire rentrer toute votre base de connaissances dans sa context window.

**En résumé :** RAG = Retrieval (trouver les bons docs) + Augmented (les ajouter au prompt) + Generation (le LLM crée une réponse à partir de ce contexte)

---

# RAG : retrieval augmented generation

<img src="/images/inwai/rag-diagram.svg" alt="RAG diagram" width="100%" class="center">

---

## **Principaux défis des systèmes RAG**

**Problèmes de chunking**
- Trouver la bonne taille de chunk : trop petit perd le contexte, trop grand dilue la pertinence
- Des limites mal placées cassent le sens (diviser des tableaux, des phrases ou des blocs de code)

**Qualité du retrieval**
- Décalage sémantique : les mots de l'utilisateur ne correspondent pas à la terminologie des documents
- Échecs de classement : le document le plus pertinent n'apparaît pas dans les premiers résultats

**Contrôle de version et fraîcheur**
- Les documents obsolètes restent dans la base de données vectorielle
- Plusieurs versions d'un même document causent des réponses contradictoires

**Limitations de contexte**
- Le contenu récupéré dépasse la capacité de la context window du LLM
- Décider quels chunks inclure quand vous avez trop de résultats pertinents

**Les hallucinations persistent**
- Le LLM extrapole au-delà des documents récupérés
- Des sources contradictoires conduisent à des compromis inventés

**Coût et latence**
- Ré-embedder de grandes collections est coûteux
- Le retrieval ajoute 2-5 secondes au temps de réponse


---
<TitleSlide>

# Pratique NLP classique et moderne

</TitleSlide>
---

# Sur l'API Wikipedia

- Construire un corpus sur l'API Wikipedia
- diviser le texte en phrases (en utilisant spacy.io)
- Extraire les personnes, les lieux en utilisant NER (en utilisant spacy.io)
- pour chaque phrase : obtenir les embeddings en utilisant la librairie huggingface transformers
- trouver des phrases similaires à partir d'un mot-clé ou d'une requête
- visualiser avec un graphe

---

# Colab

[https://colab.research.google.com/drive/1FT5hdlnj23c85CEYvaIc6nh4xDWu7VSW#scrollTo=cYFFIRy-6Ign](https://colab.research.google.com/drive/1FT5hdlnj23c85CEYvaIc6nh4xDWu7VSW#scrollTo=cYFFIRy-6Ign)


---

# Pratique


- extraire tous les NER dans une nouvelle colonne
- extraire tous les adjectifs ou noms dans une nouvelle colonne

- diviser la colonne de texte principale en phrases
- construire un nouveau dataframe avec les phrases (garder une référence au dataframe original)

- en utilisant la librairie huggingface transformers, construire des embeddings pour chaque phrase

- étant donné un texte (mot, phrase, ...), trouver toutes les phrases qui lui sont les plus similaires