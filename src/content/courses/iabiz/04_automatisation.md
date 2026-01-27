---
layout: prose
title: "IA for Business"
slides_project_home: /courses/iabiz/automatisation/
footer: 'Alexis Perrier - SkatAI.com/courses/iabiz/automatisation/'
---
<TitleSlide>

# Automatisation avec l'IA

</TitleSlide>
---

# ETL

- Extract Transform Load
- pipeline building with drag and drop
- code sous jacent
- le drag and drop genere le code


Exemple : [Informatica](https://www.informatica.com/), créé en 1993.

<img src="https://jsdarges.developpez.com/tutoriels/presentation-suite-informatica-power-center/images/workflow_manager.jpg" />

---
## Qu'est-ce que l'ETL ?

**ETL = Extract, Transform, Load (Extraire, Transformer, Charger)**

Un processus fondamental de gestion des données qui existe depuis les années 1970.

C'est l'épine dorsale de la manière dont les entreprises déplacent et traitent les données entre les systèmes.

Pensez-y comme à une **chaîne de montage de données** - prendre des matières premières (les données), les traiter, et livrer des produits finis là où ils sont nécessaires.

---

## E pour Extract (Extraire)

Extraire des données de diverses sources - bases de données, fichiers, APIs, sites web ou systèmes hérités.

**Exemples concrets :**

- Lire les commandes clients depuis une base de données e-commerce
- Télécharger les rapports de ventes de plusieurs bureaux régionaux
- Récupérer les prix des produits sur les sites web de concurrents



---

## T pour Transform (Transformer)
### Rendre les Données Utilisables

Les données sont heterogènes, different format, differents mode de capture, donc necessaire de les transformer en un format cohérent pour qu'elles soient  utilisables.

**Exemples concrets :**
- outliers : valeurs aberrantes
- valeurs manquantes
- Convertir les devises (EUR → USD)
- Normaliser les formats incohérents (dates, numéros de téléphone, adresses)

Le but est d'avoir un jeu de données de qualité.

---

## L pour Load (Charger)

Prendre les données nettoyées et transformées et les placer là où elles doivent aller.

**Exemples concrets :**
- Mettre à jour le CRM avec les informations clients enrichies
- Envoyer les métriques quotidiennes à une tableau de bord analytique
- Alimenter une base de données qui alimente le site web



---

## Le concept du Workflow Visuel

**L'approche fondamentale (des années 1990 à aujourd'hui) :**

Tous les outils ETL partagent la même conception de base :
- **Interface visuelle drag-and-drop** - Connecter des boîtes représentant des tâches
- **Configuration plutôt que code** - Configurer des connecteurs et des mappings
- **Connecteurs pré-construits** - Bibliothèques d'adaptateurs source/destination
- **Composants réutilisables** - Construire une fois, utiliser plusieurs fois

**Cela n'a pas changé en 30 ans.**

Ce qui *a* changé, c'est ce pour quoi ils sont optimisés.

---

## Outils ETL Classiques

**Outils traditionnels (années 1990-2010) :**

- **Informatica PowerCenter/Cloud** - Workflows visuels, hébergé dans le cloud depuis ~2010
- **Microsoft SSIS** - Interface drag-and-drop dans Visual Studio
- **Talend** - Open-source, concepteur de jobs visuel
- **Oracle Data Integrator** - Concepteur de flux visuel
- **IBM DataStage** - Constructeur de pipeline graphique

**Caractéristiques clés :**
- Optimisés pour le **batch processing** de grands volumes de données
- Fortes capacités de **transformation** (opérations complexes type SQL)
- Principalement **database-to-database** ou **file-to-database**
- Conçus pour les data engineers et les équipes IT

---

## Plateformes d'Automation Modernes

