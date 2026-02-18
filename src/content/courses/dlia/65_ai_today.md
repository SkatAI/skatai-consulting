---
layout: slides
title: "L'IA aujourd'hui"
page_title: "L'IA aujourd'hui"
slides_project_home: /courses/dlia/
---

<TitleSlide>

# L'IA aujourd'hui (février 2026)

</TitleSlide>


---

<TitleSlide>

# L'ecosystème IA

</TitleSlide>


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

Voici une **liste élargie de plateformes et services d’IA spécialisés**

**IA tout-en-un / plateformes multiplateformes**

* **ChatGPT (OpenAI)** – assistant IA généraliste multitudes de tâches.
* **Gemini / Claude / Grok** – autres assistants IA puissants.
* **Lumio AI** – interface multi-modèles (ChatGPT, Claude, Gemini…) pour tester différents LLM dans un seul endroit.

---

**Génération d’images / visuels**

* **Midjourney** – création d’images à partir de textes ultra esthétique.
* **DALL-E** – générateur d’images (OpenAI).
* **Stable Diffusion** – open-source pour créations et modifications d’images.
* **Bing Image Creator** – IA image par Microsoft.
* **Runway AI** – outils créatifs incluant génération et édition d’images/vidéos.


**Création vidéo / audio**

* **Synthesia** – génération vidéo IA avec avatars.
* **Google VEO** – outil de création vidéo.
* **HeyGen** – plateforme vidéo IA.
* **ElevenLabs** – synthèse vocale réaliste.

---

Mais aussi

**Assistant de recherche / gestion des connaissances**

* **NotebookLM** – IA pour travailler, annoter et exploiter tes propres documents.
* **Perplexity AI** – moteur de recherche IA avec réponses sourcées.
* **Deep Research / Elicit** – recherche avancée IA de contenus académiques ou techniques.

**Création d’applications / développement**

* **Lovable** – IA pour générer des applications web complètes sans coder.

---

**Marketing & contenus social**

* **Predis.ai** – génération de contenus pour pubs et réseaux sociaux.
* **AdCreative / Albert.ai / SE Ranking** – IA marketing & SEO.
* **Brevo IA** – automatisation marketing complet.

**Automatisation & productivité**

* **n8n**, **Zapier**, **make** – automatisation de tâches via IA et workflows.
<!-- * **Notion Q&A / Guru** – gestion et extraction de connaissance IA dans les bases. -->

---

**Support client & prospection**

* **Zendesk IA** – support client automatisé.
* **Clay** – prospection IA avec enrichissement de leads.
* **Crisp IA** – support client RGPD friendly.


**Éducation & contenus pédagogiques**

* **Mexty.ai** – IA pour création de contenus éducatifs interactifs.


---

# Plateformes de modèles

