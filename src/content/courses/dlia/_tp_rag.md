# TP - construire un RAG

## Master 1 Art & Science — ESIEE Paris

Dans ce TP vous allez construire un systeme RAG : Retrieval Augmented Generation

Ce TP est noté.

Vous soumettrez votre github repo sur un formulaire google ou un google colab.

Il est préferebale que le code soit géneré avec une IA (ex: claude, gemini, etc).

### Evaluation

Avoir un system RAG qui fonctionne

La partie ingestion:
- Un corpus de texte
- process de chunking
- embeddings avec model opensource (ex: all-MiniLM-L6-v2)
- storage dans une bdd vectorielle

Puis
- la partie retrieval: recherche par similarité cosinus
- la partie generation: prompt

Optionel:
- reranking
- interface web simple (streamlit, gradio, ou autre) ou ligne de commande

Important: Dans votre github repo,
- vous devez avoir un README.md qui explique comment lancer le projet.
- ne pas publier les clef API en clair dans le code.
- mettre la repo en publique pour que je puisse y accéder et évaluer votre travail.
- vous devez avoir créé votre repo et soumis le formulaire avant 15h. Pour que je puisse verifier que j'ai bien accès à toutes les repos.

### Tech stack

Suggestion :

- Python
- LangChain
- la base de donnée vectorielle: FAISS, Weaviate etc
- modele de embeddings de HuggingFace: all-MiniLM-L6-v2
- openrouter pour le LLM
- Streamlit pour le front par exemple.

### Credits et clef API

Le plus simple est d'utiliser les plateformes suivantes avec une clef API.

#### OpenRouter

[https://openrouter.ai/](https://openrouter.ai/)

Voici ma clef :

Il manque les 4 derniers caractères de la clef API. Je vous la donnerai.

##### Huggingface

Voici ma clef :

Il manque les 4 derniers caractères de la clef API. Je vous la donnerai.

# Etapes de constructions

## I) Ingestion - preparation

### 1. trouver un corpus.

Voici quelques corpus que vous pouvez utiliser.

- AI act
- ???

Vous pouvez aussi utiliser un corpus de votre choix.

Il faut un corpus assez consequent, et facilement chunkable.


### 2. chunker le corpus (au niveau du paragraphe)

L'etape consiste a decouper (chunker) le corpus en morceaux de texte.
Chaque morceau doit contenir l'information qui sera fournie au prompt.

Il faut trouver l'equilibre entre trop peu vs trop d'information.

Par exemple :
- chunker au niveau de la phrase: trop peu d'info car l'info peut etre dispersée sur tout le paragraphe. Et beaucoup de phrases n'auront pas d'info

- chunker au niveau du document. trop d'info.


Un bon equilibre sera de chunker au niveau du paragraphe.

On utilisera la librairie **[langchain](https://www.langchain.com)** pour le chunking.


### 3. embedder le corpus

Une fois le texte chunké, on embedde chaque chunk avec un modèle de embedding.

En francais: une fois le texte decoupé, on vectorise chaque morceau avec un modele de vectorisation comme [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)


### 4. stocker dans une bdd vectorielle

A ce stade on a un dictionnaire, un fichier json par exemple avec
- les morceaux de texte
- l'embedding associé

On peut stocker ca dans une base de données vectorielle comme FAISS, Weaviate etc.

On peut aussi stocker ca dans une base de données classique comme PostgreSQL avec une extension vectorielle. La plupart des bdd de données du marché (MongoDB, Neo4j, Oracle, etc) supportent maintenant les embeddings.

Ici, [FAISS](https://faiss.ai/) sera utilisé pour sa simplicité et sa rapidité.

A la fin de cette etape vous avez une base de données vectorielle avec des embeddings de votre corpus.


## II) Information retrieval

Il faut d'abord trouver la bonne information dans le corpus. C'est la partie information retrieval (IR).

1. Saisir la question de l'utilisateur
2. Vectoriser la question avec le meme modele d'embeddings.
3. faire une recherche de similarité dans la base de données. Cette fonctionnalité est fournie par la base de donnés. Ex dans FAISS: `index.search(query_embedding, k)`
4. Récupérer les K resultats avec le meilleur score. Soit en fixant un K arbitraire. soit en ne prendant que les chunks dont le score de similarité avec le vecteur de la question est superieur a un seuil. (on peut mixer les 2 approches)

## III) Generation de la reponse

1. Construire le prompt avec les chunks recuperes. Il suffit d'inserer les chunks dans un prompt de type:

```
Respond a la question
{question de l'utilisateur}

avec les informations suivantes:
{chunks recuperes}

```

A ce prompt, on peut rajouter

- un role : tu es expert dans le domaine X
- un style : tu reponds de maniere concise
- un format : tu reponds en markdown

2. Appeler le modele de generation de texte

Via openrouter et la clef API que je vous ai donné.

3. Renvoyer la reponse


## IV) Extra


### Evaluation

Claude: complete cette partie


### Reranking

La technique de **reranking** permet de raffiner la recherche en prenant en compte la pertinence de la reponse par rapport a la question. Elle utilise un modele de vectorisation plus performant que celui utilisé pour le chunking. Mais aussi plus lent.

On va donc vectoriser la question et les K chunks recuperes avec le modele de vectorisation plus performant et calculer la similarite entre la question et chaque chunk. On garde les K chunks les plus similaires.




