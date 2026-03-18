---
title: "TP — Construire un RAG"
page_title: "TP — Construire un RAG"
---

# TP — Construire un RAG

## Master 1 Art & Science — ESIEE Paris

Dans ce TP, vous allez construire un système **RAG** : *Retrieval Augmented Generation*.

Le principe : au lieu de demander à un LLM de répondre uniquement à partir de ce qu'il "sait", on lui fournit des extraits pertinents d'un corpus de documents. Le LLM génère alors sa réponse en s'appuyant sur ces extraits.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PIPELINE RAG                                 │
│                                                                     │
│  ┌──────────────────────── INGESTION ────────────────────────────┐  │
│  │                                                               │  │
│  │  Corpus  ──►  Chunking  ──►  Embeddings  ──►  BDD vectorielle│  │
│  │  (texte)    (découpage)    (vectorisation)     (FAISS)        │  │
│  │                                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────── REQUÊTE UTILISATEUR ──────────────────────────┐  │
│  │                                                               │  │
│  │  Question  ──►  Embedding  ──►  Recherche  ──►  Top K chunks  │  │
│  │                 question      similarité                      │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                            │                                        │
│                            ▼                                        │
│  ┌──────────────────── GÉNÉRATION ───────────────────────────────┐  │
│  │                                                               │  │
│  │  Prompt = question + chunks  ──►  LLM (OpenRouter)  ──►  Réponse│
│  │                                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```


---

## Modalités

**Ce TP est noté.**

Vous soumettrez le lien vers votre repo GitHub via le formulaire Google :

👉 [https://forms.gle/Lx9E1QATVjZ2QdZv9](https://forms.gle/Lx9E1QATVjZ2QdZv9)

> Il est recommandé de générer le code avec une IA (Claude, Gemini, ChatGPT, Copilot, etc.).

---


### Consignes pour le repository GitHub

- ✅ Un fichier **README.md** qui explique comment installer et lancer le projet
- ✅ Les clés API dans un fichier **`.env`** (jamais en clair dans le code)
- ✅ Un fichier **`.gitignore`** qui exclut `.env`
- ✅ Le repo doit être **public**
- ⏰ votre repo doit être créée et le formulaire soumis avant 15h pour que je puisse vérifier que j'ai bien accès à tous les repos.


---

## Tech stack suggérée

| Composant | Suggestion |
|---|---|
| Langage | Python 3.10+ |
| Orchestration | LangChain |
| Base vectorielle | FAISS |
| Modèle d'embeddings | `all-MiniLM-L6-v2` (HuggingFace / sentence-transformers) |
| LLM | Via OpenRouter (modèles gratuits ou pas chers) |
| Interface (bonus) | Streamlit, Gradio, ou simple CLI |

### Installation rapide

```bash
pip install langchain langchain-community faiss-cpu sentence-transformers openai python-dotenv
```

**Note :** on utilise le package `openai` car OpenRouter expose une API compatible OpenAI.

> Il existe un package `openrouter` sur PyPI, mais il est non-officiel, peu maintenu, et OpenRouter eux-mêmes recommandent dans leur doc d'utiliser le SDK OpenAI. C'est devenu un standard de fait : la plupart des providers (Together, Groq, Mistral…) exposent tous une API compatible OpenAI pour cette raison.


---

## Clés API

### OpenRouter

Site : [https://openrouter.ai/](https://openrouter.ai/)

Clé partagée (il manque les 5 derniers caractères, je vous les donnerai en cours) :

```
sk-or-v1-2def8c4157456ed36e4e4920a1759194cf91bed0d4f2980eb514c7cd0de
```


> **Rappel :** ne publiez jamais ces clés dans votre code. Utilisez un fichier `.env` :
>
> ```bash
> # fichier .env (à la racine du projet)
> OPENROUTER_API_KEY=sk-or-v1-...
> ```
>
> Et dans votre code Python :
> ```python
> from dotenv import load_dotenv
> import os
>
> load_dotenv()
> api_key = os.getenv("OPENROUTER_API_KEY")
> ```


### Option Google Colab

Si vous n'êtes pas à l'aise avec un environnement local (Python, terminal, etc.), vous pouvez réaliser ce TP entièrement sur **Google Colab** : [colab.research.google.com](https://colab.research.google.com)

**Installation des dépendances** (première cellule du notebook) :

```python
!pip install langchain langchain-community faiss-cpu sentence-transformers openai
```

**Gestion des clés API** : utilisez les **Secrets** de Colab (icône 🔑 dans le panneau de gauche) plutôt qu'un fichier `.env` :

```python
from google.colab import userdata
api_key = userdata.get("OPENROUTER_API_KEY")
```
**Soumission** : partagez le lien de votre Colab (bouton *Partager* → *Tous les utilisateurs ayant le lien*)

---

## Construire un corpus

Vous avez toute liberté pour choisir votre corpus. Vous pouvez utiliser un corpus existant ou en créer un nouveau.

Vous pouvez construire un corpus a partir d'un wiki d'une franchise (Pokemon, Marvel, Star Trek etc ). Explications dans [ce document](/courses/dlia/construire_corpus_wiki).



---

# Étapes de construction

## I) Ingestion — Préparation des données

### 1. Charger le corpus

Récupérez votre corpus sous forme de texte brut (`.txt`, `.md`, ou extrait d'un PDF).

Si vous partez d'un PDF, vous pouvez utiliser :
```python
from langchain_community.document_loaders import PyPDFLoader