**Nouvelle génération (années 2010 à aujourd'hui) :**

- **Zapier** (2011) - Visual workflow builder
- **Make/Integromat** (2012) - Interface basée sur les flux
- **n8n** (2019) - Éditeur visuel basé sur les nodes

**Caractéristiques clés :**
- faible volume : Optimisés pour le **traitement event-driven** d'enregistrements individuels
- faible transformation : Capacités de **transformation** légères (mapping de champs, logique basique)
- Principalement des connexions **API-to-API** entre applications cloud
- Conçus pour les utilisateurs métier et les développeurs

**Même paradigme visuel, cibles d'optimisation différentes.**

**Même promesse de facilité et de no-code.**



---

## What Actually Changed?

**Not the interface - the underlying assumptions:**

| Traditional ETL | Modern Automation |
|----------------|-------------------|
| Batch: Process millions of rows overnight | Event: React to individual triggers in real-time |
| Database connections, file systems | REST APIs, webhooks |
| Complex transformations with SQL-like logic | Simple field mappings with light processing |
| Data warehouses and reporting | SaaS tool integration |
| Scheduled jobs | Event-driven workflows |
| Thousands to millions of rows per run | One to hundreds of records per event |

**The visual workflow paradigm stayed the same - the data world around it changed.**

---

## Modèles de Tarification & d'Accès

**ETL Traditionnel :**
- Processus de vente enterprise
- Licences annuelles (€10k+)
- Tarification basée sur le volume (données traitées, connecteurs utilisés)
- Nécessite approbation budgétaire et procurement

**Automation Moderne :**
- Inscription self-service
- Abonnements mensuels (€20-€500/mois pour la plupart des cas d'usage)
- Tarification par tâche ou par exécution
- Carte bancaire

---


## Cas d'Usage : Hier et Aujourd'hui

**ETL Traditionnel:**
- Chargements nocturnes dans les data warehouses
- Consolidation financière entre systèmes
- Qualité et nettoyage de données complexes
- Traitement de millions de transactions

**Automatisation Moderne :**
- Nouveau client → Créer dans le CRM + Envoyer email de bienvenue + Notifier les ventes
- Soumission de formulaire → Valider → Mettre à jour la feuille de calcul → Créer une tâche
- Ticket de support créé → Classifier → Assigner → Démarrer le timer SLA
- Facture reçue → Extraire les données → Créer un workflow d'approbation

**volumes de données et patterns de traitement différents.**

---

## Les points de friction

D'un point de vue de l'individu

- quel ROI pour le temps investi pour creer le workflow d'automatisation ?
- les besoins evoluent, comment maintenir le workflow ?
- de meme les API, les données changent, comment maintenir le workflow ?
- comment detecter et corriger les bugs ?


Pour une mise en production

- **Maintenance** - Les APIs changent, les intégrations se cassent
- **Gestion des erreurs** - Que se passe-t-il quand quelque chose échoue ?
- **Monitoring** - Comment savoir si ça fonctionne ?
- **Contrôle de version** - Comment gérer les changements ?
- **Testing** - Comment valider avant la production ?
- **Documentation** - Six mois plus tard, pourquoi a-t-on construit cela ?

**Les outils de workflow visuels ont toujours promis la "facilité"  mais la complexité émerge à l'échelle.**

Cela est vrai que l'on utilise Informatica ou n8n.

---

La promesse de facilité avec le no-code se heurte a

- important investissement initial en temps
- difficulté de comprendre et de remedier aux erreurs
- la premiere version du workflow (péniblement mis en place), est loin de répondre aux attentes
- difficile d'aprehender ce qui est du domaine du possible


> - Le learning curve est trop élevée pour du one shot.
> - il faut un support dédié
> - ca marche bien pour des cas d'usage simples et deja mis en place. Dès que l'on sort des sentiers battus la complexité et l'investissement en temps explosent

---

# Avec des morceaux d'IA

Si on rajoute des nodes d'AI dans le workflow

- plus de chance que ca casse (le format des données en sortie n'est pas respecté)
- incertitude accrue sur les resultats  (black box)
- interaction via des API payantes => les couts augmentent et sont difficilement controllables

---

# Mais

l'IA aide
- à resoudre les bugs: soumettre l'erreur et analyser le probleme
- à determiner ce qui est possible
- à estimer la complexité
- à creer un pipeline from scratch qui soit importable dans la plateforme

---

# Focus sur n8n

utile
- **repetitive workflows** to automate

Examples:
- New client onboarding:
    1. Create Notion project
    2. Send welcome email
    3. Schedule kickoff
    4. Create folder structure
- Invoice workflow:
    1. Mark project as complete
    2. Generate invoice
    3. Send to client
    4. Track payment
- Weekly client updates:
    1. Pull progress from Notion
    2. Format report
    3. Email client automatically

---

# Pourquoi n8n ?

- existe en version hosted (payante) et "gratuite" (self hosted)
- bonne couverture en terme de connecteurs (google, notion etc )
- open source: on peut l'installer sur son ordi ou un serveur (self hosted) (pas le cas de Make ou Zapier)
- européen (Allemagne)


---

# Concepts Fondamentaux de n8n

Voici les principaux éléments à comprendre :


- **1. Workflows**: Collection de nodes connectés qui s'exécutent en séquence ou en parallèle pour accomplir une tâche.


- **2. Nodes / noeuds**: Unités individuelles de travail - les boîtes que l'on glisse sur le canvas. Chaque node effectue une action. **Types :**
    - **Trigger nodes** - Démarrent le workflow (webhook, schedule, manual trigger)
    - **Action nodes** - Effectuent une action (appel API, requête database, envoi d'email)
    - **Logic nodes** - Contrôlent le flux (conditions IF, Switch, Merge)
    - **Transform nodes** - Manipulent les données (Set, Code, Filter)

- **3. Connections**: Lignes entre les nodes qui déterminent l'ordre d'exécution et passent les données d'un node au suivant.
    - **Point clé :** Les données circulent à travers les connections. Chaque node reçoit l'input du node précédent et passe l'output au suivant.

- **4. Executions**: Chaque fois qu'un workflow s'exécute, cela crée une execution. On peut consulter l'historique des executions pour voir ce qui s'est passé, débugger les erreurs, et inspecter les données à chaque étape.

- **5. Credentials**: Détails d'authentification stockés pour se connecter aux services externes (clés API, tokens OAuth, mots de passe de database).

- **6. Items (Structure de Données)**: n8n passe les données entre nodes sous forme de **liste d'items**. Chaque item est un objet JSON.

```json
[
  {
    "json": {
      "name": "John",
      "email": "john@example.com"
    }
  },
  {
    "json": {
      "name": "Jane",
      "email": "jane@example.com"
    }
  }
]
```

- **7. Expressions** Valeurs dynamiques pour référencer les données des nodes précédents.

**Exemples :**


- `\{\{ \$json.email \}\}` : Récupérer le champ email de l'item courant
- `\{\{ \$node["HTTP Request"].json.id \}\}` : Récupérer l'id de l'output d'un node spécifique
- `\{\{ \$now.toFormat('yyyy-MM-dd') \}\}` : Utiliser les fonctions built-in


**Cela rend les workflows dynamiques.**

---

# Tutorial d'intro a n8n

Version hostée

Cela donne une bonne idee des possibilités et difficultés

[https://docs.n8n.io/try-it-out/tutorial-first-workflow/](https://docs.n8n.io/try-it-out/tutorial-first-workflow/)


---

# Example de workflow

Etats d'avancement des projets


```
Daily Schedule Trigger
    ↓
Google Calendar (get today's events)
    ↓
Notion (get active tasks per project)
    ↓
Gmail (get unread emails per project)
    ↓
Code Node (structure data)
    ↓
OpenAI/Claude (analyze and summarize)
    ↓
Send summary via Slack/Email
    ↓
OR update a Notion dashboard page
```

Multiples connections

---

# Autres outils de type n8n

Make, Zapier, Airtable

- plus de connections et de fonctions disponibles via des connecteurs
- zapier, et make : gros volumes
- airtable : excel avec un brin d'automatisation
- pas de version open source


---
# MCP : Model Context Protocol

Un standard ouvert d'Anthropic pour connecter Claude (et d'autres IA) directement aux outils et données.

**Le problème actuel :**
- Chaque IA a ses propres connecteurs propriétaires
- Copier-coller manuel de données entre outils et IA
- Impossible de connecter l'IA aux systèmes internes facilement

**La promesse de MCP :**
- **Connexions directes** - Claude accède à Notion, Gmail, bases de données en temps réel
- **Standard universel** - Un connecteur MCP fonctionne avec toutes les IA compatibles
- **Auto-hébergé** - Garder le contrôle sur ses données sensibles



=> possibilité de creer ses propres connecteurs sur des bases de données proprietaires


Mais

- Explosion du nombre de connecteurs
- Fonctionalités limitées
- problèmes de sécurité, cyber securité

---

Plateforme IA - All in one

| Tool       | Best For                               | Key Strength                                | Trade-Off / Limitation                                  |
| ---------- | -------------------------------------- | ------------------------------------------- | ------------------------------------------------------- |
| Reclaim.ai | Calendar & scheduling + focus time     | Smart scheduling & meeting/break management | Less full project/task workflow compared to some others |
| Taskade    | Full workflow + collaboration + AI     | Flexible views + automation + AI agents     | Might have steeper learning curve for scheduling model  |
| ClickUp    | All-in-one project/task management     | Wide feature set for teams/tasks/projects   | Scheduling automation may not be as deep as Motion’s AI |
| Sunsama    | Daily planning + time-blocking         | Simple, mindful daily workflow              | Less automation, more manual setup & planning           |
| ProofHub   | Team collaboration & project workflows | Chat, tasks, shared workspaces              | Less emphasis on AI scheduling automation               |



---

# Alternatives à n8n - état d'avancement des projets

- tout centraliser dans Notion et utiliser l'agent intégré
- creer un agent chatgpt avec les bonnes connections a Gmail, Canva et Notion

- Anthropic : [Claude skills](https://www.anthropic.com/news/skills) : creation d'agents specialisés basée sur un repertoire de specifications


---

# Connect ChatGPT a des services externes : Gmail, notion, ...

Niveau d'integration tres disparate.


Connecter chatGPT a gmail

- facile d'autoriser la connection pour le GPT par defaut
    - et ca marche : resumés des newsletters
- mais un chatgpt specialisee n'y a pas acces !
- pas essayé via projet

Connecter chatGPT a notion

pas dispo en connection sur le gpt global

potentiellement dispo sur les compte Pro et plus via MCP et seulement sur l'application chatGPT. pas sur le web. necessite mac recent

autre alternative : developer mode. mais ne se souvent pas des chats.

=> surement faisable mais tout depend de l'abonnement et de la machine et surtout du roll-out des fonctionnalités.

---

# connecter Claude.ai a des services externes : Gmail, notion, ...

La liste des connecteurs semble prometteuse.

![](/images/iabiz/claude_ai_connectors.png)


Et bien plus

![](/images/iabiz/claude_ai_connectors_list.png)

Chaque connecteur a sa propre liste de fonctionnalités

![](/images/iabiz/claude_ai_notion_connector.png)


---

Claude + gmail


la premiere connection n'a pas marché. Bien que le settings montre que gamail est connecté claude n'a pas acces

=> disconnect + reconnect

cette fois reçu un "alerte de securité " de gmail indiquant que claude avait acces

mais toujours pas d'acces dans claude app

j'ai verifié que google avait bien autorisé claude a accéder a gmail dans les settings de mon compte google

et la j'ai cliqué sur settings dans le chat et vu que l'on pouvaoit aussi autoriser gmail dans le chat

![](/images/iabiz/claude_ai_enable_connector_in_chat.png)

et finalement ca marche !

![](/images/iabiz/claude_ai_gmail_access_works.png)


---

Claude + notion

l'acces est activé sans problème

![](/images/iabiz/claude_ai_access_notion.png)


---

Claude semble etre la solution la plus simple en l'etat des choses


---

## **Alternatives**

### **1. Notion AI (Built-in)**
If he's already using Notion for project tracking:
- Notion AI can summarize pages, extract action items
- No integration needed
- Natural language queries: "What's blocked?" "What's due this week?"

### **2. Motion / Reclaim.ai**
Purpose-built for freelancers/solo operators:
- Auto-schedules tasks across projects
- Integrates calendar + task management
- AI prioritization
- Shows project status automatically

### **3. Custom GPT / ChatGPT with Plugins**
- Create a custom GPT that connects to Google Drive, Notion
- Ask it: "Give me status on all 7 projects"
- Uses Claude/GPT's native tool-calling

### **4. Zapier Tables + AI**
Zapier's native database with built-in AI:
- Aggregate data from sources
- Use Zapier's AI features to analyze
- Pre-built interface for viewing

---
