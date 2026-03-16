# Introduction au RAG — Retrieval Augmented Generation


## Le problème de départ

Les grands modèles de langage (LLM) comme GPT, Mistral ou Llama sont capables de générer du texte remarquablement fluide et cohérent. Mais ils ont des limites fondamentales :

- **Leur connaissance est figée.** Un LLM ne sait que ce qui était dans ses données d'entraînement. Il ne connaît pas les événements récents, ni les documents internes d'une entreprise, ni le contenu d'un PDF que vous venez de recevoir.

- **Ils inventent.** Quand un LLM ne connaît pas la réponse, il ne dit pas "je ne sais pas" : il génère une réponse plausible mais fausse. C'est ce qu'on appelle une **hallucination**.

- **Ils ne citent pas leurs sources.** Même quand la réponse est correcte, impossible de savoir d'où elle vient ni de la vérifier.

Le RAG est une architecture conçue pour résoudre ces trois problèmes.


## Le principe du RAG

L'idée est simple : plutôt que de compter sur la mémoire du LLM, on va **chercher l'information pertinente dans un corpus de documents**, puis **l'injecter dans le prompt** avant de poser la question au modèle.

Le LLM ne répond plus "de mémoire". Il répond en s'appuyant sur des extraits concrets qu'on lui fournit.

D'où le nom :

- **Retrieval** — on retrouve les passages pertinents dans une base documentaire
- **Augmented** — on enrichit le prompt avec ces passages
- **Generation** — le LLM génère sa réponse à partir de ce contexte enrichi

C'est l'équivalent de la différence entre répondre à un examen de mémoire (le LLM seul) et répondre à un examen avec documents autorisés (le RAG).


## Les deux phases d'un RAG

Un système RAG se décompose en deux grandes phases : une phase de préparation (hors ligne) et une phase de requête (en temps réel).


### Phase 1 — Ingestion (préparation du corpus)

Cette phase se fait une seule fois (ou à chaque mise à jour du corpus). Elle consiste à transformer les documents en une forme qui permet la recherche rapide.

**Étape 1 : Chargement des documents**

On rassemble les documents sources : PDF, pages web, fichiers texte, articles, documentation technique, etc. Ces documents sont convertis en texte brut exploitable.

**Étape 2 : Découpage en chunks**

Un document entier est trop long pour être injecté dans un prompt. Il faut le découper en morceaux (*chunks*) de taille raisonnable — typiquement de l'ordre du paragraphe.

Le découpage est une étape critique. Chaque chunk doit être suffisamment long pour porter du sens, mais suffisamment court pour être précis. On introduit généralement un **chevauchement** (*overlap*) entre les chunks successifs pour éviter de couper une idée en deux.

**Étape 3 : Vectorisation (embeddings)**

Chaque chunk est transformé en un **vecteur numérique** par un modèle d'embeddings. Ce vecteur capture le sens sémantique du texte : deux textes qui parlent du même sujet auront des vecteurs proches dans l'espace vectoriel, même s'ils utilisent des mots différents.

C'est ce qui permet de faire de la recherche par sens plutôt que par mots-clés.

**Étape 4 : Stockage dans une base vectorielle**

Les vecteurs sont stockés dans une base de données spécialisée (base vectorielle) qui permet de retrouver rapidement les vecteurs les plus proches d'un vecteur donné. C'est la structure de données qui rend la recherche par similarité possible à grande échelle.


### Phase 2 — Requête (en temps réel)

Quand un utilisateur pose une question, le système exécute les étapes suivantes :

**Étape 1 : Vectorisation de la question**

La question est transformée en vecteur avec le **même modèle d'embeddings** que celui utilisé pour les chunks. C'est essentiel : pour que la comparaison ait du sens, les vecteurs doivent vivre dans le même espace.

**Étape 2 : Recherche par similarité**

On cherche dans la base vectorielle les K chunks dont les vecteurs sont les plus proches de celui de la question. La proximité est mesurée par la **similarité cosinus** ou la **distance euclidienne** (L2).

On récupère ainsi les passages du corpus les plus susceptibles de contenir la réponse.