loader = PyPDFLoader("mon_document.pdf")
pages = loader.load()
```

> Pour PyPDFLoader, installez : `pip install pypdf`


### 2. Découper le corpus en chunks

L'étape de **chunking** consiste à découper le corpus en morceaux de texte. Chaque morceau (*chunk*) contiendra l'information qui sera injectée dans le prompt du LLM.

**L'enjeu : trouver le bon équilibre.**

| Granularité | Problème |
|---|---|
| Phrase par phrase | Trop peu d'information : le contexte est perdu |
| Document entier | Trop d'information : le LLM est noyé et le contexte dépasse souvent la fenêtre |
| **Paragraphe (~500 tokens)** | **Bon compromis** : assez de contexte, pas trop de bruit |

Avec LangChain vous pouvez utiliser `from langchain.text_splitter import RecursiveCharacterTextSplitter`


### 3. Vectoriser les chunks (embeddings)

Chaque chunk est transformé en un **vecteur**  ou **embedding** qui capture son sens. Deux textes qui parlent du même sujet auront des vecteurs proches.

On utilise le modèle open source **all-MiniLM-L6-v2** qui produit des vecteurs de dimension 384  et la librairie `SentenceTransformer` de `sentence_transformers`


### 4. Stocker dans une base de données vectorielle

On stocke les embeddings dans **FAISS** (Facebook AI Similarity Search), une base de données vectorielle optimisée pour la recherche de similarité.


**Avec LangChain** c'est 2 lignes :

```python
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = FAISS.from_documents(chunks, embedding_model)
```

✅ **À la fin de cette étape**, vous avez une base de données vectorielle contenant les embeddings de votre corpus.


---

## II) Retrieval — Recherche d'information

Quand l'utilisateur pose une question, il faut retrouver les chunks les plus pertinents dans la base.

**Étapes :**

1. **Vectoriser la question** avec le même modèle d'embeddings
2. **Chercher les vecteurs les plus proches** dans FAISS (similarité cosinus)
3. **Récupérer les K meilleurs chunks**


---

## III) Génération de la réponse

On construit un prompt qui combine la question de l'utilisateur et les chunks récupérés, puis on l'envoie au LLM via OpenRouter.

### 1. Construire le prompt

```
Réponds à la question

{question de l'utilisateur}

avec les informations suivantes:

{les chunks récupérés}

```

A ce prompt, on peut rajouter

- un rôle : tu es expert dans le domaine X
- un style : tu réponds de manière concise
- un format : tu réponds en markdown




### 2. Appeler le LLM via OpenRouter

OpenRouter expose une API compatible OpenAI. On peut donc utiliser le package `openai` :

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)
```

> **Modèles gratuits sur OpenRouter** liste disponible sur [https://openrouter.ai/models?max_price=0](https://openrouter.ai/models?max_price=0))


---

## IV) Pour aller plus loin

### Évaluation de la qualité du RAG

Un RAG peut échouer de deux manières :
- **Mauvais retrieval** : les chunks récupérés ne sont pas pertinents → le LLM n'a pas la bonne information
- **Mauvaise génération** : les chunks sont bons mais le LLM les exploite mal (hallucination, résumé incomplet…)

Pour évaluer votre RAG, vous pouvez :

1. **Créer un mini jeu de test** : 5 à 10 paires (question, réponse attendue) écrites à la main à partir de votre corpus.

2. **Évaluer le retrieval** : pour chaque question, vérifiez que les chunks retournés contiennent bien l'information nécessaire.

3. **Évaluer la génération** : comparez la réponse du LLM avec votre réponse attendue. Vous pouvez le faire manuellement ou utiliser un LLM comme juge. (LLM-as-juge)

Exemple de prompt

```
Compare ces deux réponses et donne une note de 1 à 5 :
Question : {question}
Réponse attendue : {expected_answer}
Réponse du RAG : {rag_answer}

Note (1=hors sujet, 5=parfait) et justification :"""
```

4. **Métriques classiques (pour aller encore plus loin)** :
- **Retrieval** : Precision@K (proportion de chunks pertinents parmi les K retournés), Recall@K
- **Génération** : Faithfulness (la réponse est-elle fidèle aux chunks ?) et Relevance (la réponse répond-elle à la question ?)
- Des frameworks comme [RAGAS](https://docs.ragas.io/) automatisent ces métriques


### Reranking

La recherche vectorielle initiale est rapide mais approximative. Le **reranking** permet d'affiner les résultats en utilisant un modèle plus puissant (mais plus lent) qui évalue la pertinence de chaque chunk par rapport à la question.

On utilise un **cross-encoder** : un modèle qui prend en entrée la paire (question, chunk) et produit un score de pertinence.

```python
from sentence_transformers import CrossEncoder
reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
```

Le reranking se place entre le retrieval et la génération : on récupère d'abord K=10 ou 20 chunks avec FAISS (rapide), puis on les re-classe avec le cross-encoder pour ne garder que les 3-5 meilleurs.


### Interface web avec Streamlit

Streamlit est une bibliothèque Python qui permet de créer des interfaces web interactives en quelques lignes de code, sans aucune connaissance en HTML, CSS ou JavaScript. Vous écrivez un script Python classique, et Streamlit le transforme en une application web avec des champs de saisie, des boutons, du texte formaté, etc. C'est l'outil le plus utilisé pour prototyper rapidement des démos de projets data/IA.

Lancez votre app avec : `streamlit run app.py`