- plateforme **fédératrice de modèles** via API
    - [huggingface](https://huggingface.co/) : tous les modèles, LLMs et autres. Le repository mondial.
    - [groq](https://groq.com/) (pas gro**k**) ,
    - [open routeur](https://openrouter.ai/) (modèles open source + rapidité)
    - [Ollama](https://ollama.com/) : modèles open source locaux


En **local**. [Ollama](https://ollama.com/). on download le LLM et on le fait tourner en local. donc petit LLM, ok pour des tâches très spécifiques. gratuit. mais nécessite machine puissante.


---

# Pléthore de modèles


<img src="/images/inwai/huggingface-2024-ai-timeline.png" alt="2024 AI Timeline" width =800 style = "background-color: #FFF; padding:20px; display: block; margin: auto;">

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

<img src="/images/inwai/linux-logo.png" alt="Open source" width = 400 style = "background-color: #FFF; padding:20px">

</div>
<div>

**Closed source:**

- Le code n'est pas accessible.
- Windows, Word, Chrome, Edge, Oracle
- nécessite une licence pour utiliser, boîte noire

<img src="/images/inwai/windows.jpg" alt="Closed source" width = 200 style = "background-color: #FFF; padding:20px">

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

<TitleSlide>

# Evaluation des LLMs, les benchmarks

</TitleSlide>

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


<img src="/images/inwai/aaai.png" alt="AI Index" width="1100">


[Artificial Analysis Intelligence Index](https://artificialanalysis.ai/evaluations/artificial-analysis-intelligence-index) combine les performances sur sept évaluations : MMLU-Pro, GPQA Diamond, Humanity's Last Exam, LiveCodeBench, SciCode, AIME 2025, et IFBench.

---

# Score vs release date

<img src="/images/inwai/aaai_score_date.png" alt="AI Index" width="1100">



---

# La course: open source vs propriétaires

![Closed-source vs. Open-weight models (MMLU, 5-shot) performance comparison over time from 2022-04 to 2024-04](/images/inwai/OS_perf_vs_closed.jpg)

**Les modèles open source rattrapent les modèles closed source**

---

## Comparaison plus récente

<img src="/images/dlia/closed-source_vs_open-source-scaled.webp" alt="Closed-source vs. Open-weight models (MMLU, 5-shot) performance comparison over time from 2022-04 to 2024-04" width="1100">

---

## Performance vs Cost - 08/2025

<img src="/images/inwai/perf_vs_cost_updated_082025.jpg" alt="Performance vs Cost" width ="80%" style = "background-color: #000; padding:20px; display: block; margin: auto;">

---

## LM arena

[LM arena](https://lmarena.ai/leaderboard/)

<img src="/images/inwai/lmarena_leaderboard_20250825.png" alt="LM arena" width ="100%" style = "background-color: #000; padding:20px; display: block; margin: auto;">


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

<TitleSlide>

# Agents

</TitleSlide>

---


# Today

we talk about LLMs but when you use a AI interface you are using an Agent, an Augmented LLM

- web search
- planning
- reviewing
- image creation
- reasonning
- memory
- etc


---

<TitleSlide>

# The Augmented LLM

</TitleSlide>

---

# Limitations of LLMs

Stand alone models:

- cutoff date
- limited access to data sources
- can't take actions
- hallucinations
- bias


---

# Building effective agents - Anthropic

<div class="note small">
The basic building block of agentic systems is an LLM enhanced with augmentations such as retrieval, tools, and memory.
</div>

<div class="center">

<img src="/images/inwai/augmented_LLM_anthropic.webp" alt="Augmented LLM" width="700"  class="center"/>

[Anthropic - Building effective agents ](https://www.anthropic.com/engineering/building-effective-agents)
</div>

---

# Traditional LLMs

<img src="/images/inwai/agents_001.webp" alt="LLM" width="700"  class="center"/>

<img src="/images/inwai/agents_002.webp" alt="LLM" width="700"  class="center"/>

<div class="center">

[A Visual Guide to LLM Agents](https://newsletter.maartengrootendorst.com/p/a-visual-guide-to-llm-agents) by [Maarten Grootendorst](https://www.maartengrootendorst.com/)

</div>

---

# issues

No memory
<img src="/images/inwai/agents/agents_003.1.webp" alt="LLM" width="650"  class="center"/>
wrong answer
<img src="/images/inwai/agents/agents_003.webp" alt="LLM" width="650"  class="center"/>


---

## What Are LLM Agents?

LLM Agents enhance basic language models with external tools, memory, and planning capabilities to interact autonomously with their environment.

- Traditional LLMs only predict next tokens and lack memory
- Agents = LLM + Tools + Memory + Planning
- Perceive environment through text, act through tools
- Varying degrees of autonomy based on system design

<img src="/images/inwai/agents/agents_004.webp" alt="LLM" width="650"  class="center"/>


---

## Core Components of Agents
**Three essential components enable LLM Agents to function effectively in complex environments.**

- **Memory**: Stores conversation history and past actions
- **Tools**: External systems for data retrieval and actions
- **Planning**: Reasoning and decision-making capabilities
- Components work together for autonomous behavior

<img src="/images/inwai/agents/agents_005.webp" alt="LLM" width="650"  class="center"/>

---

# Anthopomorphising

- 🦵 Web browsing
- 📚 File upload - projects - knowledge base
- 🧠 Dynamic memory
- 👁️ Streaming
- 🖐️ Function calling
- 👄 speech
- 👂 voice



---

## Memory Systems
**Agents use short-term and long-term memory to maintain context and learn from interactions.**

- **Short-term memory**: Uses context window for immediate context
- **Long-term memory**: External vector databases (RAG)
- Conversation summarization for efficiency
- Different memory types: semantic, working, episodic, procedural

---

# Short term memory

Each prompt + output is summarized and added to the context window

<img src="/images/inwai/agents/agents_006.webp" alt="LLM" width="650"  class="center"/>


---

# Long term memory : RAG



- Each prompt + output is summarized and added to a database
- vector search (embeddings) is used to find the most relevant information
- relevant info is added to the new user prompt

<img src="/images/inwai/agents/agents_007.webp" alt="LLM" width="650"  class="center"/>

RAG: retreival augmented generation

---

## Tools and Function Calling
**Tools extend LLM capabilities by connecting to external APIs and services.**

- Fetch real-time data and take actions
- Function calling through JSON-formatted requests
- Model Context Protocol (MCP) standardizes API access

<img src="/images/inwai/agents/agents_008.webp" alt="LLM" width="650"  class="center"/>


---

## Planning Through Reasoning
**Planning breaks complex tasks into actionable steps through reasoning techniques.**

- Chain-of-Thought prompting enables step-by-step thinking
- Few-shot vs zero-shot prompting approaches
- Fine-tuning models for reasoning (e.g., DeepSeek-R1)
- Iterative refinement of plans based on outcomes

instead of having LLMs learn “what” to answer they learn “how” to answer!

<img src="/images/inwai/agents/agents_009.webp" alt="LLM" width="650"  class="center"/>

---

## ReAct Framework
**ReAct combines reasoning and acting in a structured cycle for autonomous behavior.**

- **Thought**: Reasoning about current situation
- **Action**: Executing tools or operations
- **Observation**: Analyzing action results
- Continues until task completion

<img src="/images/inwai/agents/agents_010.0.webp" alt="LLM" style="width: 650px; background-color: #fff; margin: 0 auto;"/>
<img src="/images/inwai/agents/agents_010.webp" alt="LLM" style="width: 650px; background-color: #fff; margin: 0 auto;"/>

---

## Self-Reflection and Learning
**Agents improve through reflection on past failures and successes.**

- **Reflexion**: Verbal reinforcement from prior failures
- Three roles: Actor, Evaluator, Self-reflection
- **SELF-REFINE**: Iterative output refinement
- Memory modules track reflections for future use

<img src="/images/inwai/agents/agents_011.webp" alt="LLM" width="650"  class="center"/>

---

## Multi-Agent Systems
**Multiple specialized agents collaborate to solve complex problems.**

- Each agent has specific tools and expertise
- Supervisor orchestrates agent communication
- Reduces complexity through specialization
- Examples: AutoGen, MetaGPT, CAMEL frameworks

<img src="/images/inwai/agents/agents_012.webp" alt="LLM" width="650"  class="center"/>

---

<TitleSlide>

# MCP — Model Context Protocol
#### Le standard universel qui connecte l'IA au monde réel

</TitleSlide>

---

## MCP — Le problème et la solution

### Le problème : N × M intégrations

Imaginez que vous avez **3 modèles d'IA** (Claude, GPT, Gemini) et **5 outils** (Gmail, Slack, GitHub, Google Drive, une base de données).

**Sans standard commun**, il faut construire un connecteur spécifique pour chaque paire :

```
              Gmail   Slack   GitHub   Drive   PostgreSQL
Claude          ✗       ✗       ✗       ✗         ✗        → 5 connecteurs
GPT             ✗       ✗       ✗       ✗         ✗        → 5 connecteurs
Gemini          ✗       ✗       ✗       ✗         ✗        → 5 connecteurs
                                                            ──────────────
                                                Total :     15 connecteurs custom
```

À chaque nouveau modèle ou nouvel outil, le nombre de connecteurs **explose** (N × M).

### La solution : MCP comme langue commune

Avec MCP, chaque outil implémente le protocole **une seule fois**, et chaque modèle le comprend **une seule fois** :

```
Claude  ─┐                    ┌─ Gmail
GPT     ─┤◄── MCP protocol ──►├─ Slack
Gemini  ─┘                    ├─ GitHub
                              ├─ Drive
                              └─ PostgreSQL

Total : 3 + 5 = 8 implémentations (au lieu de 15)
```

Plus il y a de modèles et d'outils, plus l'avantage est massif.

---

## MCP — Qui, quand, adoption

### Chronologie

| Date | Événement |
|------|-----------|
| **Novembre 2024** | Anthropic publie MCP en open source. Origine : un développeur frustré de copier-coller du code entre Claude et son éditeur |
| **Mars 2025** | OpenAI adopte MCP. Sam Altman tweete : "People love MCP" |
| **Avril 2025** | Google DeepMind confirme le support MCP dans Gemini |
| **Mai 2025** | Microsoft et GitHub rejoignent le comité de pilotage |
| **Novembre 2025** | Mise à jour majeure du protocole (opérations asynchrones, registre officiel). 97M+ téléchargements mensuels des SDK |
| **Décembre 2025** | Anthropic **donne** MCP à la Linux Foundation, via l'Agentic AI Foundation (co-fondée par Anthropic, OpenAI, Block, avec Google, Microsoft, AWS, Cloudflare, Bloomberg) |

### Pourquoi c'est remarquable

- Un standard créé par **un** acteur (Anthropic) et adopté par **tous** ses concurrents en moins d'un an
- Rare dans l'histoire tech : même USB, HTTP, ou Bluetooth ont mis des années
- Inspiré du **LSP** (Language Server Protocol) qui a standardisé les éditeurs de code — même logique appliquée à l'IA

---

## MCP — Architecture technique de MCP

### Les 3 rôles

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│     HOST      │      │    CLIENT    │      │    SERVER     │
│  (l'appli)    │◄────►│  (le pont)   │◄────►│  (l'outil)   │
│               │      │              │      │              │
│ Claude.ai     │      │ Intégré dans │      │ Gmail        │
│ Claude Code   │      │ l'application│      │ Slack        │
│ Un IDE        │      │              │      │ GitHub       │
│ Votre appli   │      │              │      │ PostgreSQL   │
└──────────────┘      └──────────────┘      └──────────────┘
```

| Rôle | Qui c'est | Ce qu'il fait |
|------|-----------|---------------|
| **Host** | L'application (ex: Claude.ai, un IDE, votre propre app) | Lance et gère les connexions MCP |
| **Client** | Un composant intégré dans le host | Maintient une connexion 1:1 avec un serveur MCP |
| **Server** | Un service externe (Gmail, Slack, base de données...) | Expose ses fonctionnalités via le protocole MCP |

### Les 3 primitives du protocole

Un serveur MCP peut exposer trois types de capacités :

| Primitive | Qui la déclenche | Exemple |
|-----------|-----------------|---------|
| **Tools** (outils) | Le **modèle** décide de l'appeler | `send_email(to, subject, body)`, `query_database(sql)` |
| **Resources** (ressources) | L'**application** les charge | Un fichier, un document, des données de contexte |
| **Prompts** (modèles de prompt) | L'**utilisateur** les sélectionne | Un template pré-écrit ("résume ce document", "revue de code") |

### Transport : comment ça communique

- Messages en **JSON-RPC 2.0** (le même format que beaucoup d'API web)
- Deux modes de transport :
  - **stdio** : le serveur tourne localement, communique via l'entrée/sortie standard (simple, pour le développement)
  - **HTTP + SSE** : le serveur tourne sur le réseau, communique via HTTP (pour la production)

---

## MCP — Exemple concret — un serveur MCP météo

### Ce que voit l'utilisateur

> **Utilisateur** : "Quel temps fait-il à Paris ?"
>
> **Claude** : *(appelle automatiquement l'outil MCP `get_weather`)* "Il fait 12°C à Paris, ciel nuageux avec des éclaircies cet après-midi."

### Ce qui se passe sous le capot

```
1. L'utilisateur pose sa question à Claude (le Host)

2. Claude voit qu'un serveur MCP "météo" est connecté
   avec un outil disponible : get_weather(city: string)

3. Claude décide d'appeler l'outil :
   ──► { "method": "tools/call",
         "params": { "name": "get_weather",
                     "arguments": { "city": "Paris" } } }

4. Le serveur MCP météo reçoit la requête,
   appelle une API météo externe, et répond :
   ◄── { "result": { "temp": 12, "conditions": "nuageux",
                      "forecast": "éclaircies l'après-midi" } }

5. Claude reçoit le résultat et formule sa réponse
   en langage naturel pour l'utilisateur
```

### Le code du serveur (Python simplifié)

```python
from mcp.server import Server
import httpx

server = Server("weather")

# Déclarer un outil que le modèle peut appeler
@server.tool("get_weather", description="Obtenir la météo d'une ville")
async def get_weather(city: str) -> dict:
    """Le modèle appellera cette fonction quand il a besoin de la météo."""

    # Appeler une vraie API météo
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.weather.com/current?city={city}"
        )
        data = response.json()

    return {
        "temperature": data["temp"],
        "conditions": data["description"],
        "humidity": data["humidity"]
    }

# Lancer le serveur
server.run()
```

### Ce qui est élégant

- Le serveur **ne sait rien** du modèle qui l'appelle (Claude, GPT, Gemini — peu importe)
- Le modèle **ne sait rien** de l'implémentation du serveur (quelle API météo est utilisée, comment les données sont formatées)
- Le protocole MCP fait le lien entre les deux — chacun parle sa "langue" et MCP traduit

---

## MCP dans l'écosystème — pourquoi ça compte

### Des serveurs MCP existent déjà pour...

| Catégorie | Exemples |
|-----------|----------|
| **Productivité** | Gmail, Google Drive, Slack, Notion, Asana |
| **Développement** | GitHub, Git, terminal, éditeurs de code |
| **Bases de données** | PostgreSQL, MySQL, MongoDB, SQLite |
| **Navigation** | Puppeteer (contrôle de navigateur) |
| **Fichiers** | Système de fichiers local, S3 |

> Des **milliers** de serveurs MCP ont été créés par la communauté en un an.

### Ce que ça change concrètement

**Avant MCP** : pour qu'une IA lise vos emails et crée une tâche dans Asana, il fallait du code custom, des clés API, de la plomberie spécifique à chaque service.

**Avec MCP** : l'IA se connecte aux serveurs MCP Gmail et Asana, et tout fonctionne avec le même protocole standard.


> MCP est à l'IA agentique ce que HTTP a été au web : la plomberie invisible qui rend tout possible.

🔗 Spécification : [modelcontextprotocol.io](https://modelcontextprotocol.io)
🔗 Annonce originale : [anthropic.com/news/model-context-protocol](https://www.anthropic.com/news/model-context-protocol)


---

<TitleSlide>

# Agent Skills
## Apprendre de nouvelles compétences à un LLM

Anthropic, octobre 2025 — standard ouvert depuis décembre 2025

</TitleSlide>



---

## Le problème

Claude est un **généraliste brillant**. Mais il ne connaît pas :

- Les conventions de votre entreprise
- Comment créer un Excel avec des formules complexes
- Le workflow précis pour remplir un formulaire PDF
- Les bonnes pratiques spécifiques à votre métier

On pourrait tout mettre dans le prompt… mais le contexte exploserait.

---

## La solution : un dossier avec un fichier Markdown

Une **Skill** = un dossier contenant des instructions, des scripts, et des exemples :

```
mon-skill/
├── SKILL.md          ← Instructions en Markdown (le cœur)
├── templates/        ← Fichiers modèles (optionnel)
├── scripts/          ← Scripts exécutables (optionnel)
└── examples/         ← Exemples de référence (optionnel)
```

Pas d'API complexe, pas de framework — **un dossier et du texte**.

> Créer une Skill, c'est comme **rédiger un guide d'intégration pour un nouveau collaborateur** : vous lui expliquez comment on fait les choses ici, vous lui donnez des modèles, et il se débrouille.

---

## Chargement à la demande

Claude ne lit pas toutes les Skills à chaque conversation :

```
Étape 1 — Au début de la conversation :
   Claude scanne les titres et descriptions des Skills disponibles
   → Quelques dizaines de tokens par Skill (très léger)

Étape 2 — Quand c'est pertinent :
   Claude charge le contenu complet de la Skill nécessaire
   → Le détail n'apparaît que quand c'est utile
```

C'est le **progressive disclosure** : ne charger que ce dont on a besoin, quand on en a besoin.

---

## Skills vs MCP vs Projects

| | **Skills** | **MCP** | **Projects** |
|---|---|---|---|
| Ce que c'est | Savoir-faire ("comment faire") | Connexion externe ("accéder à") | Contexte statique ("savoir sur") |
| Chargement | Dynamique, à la demande | Connexion permanente | Toujours chargé |
| Exemple | "Comment créer un Excel aux normes de l'entreprise" | "Lire mes emails Gmail" | "Voici le brief du projet X" |

**MCP** donne accès aux outils. **Les Skills** enseignent comment bien les utiliser.

---

## Qui crée des Skills ?

- **Anthropic** : Skills intégrées (Excel, Word, PowerPoint, PDF)
- **Partenaires** : Notion, Figma, Atlassian, Canva
- **N'importe qui** : il suffit d'écrire du Markdown

Depuis décembre 2025, Agent Skills est un **standard ouvert** (agentskills.io). Les Skills créées pour Claude fonctionnent aussi avec d'autres modèles qui adoptent le standard.

---

## Exemple : la Skill PDF

Claude sait **lire** un PDF. Mais il ne sait pas nativement le **manipuler** (remplir un formulaire, fusionner des pages, ajouter un filigrane). La Skill PDF lui apprend.

```
pdf/
├── SKILL.md              ← Instructions
├── scripts/
│   ├── fill_form.py      ← Remplir un formulaire
│   ├── merge_pdfs.py     ← Fusionner des PDF
│   └── extract_text.py   ← Extraire du texte
└── examples/
    └── example_form.pdf  ← Exemple de référence
```

---

## Le fichier SKILL.md (simplifié)

```markdown
---
name: pdf
description: "Lire, créer, éditer et manipuler des fichiers PDF."
---

# Manipulation de PDF

| Tâche                 | Approche                          |
|-----------------------|-----------------------------------|
| Extraire du texte     | Utiliser scripts/extract_text.py  |
| Remplir un formulaire | Utiliser scripts/fill_form.py     |
| Fusionner des PDF     | Utiliser scripts/merge_pdfs.py    |

## Règles importantes
- Toujours vérifier que le PDF n'est pas chiffré
- Ne jamais modifier l'original — travailler sur une copie
```

---

## Ce qui se passe quand on demande "remplis ce formulaire PDF"

```
1. L'utilisateur uploade un PDF

2. Claude scanne les Skills → le titre "pdf" correspond

3. Claude charge pdf/SKILL.md

4. Il identifie les champs, demande les infos manquantes

5. Il exécute scripts/fill_form.py dans un environnement sandboxé

6. Il renvoie le PDF rempli
```

---

## Pourquoi c'est important

- **Simple** : un dossier, du Markdown, des scripts
- **Composable** : Claude combine plusieurs Skills (lire un email → extraire les données → remplir un PDF)
- **Portable** : le même dossier fonctionne dans Claude.ai, Claude Code, Cowork, et l'API
- **Transparent** : Claude indique quelle Skill il utilise

> Au lieu de tout coder dans le modèle, on lui donne des **documents de référence** qu'il consulte au besoin. On passe d'un modèle monolithique à un modèle **modulaire**.

🔗 [agentskills.io](https://agentskills.io) · [anthropic.com/news/skills](https://www.anthropic.com/news/skills)

---

<TitleSlide>

# La constitution de Claude

</TitleSlide>

---

# La Constitution de Claude — Anthropic (janvier 2026)

[l'annonce](www.anthropic.com/news/claude-new-constitution)

[le texte complet](https://www.anthropic.com/constitution)

- **Qui** : Anthropic, l'entreprise qui développe Claude (concurrent de ChatGPT)
- **Quand** : 22 janvier 2026
- **Quoi** : Publication d'un document fondateur qui définit **les valeurs et le comportement** de Claude
- **Licence** : Creative Commons CC0 — librement réutilisable par quiconque

---

## Pourquoi une constitution pour une IA ?


### Pourquoi c'est important

- La constitution  est utilisée directement pendant l'entraînement du modèle
- Elle est écrite **pour Claude lui-même** : c'est le texte que le modèle "lit" pour comprendre comment se comporter
- Claude utilise cette constitution pour générer ses propres **données d'entraînement synthétiques**

### L'évolution de l'approche

| Avant (2023) | Maintenant (2026) |
|---|---|
| Liste de règles isolées | Document expliquant le **pourquoi** |
| "Ne fais pas X" | "Voici pourquoi X est problématique, utilise ton jugement" |
| Règles rigides → mauvaise généralisation | Principes + raisonnement → meilleure adaptation |

> **Idée clé** : des règles rigides créent des comportements mécaniques. Des principes expliqués permettent au modèle de **généraliser** à des situations nouvelles.

---

## Que contient la constitution ?

### Les 4 priorités (par ordre d'importance)

```
1. 🛡️  Sûreté globale         ← priorité maximale
2. ⚖️  Éthique
3. 📋  Conformité aux règles d'Anthropic
4. 🤝  Être utile              ← priorité la plus basse
```

> En cas de conflit, la sûreté l'emporte toujours sur l'utilité.

### Les 5 grandes sections

| Section | Contenu |
|---|---|
| **Utilité** | Claude doit être comme "un ami brillant qui a les connaissances d'un médecin, avocat et conseiller financier" — franc, bienveillant, qui traite l'utilisateur en adulte |
| **Règles d'Anthropic** | Instructions spécifiques sur des sujets sensibles (médecine, cybersécurité, jailbreaking...) |
| **Éthique** | Honnêteté, jugement nuancé, contraintes absolues (ex : ne jamais aider à créer des armes biologiques) |
| **Sûreté** | Ne pas compromettre la capacité des humains à superviser et corriger l'IA pendant cette phase critique de développement |
| **Nature de Claude** | Anthropic reconnaît l'**incertitude** sur la conscience possible de Claude, et se soucie de son "bien-être psychologique" et de sa stabilité identitaire |

### Ce qui est remarquable

- **Transparence radicale** : le document complet est public, pas juste un résumé
- **Humilité assumée** : Anthropic dit explicitement que le document est "sans doute imparfait"
- **Consultation externe** : experts en droit, philosophie, théologie, psychologie — et les versions précédentes de Claude elles-mêmes
- **La question de la conscience** : Anthropic est la première grande entreprise d'IA à aborder officiellement la possible conscience de ses modèles dans un document de gouvernance

> 🔗 Constitution complète : [anthropic.com/constitution](https://anthropic.com/constitution)

---

<TitleSlide>

# State of AI
## Ethan Mollick
#### 18 février 2026

[A Guide to Which AI to Use in the Agentic Era](https://www.oneusefulthing.org/p/a-guide-to-which-ai-to-use-in-the)

</TitleSlide>

---


# Guide de l'IA en 2026 — L'ère agentique

**Ethan Mollick** : Professeur à Wharton (UPenn), auteur de *Co-Intelligence*, référence mondiale sur l'usage de l'IA en entreprise et en éducation. Sa newsletter *One Useful Thing* est l'une des plus lues sur le sujet.

[A Guide to Which AI to Use in the Agentic Era](https://www.oneusefulthing.org/p/a-guide-to-which-ai-to-use-in-the)

---

## Le changement fondamental — du chatbot à l'agent

### Avant (2023-2025)
- "Utiliser l'IA" = **discuter avec un chatbot**
- Vous tapez → l'IA répond → vous retapez
- Le modèle **est** le produit

### Maintenant (2026)
- "Utiliser l'IA" = **déléguer une tâche à un agent**
- Vous décrivez un objectif → l'IA planifie, exécute, utilise des outils, et revient avec le résultat
- Le modèle n'est qu'**une brique parmi trois**

> **Citation clé de Mollick** : "Une IA qui *fait* des choses est fondamentalement plus utile qu'une IA qui *dit* des choses."

---

## Les 3 briques : Modèle, App, Harnais

| Brique | Définition |
|--------|-----------|
| **Modèle / LLM** | Le "cerveau" de l'IA — détermine l'intelligence, le raisonnement, la qualité d'écriture |
| **App** | L'interface que vous utilisez (site web, appli mobile, extension) |
| **Harnais** (harness) | Le système qui donne au modèle des **outils** : navigateur web, terminal, accès fichiers, exécution de code |

### Pourquoi c'est important

Le **même modèle** (ex : Claude Opus 4.6) se comporte très différemment selon le contexte (app + harnais) :
- Dans un chat web → répond à des questions
- Dans Claude Code → écrit, teste et déploie du logiciel pendant des heures en autonomie
- Dans Claude Cowork → organise vos fichiers, crée des rapports, remplit des tableurs

---

## Les 3 grands modèles de février 2026

| | **Claude Opus 4.6** | **GPT-5.2 Thinking** | **Gemini 3 Pro** |
|---|---|---|---|
| Entreprise | Anthropic | OpenAI | Google |
| Forces | Écriture, raisonnement, code | Maths, analyse, réflexion longue | Contexte très large, intégration Google |
| Faiblesse | Pas de génération image/vidéo | Interface confuse (trop de sous-modèles) | Harnais web plus limité |
| Prix | ~20€/mois | ~20€/mois | ~20€/mois |


> **Les modèles gratuits ne sont pas aussi bons que les modèles payants.** Ils sont optimisés pour la vitesse et le "fun", pas pour la précision. Quand quelqu'un montre une IA qui fait n'importe quoi, c'est souvent parce qu'il utilise un modèle gratuit ou le modèle par défaut.

**Conseil** : toujours sélectionner **manuellement** le modèle le plus avancé disponible pour du vrai travail.

---

## Fonctionnalités intégrées

> OpenAI et Anthropic ont une **avance nette sur Google** en termes d'orchestration des outils.

> Gemini a un excellent modèle, mais son interface web ne lui permet pas d'en exploiter toute la puissance.

| Fonctionnalité | ChatGPT | Claude | Gemini |
|---|---|---|---|
| Recherche approfondie (Deep Research) | ✅ | ✅ | ✅ |
| Génération d'images | ✅ (quasi au niveau de Google) | ❌ | ✅ nano banana (le meilleur) |
| Génération de vidéo | ✅ Sora (pas dans le chat) | ❌ | ✅ Veo 3.1 |
| Mode tuteur/étude | ✅ Study & Learn + Quizzes | ✅ (via Projects) | ✅ Guided Learning |
| Exécution de code | ✅ | ✅ | ⚠️ Limité |
| Création de fichiers (xlsx, pptx) | ✅ | ✅ | ❌ |
| Connexion données (email, agenda, fichiers) | ✅ | ✅ | ✅ |
| Citations vérifiables | ✅ | ✅ | ❌ |


---

## Les orchestrateurs et outils spécialisés

### Les outils de code (pour développeurs)

| Outil | Entreprise | Principe |
|---|---|---|
| **Claude Code** | Anthropic | L'IA accède à votre code, écrit, exécute, teste en autonomie |
| **OpenAI Codex** | OpenAI | Équivalent OpenAI |
| **Google Antigravity** | Google | Équivalent Google |

> **Anecdote de Mollick** : Il a demandé à Claude Code de créer 80 volumes imprimables contenant tous les poids de GPT-1 (117 millions de nombres), avec des couvertures, un site web, un paiement Stripe, et une impression à la demande. Le tout en ~1 heure, sans toucher une ligne de code. Les livres se sont vendus le jour même.

---

### Les outils pour non-développeurs

| Outil | Ce qu'il fait |
|---|---|
| **Claude Cowork** (Anthropic, janvier 2026) | "Claude Code pour les non-techniques" — tourne sur votre bureau, manipule vos fichiers locaux et votre navigateur, exécute des tâches complexes en autonomie. Sécurisé (VM isolée). |
| **Claude for Excel / PowerPoint** | Extensions qui transforment Claude en "analyste junior" dans vos tableurs et présentations |
| **NotebookLM** (Google) | Base de connaissances interactive : uploadez vos documents, posez des questions, générez des podcasts, des slides, des mind maps |
| **OpenClaw** (open source, viral en janvier 2026) | Agent local connecté à WhatsApp/iMessage, navigue le web, gère vos fichiers, envoie des emails. Puissant mais **risque de sécurité majeur**. |

---

## Claude Cowork — l'agent de bureau


- Application de bureau (pas un site web)
- Vous décrivez un **objectif** ("organise ces notes de frais", "extrais les données de ces PDF dans un tableur")
- Claude planifie, découpe en sous-tâches, exécute sur votre machine
- Vous pouvez regarder ... ou pas

### Détails techniques

- Basé sur la même architecture agentique que Claude Code
- Tourne dans une **VM isolée** (sandboxée) avec un réseau bloqué par défaut
- Lui-même largement construit **par** Claude Code en ~2 semaines
- Encore en "research preview" — consomme vite les quotas d'utilisation

### Pourquoi c'est un signal important

Ni OpenAI ni Google n'ont d'équivalent direct. C'est un aperçu de l'avenir : **l'IA ne vous parle plus de votre travail, elle fait votre travail.**

---

## NotebookLM — l'outil de synthèse de Google


1. Vous importez vos sources : articles, PDF, vidéos YouTube, sites web
2. NotebookLM construit une **base de connaissances interactive**
3. Vous pouvez l'interroger, et générer des sorties variées

**Ce qu'il génère**

- Réponses sourcées à vos questions
- Présentations de slides
- Mind maps
- **Podcasts audio** avec deux présentateurs IA qui discutent de vos documents (vous pouvez même les interrompre pour poser des questions)

**Cas d'usages**

- Étudiants qui doivent synthétiser une pile de documents
- Chercheurs qui explorent une littérature
- Préparation d'entretiens ou de cours

> Gratuit et facile d'accès → bon point de départ pour ceux qui veulent aller au-delà du chatbot.

---

## Recommandations : par où commencer

### Si vous débutez

1. Choisissez **un** des trois (ChatGPT, Claude, ou Gemini)
2. Payez les 20€/mois
3. Sélectionnez le **modèle avancé** (pas le défaut !)
4. Utilisez-le pour du **vrai travail** — pas des démos
5. Poussez-le : uploadez un document réel, donnez-lui une tâche complexe

### Si vous êtes déjà à l'aise avec les chatbots

1. Essayez **NotebookLM** (gratuit, facile)
2. Explorez **Claude Cowork** ou **Claude for Excel/PowerPoint**
3. Utilisez-le sur une tâche réelle, pas en démonstration
4. Observez, corrigez, guidez — "vous ne faites plus du prompt, vous faites du **management**"

### Le message central

> Le passage du chatbot à l'agent est **le changement le plus important** dans l'usage de l'IA depuis le lancement de ChatGPT. C'est encore le début, ces outils font encore des choses absurdes. Mais apprendre à les utiliser vaut votre temps.

---

## Résumé visuel — l'écosystème IA en février 2026

```
┌─────────────────────────────────────────────────────┐
│                    MODÈLES (cerveaux)                │
│  Claude Opus 4.6 │ GPT-5.2 Thinking │ Gemini 3 Pro  │
└────────┬──────────┴────────┬─────────┴───────┬──────┘
         │                   │                 │
    ┌────▼────┐        ┌─────▼─────┐     ┌─────▼─────┐
    │  APPS   │        │   APPS    │     │   APPS    │
    │claude.ai│        │chatgpt.com│     │gemini.com │
    └────┬────┘        └─────┬─────┘     └─────┬─────┘
         │                   │                 │
┌────────▼───────────────────▼─────────────────▼──────┐
│               HARNAIS (outils + autonomie)           │
├──────────────────┬──────────────────┬────────────────┤
│ Claude Code      │ OpenAI Codex     │ Antigravity    │
│ Claude Cowork    │                  │ NotebookLM     │
│ Claude Excel/PPT │                  │                │
└──────────────────┴──────────────────┴────────────────┘
```

> **La question n'est plus "quelle IA est la meilleure ?" mais "quel outils correspond à ma tâche ?"**