**Étape 3 : Construction du prompt**

On assemble un prompt qui contient :
- une instruction (rôle, format de réponse attendu)
- les chunks récupérés comme contexte
- la question de l'utilisateur

Le LLM reçoit donc toute l'information nécessaire pour répondre.

**Étape 4 : Génération de la réponse**

Le LLM génère sa réponse en s'appuyant sur le contexte fourni. Une bonne pratique est de lui demander explicitement de ne répondre qu'à partir des informations fournies, et de signaler quand il ne trouve pas la réponse.


## Qu'est-ce qu'un embedding ?

Un embedding est une représentation numérique d'un texte sous forme de vecteur (une liste de nombres). Un modèle d'embeddings est entraîné pour que des textes sémantiquement proches produisent des vecteurs proches.

Par exemple, les phrases "Le chat dort sur le canapé" et "Le félin sommeille sur le sofa" auront des vecteurs très proches, même si elles ne partagent quasiment aucun mot.

Cette propriété est ce qui rend le RAG plus puissant qu'une simple recherche par mots-clés : on cherche par **sens**, pas par correspondance lexicale.

Les vecteurs ont typiquement entre 384 et 1536 dimensions selon le modèle utilisé.


## Difficultés courantes

### Le chunking est un art

Le découpage en chunks est l'une des étapes les plus déterminantes et les plus sous-estimées. Un mauvais chunking entraîne un mauvais retrieval, et donc une mauvaise réponse, quel que soit le LLM utilisé.

- **Chunks trop petits** (phrase par phrase) : le contexte est perdu. Une phrase isolée comme "Ce taux est fixé à 3,5 %." n'a aucun sens sans le paragraphe qui l'entoure.
- **Chunks trop grands** (pages entières) : le signal est noyé dans le bruit. Le modèle d'embeddings a du mal à résumer un texte trop long en un seul vecteur, et le prompt devient trop volumineux.
- **Chunks mal alignés** : si le découpage coupe au milieu d'une idée, l'information est fragmentée entre deux chunks et aucun des deux ne suffit.

Il n'y a pas de taille universelle. Le bon réglage dépend du type de document et de la nature des questions attendues.

### Le retrieval n'est pas toujours pertinent

La recherche vectorielle repose sur la similarité sémantique, qui n'est pas toujours alignée avec la pertinence réelle.

- Une question et un chunk peuvent partager le même vocabulaire sans que le chunk contienne la réponse.
- La réponse peut nécessiter de combiner des informations dispersées dans plusieurs chunks éloignés dans le corpus.
- Les questions complexes, ambiguës ou multi-parties sont souvent mal servies par une simple recherche de similarité.

C'est pour cela qu'on ajoute parfois une étape de **reranking** : un second modèle, plus lent mais plus précis, réévalue les chunks candidats en les comparant directement à la question.

### Le LLM peut toujours halluciner

Même avec les bons chunks dans le prompt, le LLM peut :

- Ignorer le contexte fourni et répondre de mémoire
- Mélanger les informations de plusieurs chunks de manière incorrecte
- Ajouter des détails qui ne figurent pas dans les sources

Le prompt engineering joue un rôle important : il faut instruire le modèle de ne se baser que sur le contexte fourni. Mais ce n'est jamais une garantie absolue.

### La fenêtre de contexte a ses limites

Chaque LLM a une taille maximale de prompt (la *fenêtre de contexte*), mesurée en tokens. Si on injecte trop de chunks, on dépasse cette limite. Il faut donc sélectionner judicieusement le nombre de chunks à inclure, ce qui revient à faire un compromis entre exhaustivité et faisabilité.


## En résumé

Le RAG est une architecture qui permet de donner à un LLM l'accès à des connaissances spécifiques, à jour et vérifiables, sans avoir à le réentraîner. Il repose sur une idée simple — chercher puis générer — mais chaque étape du pipeline (chunking, embeddings, retrieval, prompt, génération) comporte des choix qui influencent directement la qualité du résultat final.

C'est aujourd'hui l'une des architectures les plus déployées en production pour les applications d'IA générative en entreprise.
