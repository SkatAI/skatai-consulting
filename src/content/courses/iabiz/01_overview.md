---
layout: slides
title: "IA for Business"
slides_project_home: /iabiz/overview/
footer: 'Alexis Perrier - SkatAI.com/iabiz/overview/'
---
<!--
_class: centered
 -->

# L'Intelligence Artificielle ?

---

# Promesses

Beaucoup de promesses d'efficacité de gain de temps.

En realité, un melange de savonette et de fadeur et d'experiences bluffantes.

Notion de jagged frontier.

- l'IA trebuche sur certaines taches evidentes pour un humain
- mais excelle et depasse les humains dans des domaines d'excellence


ce matin:
<img src="/assets/images/iabiz/strawberry.png" alt="R dans strawberry" width = 800 style = "background-color: #000; padding:20px; display: block; margin: auto;">

---

<img src="/assets/images/iabiz/strawberry_take_2.png" alt="R dans strawberry" width = 800 style = "background-color: #000; padding:20px; display: block; margin: auto;">

---

# Evolution de l'IA

Ethan Mollick prof à Wharton

- Une loutre dans un avion qui utilise le wifi

même prompt depuis 2021

[otter on a plane using wifi](https://www.oneusefulthing.org/p/the-recent-history-of-ai-in-32-otters)



---


# Historique de l'IA Générative

## Nuit des temps
- Ferdinand de Saussure : Cours de linguistique générale, publié en 1916
- Noam Chomsky : Syntactic Structures (1957)
- Emile Benveniste : Problèmes de linguistique générale (recueil, 1966)

## Google translate
- Google Translate a été lancé le 28 avril 2006.

## Avant 2013 : NLP classique (Natural Language Processing)
- Approches symboliques et statistiques
- N-grams, TF-IDF
- Modèles de langage probabilistes

## 2013 - Word2Vec (Google)
- **Embeddings** vectoriels pour les mots
- Capture des relations sémantiques

## 2014 - Seq2Seq et Attention

- Sequence-to-Sequence models pour la traduction
- Premiers mécanismes d'attention

## 2017 - Transformers ("Attention Is All You Need")

- Architecture de deep learning / reseaux de neurones


## 2018 - BERT (Google) - 1er LLM
- Bidirectional Encoder Representations
- Compréhension du contexte bidirectionnel

## 2018 - GPT-1 (OpenAI)
- 117M paramètres
- Démonstration du transfer learning

## 2019 - GPT-2 (OpenAI)
- 1.5B paramètres
- "Too dangerous to release" (initialement)
- Génération de texte cohérente

## 2020 - GPT-3 (OpenAI)
- 175B paramètres
- Few-shot learning
- Capacités émergentes

## 2021 - DALL-E (OpenAI)
- Text-to-image generation
- 12B paramètres

## 2022 - ChatGPT (OpenAI)
- Lancement public (novembre)
- RLHF (Reinforcement Learning from Human Feedback)
- Adoption massive grand public

## 2022 - Stable Diffusion
- Open source text-to-image
- Diffusion models démocratisés

## 2023 - GPT-4 (OpenAI)
- Multimodal (texte + images)
- Capacités de raisonnement améliorées

## 2023 - LLaMA (Meta)
- **Open source LLM**
- Différentes tailles (7B à 65B)
- un modele open source parmi tant d'autres

## 2023 - Claude (Anthropic)
- Focus sur la sécurité et l'alignement

## 2024-25
- Modèles multimodaux avancés
- agents
- ingenierie

## 2026 - ...

- autres types de modèles IA (Yan Lecunn)

---

<img src="/assets/images/inwai/history_nlp_timeline.webp" alt="nlp history" width=1200 class="center">

[NLP Timeline](https://blog.dataiku.com/nlp-metamorphosis)


---

<!--
_class: centered
 -->


# NLP classique

---


# Le langage est... compliqué

<div class="columns" markdown="1">
<div markdown="1">

**Homonymie**
<div class="note">
- Je vais acheter un livre.
- Il pèse dix livres.
- Il livre des colis toute la journée.
</div>
</div>
<div markdown="1">

<div class="note">
- Mangeons **,** grand-père.
- Mangeons grand-père.
</div>


<div class="note">
- Poser un lapin
- Je ne sais pas si je ne viendrai pas
- I'm bad (Michael Jackson)
- Septante, acronymes, ...
</div>
</div>

</div>



---

# Le langage est... compliqué

- Longueur variable
- Grande variété de complexité selon les langues
    - Allemand : `Donaudampfschiffahrtsgesellschaftskapitän` (5 "mots")
    - Chinois : 50 000 caractères différents (2-3k pour lire un journal)
    - Langues slaves : Formes de mots différentes selon le genre, le cas, le temps
- Encodage : unicode vs Ascii
- Données non structurées
- code switching
- idiomes, argot générationnel, slang

---

# NLP classique

- Text mining
- **NER** : Named Entity Recognition : LOC, PER,
- **POS** : Part of Speech Tagging : noms, adjectifs, verbes, ...
- **Classification** : analyse de sentiment, spam, hate speech, ...
- Identification de **topic**, topic modeling
- **WSD** : word sense disambiguation : bank, fly
- **STT** : speech to text, text to speech

et des tâches plus difficiles telles que
- **Traduction** automatique, résumé, question answering

---
# NLP classique

- déterministe (non probabiliste - LLMs)
- basé sur la décomposition du texte en éléments identifiables : mots, rôles grammaticaux, entités, etc.
- appliqué aux phrases, syntagmes nominaux, mots
- inclut des méthodes de pré-traitement du texte brut pour faciliter le traitement
    - stop words : _et_, _le_, _de_, etc.
    - stemming : _universités_, _universel_, _univers_ -> _univer_ (le sens est souvent perdu)
    - lemmatization : _cours_, _courir_, _couru_ -> _courir_ (plus efficace que le stemming)
    - subword tokenization : "malheureux" → ["mal", "heur", "eux"]

Nécessite des modèles, des règles qui sont spécifiques à chaque langue. Le russe ou le français ont besoin de lemmatizers différents de l'anglais.

---

# Tokenization
**Quelle est l'unité du texte ?**

On pourrait travailler avec
- des mots, syllabes, tokens, lettres et ponctuation
- des Bigrams, n-grams : New York, cul-de-sac, pain au chocolat
- des syntagmes nominaux : groupe de mots qui fonctionne comme un nom : _le gros chien brun avec des taches_
- des phrases, paragraphes, tweets, articles, livres, commentaires
- un Corpus : un ensemble complet de textes

Il faut gérer
- Le vocabulaire est large / infini et change rapidement
- Les fautes de frappe, orthographes multiples
- les formes de mots : pluriel, déclinaison (maison, foyer), conjugaison, etc.

---
# Démo NLP classique : NER et POS

[https://cloud.google.com/natural-language](https://cloud.google.com/natural-language)

Entrez du texte :

_"Like everyone, we have definitely felt the impact of AI Overviews. There is only one direction of travel; not only are AIs getting better, but they're getting better in an exponential fashion," said Sean Cornwell, chief executive of Immediate Media, which owns the Radio Times and Good Food brands in the UK._


---

# POS : part of speech et dependency tagging

<div class="columns" markdown="1">
<div markdown="1">
<img src="/assets/images/inwai/google_NLP_demo_POS_start.jpg" width=600 class="center">
</div>
<div markdown="1">
<img src="/assets/images/inwai/google_NLP_demo_POS_end.jpg" width=600 class="center">
</div>
</div>

Malheureusement, cette fonctionnalité n'est plus disponible dans la démo NLP de Google.

---

# Tokens et LLMs

- Context Window = mesuré en tokens, pas en mots : fenêtre de 1M tokens, fenêtre de 200k tokens, ...
- Pricing Model = coût par token (entrée + sortie)
- Texte non-anglais = plus de tokens nécessaires
- Token Limits = pourquoi les réponses sont coupées
- Tâches au niveau des caractères = difficiles (les LLMs voient des tokens, pas des lettres)
- L'efficacité varie = selon la langue, le domaine, la complexité

---

# Tarification basée sur les tokens

[https://openai.com/api/pricing/](https://openai.com/api/pricing/)

<img src="/assets/images/inwai/openai_pricing_tokens.png" alt="openai pricing" width=800 class="center">

---

# NLP moderne (post 2013)


voir [ces slides](/ml2llm/modern-nlp/)

---

<!--
_class: centered
 -->



# LLMs

**Large Language Models**

**Grands modèles de langage**

---
# Tokens, temperature

**génération de texte :**

- prediction du prochain token suivant une distribution de probabilité

<img src="/assets/images/inwai/agents_001.webp" alt="Generation" width = 800 style = "background-color: #000; padding:20px; display: block; margin: auto;">

Autre exemple

_Hier soir j'ai mangé_
- de la pizza
- des broccoli
- des huitres
- un camion



- **fenêtre de contexte** et tokens:
    - 1 token ≈ 0.75 mot, 1 page ~200 a 300 mots,
    - 1M tokens = 1.3 Guerre et Paix

- **température** : paramètre qui permet de changer la distribution de probabilité des tokens
    - plus ou moins de **créativité**
    - plus ou moins d'**hallucinations**
    - `temperature = 0` ne veut pas dire determinisme

---

# Donc

- un LLM a une mémoire limité

- un LLM fait des réponses aléatoires



---

# Pourquoi les tokens

- décomposition à peu près syllabique
- meilleure façon de compléter / prédire la suite d'un texte;
    - pas de mots inconnus (OOV)
    - vocabulaire de volume fini et de taille limitée,
    - robuste vis à vis des **erreurs de frappes**, des **formes** des mots : conjugaisons, déclinaisons, accords etc
- le nombre de token dicte les **coûts des requêtes** vers les API.
    - variation de prix par langue : Français plus cher que Anglais (x1.2)

---
# token based pricing

<img src="/assets/images/inwai/openai_pricing_tokens.png" alt="OpenAI Pricing" width = 800 style = "background-color: #000; padding:20px; display: block; margin: auto;">

[OpenAI pricing](https://openai.com/api/pricing/)

---
# embeddings - vectorisation du texte

- texte -> vecteur
- cela donne une distance entre les textes qui respecte le sens des mots
- similarité sémantique : `d(chat, chien)  < d(chat, banane)`
- il y a des modèles exclusivement dédiés à la création d'embeddings

<img src="/assets/images/inwai/word-embeddings.png" alt="Word Embeddings" width = 800 style = "background-color: #000; padding:20px; display: block; margin: auto;">


---

# Le plateformes de type chatbot

- **plateforme** : [chatgpt.com](https://chatgpt.com/), [claude.ai](https://claude.ai/), [Mistral Le chat](https://chat.mistral.ai/chat)
    - mais aussi : deepseek, qwen, gemini, ...
- **API**: le code envoie une requête (_prompt + modèle_) vers une url (_endpoint_), et le serveur retourne le contenu demandé. vrai pour tout le web et pour les LLMs.
    - le coût peut être important
    - pléthore de modèles
> Pour les acteurs de type OpenAI, Claude, etc : abonnement et API sont facturés distinctement


---
# Les plateformes specialisées

Voici une **liste élargie de plateformes et services d’IA spécialisés**, classés par type d’usage pour te donner un aperçu plus utile que juste une liste brute :

**Génération d’images / visuels**

* **Midjourney** – création d’images à partir de textes ultra esthétique.
* **DALL-E** – générateur d’images (OpenAI).
* **Stable Diffusion** – open-source pour créations et modifications d’images.
* **Bing Image Creator** – IA image par Microsoft.
* **Runway AI** – outils créatifs incluant génération et édition d’images/vidéos.

**Assistant de recherche / gestion des connaissances**

* **NotebookLM** – IA pour travailler, annoter et exploiter tes propres documents.
* **Perplexity AI** – moteur de recherche IA avec réponses sourcées.
* **Deep Research / Elicit** – recherche avancée IA de contenus académiques ou techniques.

**Création d’applications / développement**

* **Lovable** – IA pour générer des applications web complètes sans coder.

**Automatisation & productivité**

* **n8n** – automatisation de tâches via IA et workflows.
* **Manus** – automatisation IA pour processus métier.
* **Notion Q&A / Guru** – gestion et extraction de connaissance IA dans les bases.

**Création vidéo / audio**

* **Synthesia** – génération vidéo IA avec avatars.
* **Google VEO** – outil de création vidéo.
* **HeyGen** – plateforme vidéo IA.
* **ElevenLabs** – synthèse vocale réaliste.

**Marketing & contenus social**

* **Predis.ai** – génération de contenus pour pubs et réseaux sociaux.
* **AdCreative / Albert.ai / SE Ranking** – IA marketing & SEO.
* **Brevo IA** – automatisation marketing complet.

**Support client & prospection**

* **Zendesk IA** – support client automatisé.
* **Clay** – prospection IA avec enrichissement de leads.
* **Crisp IA** – support client RGPD friendly.

**IA tout-en-un / plateformes multiplateformes**

* **ChatGPT (OpenAI)** – assistant IA généraliste multitudes de tâches.
* **Gemini / Claude / Grok** – autres assistants IA puissants.
* **Lumio AI** – interface multi-modèles (ChatGPT, Claude, Gemini…) pour tester différents LLM dans un seul endroit.

**Éducation & contenus pédagogiques**

* **Mexty.ai** – IA pour création de contenus éducatifs interactifs.



---

- plateforme **fédératrice de modèles** via API
    - [huggingface](https://huggingface.co/) : tous les modèles, LLMs et autres. Le repository mondial.
    - [groq](https://groq.com/) (pas gro**k**) , [open routeur](https://openrouter.ai/) (modèles open source + rapidité)

---

- en **local**. [Ollama](https://ollama.com/). on download le LLM et on le fait tourner en local. donc petit LLM, ok pour des tâches très spécifiques. gratuit. mais nécessite machine puissante.


---

# Pléthore de modèles


<img src="/assets/images/inwai/huggingface-2024-ai-timeline.png" alt="2024 AI Timeline" width =800 style = "background-color: #FFF; padding:20px; display: block; margin: auto;">

[2024 AI Timeline - Hugginface release dashboards](https://huggingface.co/spaces/reach-vb/2024-ai-timeline)

Distinction majeure entre les modèles open source et closed source


---
# Opensource vs Proprietaire: software

<div class="columns">
<div>

**Open source:**

- Le code est public : [Linux](https://github.com/torvalds/linux)
- Linux, OpenOffice, Firefox, Chromium, Python, grandes bases de données,
- Peut être copié et modifié par **n'importe qui**

<img src="/assets/images/inwai/linux-logo.png" alt="Open source" width = 400 style = "background-color: #FFF; padding:20px">

</div>
<div>

**Closed source:**

- Le code n'est pas accessible.
- Windows, Word, Chrome, Edge, Oracle
- nécessite une licence pour utiliser, boîte noire

<img src="/assets/images/inwai/windows.jpg" alt="Closed source" width = 200 style = "background-color: #FFF; padding:20px">

</div>
</div>

---

# Open source LLMs

Différents niveaux d'ouverture :

- **modèle** : vous pouvez télécharger le modèle et l'utiliser tel quel => **open weights**
- **code** : le code pour créer le modèle
- **données d'entraînement** : les données utilisées pour entraîner le modèle

Certains modèles sont entièrement ouverts (DeepSeek), partiellement ouverts (**Llama**, Mistral 7B), ou fermés (OpenAI o1, Claude Sonnet, Gemini)

Si vous avez les poids d'un modèle vous pouvez le **fine-tuner** sur vos propres données. Version allégée de l'entraînement d'un modèle complet

---

<!--
_class: centered
 -->

# Evaluation des LLMs, les benchmarks

---
# Performances comparées: LLM Benchmarks

**Comment évaluer et comparer les LLMs ?**

Les **benchmarks LLM** sont des suites de tests qui mesurent la performance des grands modèles de langage sur différentes tâches, comme répondre à des questions, résoudre des problèmes, ou écrire du texte. Ils permettent de comparer les modèles côte à côte.

**Défis** :
Les benchmarks ne reflètent pas toujours l'usage du monde réel, peuvent devenir **obsolètes** rapidement, et les modèles s'entraînent souvent  sur les tests, ce qui signifie que des scores élevés ne garantissent pas toujours une meilleure utilité.

---
<div class="columns" markdown="1">

<div markdown="1">

**Benchmarks traditionnels :**
- [MMLU](https://en.wikipedia.org/wiki/MMLU) Massive Multitask Language Understanding : 16 000 questions à choix multiples
- [HellaSwag](https://github.com/rowanz/hellaswag) : Une machine peut-elle vraiment finir votre phrase ?
- [HumanEval](https://github.com/openai/human-eval) : Génération de code
- [GSM8K](https://www.kaggle.com/datasets/thedevastator/grade-school-math-8k-q-a) Problèmes de mathématiques : 8K Q&R niveau école primaire

**Problème** : Les modèles saturent rapidement ces tests

</div>

<div markdown="1">

**La nouvelle frontière :**
- **[GPQA Diamond](https://arxiv.org/abs/2311.12022)** : 198 QCM en biologie, chimie et physique, du niveau "licence difficile" au "niveau post-diplôme".
- **[LiveCodeBench](https://livecodebench.github.io/)** : benchmark d'évaluation sans contamination des LLMs pour le code qui collecte continuellement de nouveaux problèmes
- **[Humanity's Last Exam](https://agi.safe.ai/)** : questions de près de 1 000 contributeurs experts de plus de 500 institutions dans 50 pays – composé principalement de professeurs, chercheurs et titulaires de diplômes supérieurs.

Ceux-ci représentent **les limites cognitives de l'humanité**

</div>

</div>

---

# Artificial Analysis Intellligence Index


<img src="/assets/images/inwai/aaai.png" alt="AI Index" width="1100">


[Artificial Analysis Intelligence Index](https://artificialanalysis.ai/evaluations/artificial-analysis-intelligence-index) combine les performances sur sept évaluations : MMLU-Pro, GPQA Diamond, Humanity's Last Exam, LiveCodeBench, SciCode, AIME 2025, et IFBench.

---

# Score vs release date

<img src="/assets/images/inwai/aaai_score_date.png" alt="AI Index" width="1100">



---
# La course: open source vs propriétaires

![Closed-source vs. Open-weight models (MMLU, 5-shot) performance comparison over time from 2022-04 to 2024-04](/assets/images/inwai/OS_perf_vs_closed.jpg)

**Les modèles open source rattrapent les modèles closed source**

---
# Performance vs Cost - 08/2025

<img src="/assets/images/inwai/perf_vs_cost_updated_082025.jpg" alt="Performance vs Cost" width ="80%" style = "background-color: #000; padding:20px; display: block; margin: auto;">

---
# LM arena

<img src="/assets/images/inwai/lmarena_leaderboard_20250825.png" alt="LM arena" width ="100%" style = "background-color: #000; padding:20px; display: block; margin: auto;">

[LM arena](https://lmarena.ai/leaderboard/)

---

# Types de LLMs

* **Licences** : open source ↔ propriétaires
* **Taille & usage** :
    - Mini-LLMs → Mid-size / spécialisés → Modèles de fondation
    - généraux → multi tâches → spécialisés
* **Langues** : monolingues → multilingues
* **Déploiement** : local, cloud, embarqués (on-device)
* **Entraînement** : from scratch, fine-tuné
* **Formats** : textuels, multimodaux
* **Modes d’utilisation** : plateforme web ou application, API, intégration locale

---
<!--
_class: centered_
 -->

# Agents
# LLMs augmentés

du LLM au LLM agentic : mémoire, outils, planification

---
# Agent mode


les agents: [newsletter.maartengrootendorst.com/p/a-visual-guide-to-llm-agents](https://newsletter.maartengrootendorst.com/p/a-visual-guide-to-llm-agents)


- **mémoire** :
    - courte : résumé de chaque étape de la conversation dans le prompt
    - longue : base de données

- **outils**: websearch,  etc
    - **Routing**: étape du choix de l'outil

- **planification** : Prompt chaining : décomposition de la requête en plusieurs sous tâches
- [LLM augmenté par Anthropic](https://www.anthropic.com/engineering/building-effective-agents)

- Agent mode: planification + outils + mémoire + ... **instance serveur**

- **MCP** : standard "universel" de connection. LLM a accès aux sources
    - connection à Notion, Excel, Canva

---

# Prompt

- le contexte
- le guider, l'aider à décomposer
- des exemples si besoin pour ancrer


- démarrer simple, passer progressivement au plus compliqué

Mon temps: écrire des spécifications comme prompts

---
# system prompt vs user prompt

personnalité des modèles: le prompt system

Un prompt système est le fichier de politique et de personnalité de niveau racine que chaque demande d'utilisateur doit respecter. ... 'le manuel non officiel' des vraies capacités et garde-fous d'un modèle.



---
# Claude 4 system prompt

[claude 4 system prompt by simon Willison](https://simonwillison.net/2025/May/25/claude-4-system-prompt/)

- [personnality](https://simonwillison.net/2025/May/25/claude-4-system-prompt/#establishing-the-model-s-personality)
- [safety](https://simonwillison.net/2025/May/25/claude-4-system-prompt/#establishing-the-model-s-personality)
- [sycophant](https://simonwillison.net/2025/May/25/claude-4-system-prompt/#establishing-the-model-s-personality)

---

#  focus sur chatGPT
- custom chatGPTs
- websearch
- deep search
- [agent mode](https://openai.com/index/introducing-chatgpt-agent/)

---
# sources d'info

- les personnes à suivre: [Ethan Mollick](https://www.oneusefulthing.org/), [Simon Willinson](https://simonwillison.net/),
- [The Neuron](https://theneuron.ai/)
- [The Rundown AI](https://www.therundown.ai/p/alterego-debuts-near-telepathic-ai-wearable)

- [evolution génération d'image](https://www.oneusefulthing.org/p/the-recent-history-of-ai-in-32-otters)
- podcast: latent space + a16z
- [Mike Caulfield](https://mikecaulfield.substack.com/p/is-the-llm-response-wrong-or-have) : do a second pass without putting a thumb on the scale almost always leads to a better result.

- [Claude et Excel](https://www.anthropic.com/news/create-files) et [ici](https://bsky.app/profile/emollick.bsky.social/post/3lyhauhtzlk24)
