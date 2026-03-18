---
title: "Construire un bot Telegram avec un LLM"
page_title: "Construire un bot Telegram avec un LLM"
slides_project_home: /courses/dlia/
---

# Workshop — Construire un bot Telegram avec un LLM
### Master Art & Science — ESIEE Paris

---

## Préambule

### Clé API - OpenRouter

Site : [https://openrouter.ai/](https://openrouter.ai/)

Clé partagée (il manque les 5 derniers caractères, je vous les donnerai en cours) :

```
sk-or-v1-2def8c4157456ed36e4e4920a1759194cf91bed0d4f2980eb514c7cd0de
```



## Étape 0 — Créer son bot Telegram

Tout bot Telegram naît via **@BotFather**, le bot officiel de Telegram.

👉 **Guide officiel** : [core.telegram.org/bots#how-do-i-create-a-bot](https://core.telegram.org/bots#how-do-i-create-a-bot)

**En pratique :**
1. Ouvrir Telegram et chercher `@BotFather`
2. Envoyer `/newbot`
3. Choisir un nom et un identifiant (ex: `@MonStagebotBot`)
4. Récupérer le **token** — une chaîne du type `123456789:ABCdef...` — ne la partage jamais et ne la mets pas sur GitHub

**Librairies à installer :**

```
pip install python-telegram-bot openai feedparser requests python-dotenv
```

---

## Étape 1 — Comprendre comment fonctionne un bot

Un bot Telegram est un **programme Python qui tourne sur ta machine** et qui écoute en permanence les messages envoyés par les utilisateurs. Telegram fait le lien entre l'application mobile et ton script.

Le cycle est simple :
1. Un utilisateur envoie un message ou une commande dans le chat
2. Telegram transmet ce message à ton script Python via le token
3. Ton script traite le message et envoie une réponse
4. L'utilisateur voit la réponse dans le chat

---

## Étape 2 — Structure du code

**Un seul fichier Python** suffit pour les bots de ce workshop. Pas un fichier par commande — tout est dans `bot.py`.

### Organisation des fichiers

```
mon_bot/
├── bot.py       ← tout le code du bot
├── .env         ← les tokens et clés API (ne jamais mettre sur GitHub)
├── .gitignore   ← doit contenir ".env" pour ne pas l'exposer
└── README.md    ← description du bot pour GitHub
```

Le fichier `.env` contient :
```
TELEGRAM_TOKEN=ton_token_ici
OPENROUTER_KEY=la_cle_fournie_par_lenseignant
```

### Structure type de `bot.py`

Un fichier bien structuré suit toujours le même schéma :

```
1. Imports
2. Chargement des variables d'environnement (.env)
3. Initialisation du client OpenRouter
4. Les fonctions — une par commande ou événement
5. La fonction main() qui enregistre les commandes et lance le bot
```

Chaque fonction de commande a toujours la même signature :
```python
async def ma_fonction(update, context):
    ...
```
- `update` contient tout ce que l'utilisateur a envoyé (texte, fichier, etc.)
- `context` permet de stocker des données persistantes entre les messages

---

## Étape 3 — Créer une commande et la lier à une fonction

Une **commande** Telegram est un message qui commence par `/`, comme `/start`, `/parse`, `/entretien`.

Créer une commande se fait en deux temps.

**1. Écrire la fonction associée**
```python
async def parse_command(update, context):
    await update.message.reply_text("Je lance la recherche de stages...")
    # ... le vrai travail ici
```

**2. Enregistrer la commande dans le `main()`**
```python
def main():
    app = ApplicationBuilder().token(TELEGRAM_TOKEN).build()

    app.add_handler(CommandHandler("parse", parse_command))
    app.add_handler(CommandHandler("cv", cv_command))
    app.add_handler(CommandHandler("entretien", entretien_command))
    app.add_handler(MessageHandler(filters.Document.ALL, handle_document))

    app.run_polling()
```

C'est tout. La ligne `CommandHandler("parse", parse_command)` signifie : "quand l'utilisateur envoie `/parse`, appelle la fonction `parse_command`".

La ligne `MessageHandler(filters.Document.ALL, handle_document)` capte tous les fichiers envoyés dans le chat — CV, fiche de poste, profil LinkedIn.

---

## Étape 4 — Recevoir un fichier Markdown

Pour tous les bots de ce workshop, les documents sont des **fichiers Markdown** (`.md`) envoyés directement dans le chat, comme n'importe quelle pièce jointe.

**Ce que fait l'utilisateur :** il glisse son fichier `.md` dans le chat Telegram.

**Ce que fait le bot :** il détecte la réception, télécharge le fichier, lit son contenu, et le stocke en mémoire pour toute la session.

**Distinguer les documents** — le bot doit savoir si le fichier reçu est un CV, une fiche de poste, ou un profil LinkedIn. L'approche la plus simple : l'utilisateur envoie d'abord une commande qui indique le type, puis le fichier.

```
/setcv        → puis envoie cv.md
/setfiche     → puis envoie fiche.md
/setinterviewer → puis envoie interviewer.md
```

**`context.user_data`** est un dictionnaire persistant par utilisateur — parfait pour stocker `context.user_data["cv"]`, `context.user_data["fiche"]`, etc. Si plusieurs personnes testent le même bot en même temps, chacune a ses propres données isolées.

---

## Les trois bots du workshop

Tu peux construire **un, deux ou trois** de ces bots. Chaque bot est indépendant. Commence par celui qui t'intéresse le plus, ou suis la progression Bot 1 → 2 → 3.

---

## Bot 1 — Le Sourceur de Stages

### But
Trouver automatiquement les stages les plus adaptés à ton profil parmi un flux d'offres, sans éplucher des dizaines d'annonces manuellement.

### Deliverable
Un bot Telegram qui, sur commande `/parse`, lit un fil RSS d'offres de stage, récupère le contenu de chaque fiche, le compare à ton CV, et renvoie une shortlist de **2 à 3 stages** avec une justification pour chacun.

---

### Prérequis : créer une alerte Google → fil RSS

Un **fil RSS** est un format standard qui permet de suivre les mises à jour d'un site sans le visiter. Google Alerts peut générer un fil RSS à partir de n'importe quelle requête de recherche — c'est l'entrée du bot.

1. Aller sur [google.com/alerts](https://www.google.com/alerts)
2. Saisir une requête précise, par exemple : `"stage" "machine learning" "Paris" 2025`
3. Dans les options, choisir **"Flux RSS"** comme mode de livraison
4. Copier l'URL du flux RSS généré → la coller dans le fichier `.env` du bot : `RSS_URL=...`

> 💡 Plus la requête est précise, plus les offres seront pertinentes. Teste plusieurs formulations et observe la différence.

---

### Comment fonctionne le bot

**Réception du CV**
L'utilisateur envoie `/setcv` puis son fichier `cv.md`. Le bot stocke le contenu dans `context.user_data["cv"]` et confirme la réception.

**La commande `/parse`**
Le bot lit le fil RSS avec `feedparser`, extrait les dernières offres et leurs liens. Pour chaque lien, il tente de récupérer le contenu de la page en ligne. Certaines pages bloqueront la requête — c'est normal, on garde ce qui fonctionne.

**Le matching par LLM**
Un seul appel LLM reçoit : le contenu du CV + les fiches récupérées. Le LLM sélectionne les 2-3 meilleurs matchs et explique pour chacun ce qui correspond, ce qui manque, et ce qu'il faudrait mettre en avant dans la candidature.

**La réponse dans le chat**
Le bot affiche la shortlist avec pour chaque stage : titre, entreprise, lien, et raisonnement du LLM.

---

### Ce que tu apprends
- Ce qu'est un fil RSS et comment le lire en Python
- Faire des requêtes HTTP simples pour récupérer du contenu web
- Injecter des documents longs dans un prompt LLM
- Laisser un LLM faire du matching plutôt qu'un algorithme déterministe

---

## Bot 2 — Le Coach CV

### But
Analyser le match entre un CV et une offre précise, identifier les gaps, et proposer des reformulations concrètes pour maximiser les chances d'être retenu.

### Deliverable
Un bot Telegram qui prend en entrée un CV en Markdown et une fiche de poste en Markdown, et produit une analyse structurée : points forts, points faibles, suggestions de reformulation concrètes, et un message LinkedIn personnalisé pour approcher l'entreprise.

---

### Comment fonctionne le bot

**Réception des documents**
L'utilisateur envoie deux fichiers dans le chat :
- `/setcv` puis `cv.md`
- `/setfiche` puis `fiche.md` — la fiche de poste copiée depuis le site de l'entreprise et sauvegardée en Markdown

**La commande `/cv`**
Déclenche l'analyse en deux appels LLM enchaînés.

**Premier appel LLM — extraction**
Le bot envoie la fiche de poste au LLM avec pour instruction d'extraire : les compétences requises, les mots-clés importants, les qualités recherchées, et le contexte de l'entreprise. Le résultat est stocké temporairement.

**Deuxième appel LLM — comparaison**
Le bot envoie le CV + le résultat de l'extraction précédente. Le LLM produit une analyse en trois parties :
- ✅ Ce qui correspond déjà dans le CV
- ⚠️ Ce qui manque ou est mal mis en valeur
- ✏️ Des reformulations concrètes de phrases du CV pour mieux coller à l'offre

**La commande `/linkedin`**
Génère un message d'approche personnalisé pour contacter un employé de l'entreprise, en s'appuyant sur le contexte du poste et le profil du CV.

---

### Ce que tu apprends
- Enchaîner plusieurs appels LLM où le résultat du premier alimente le second
- Structurer un prompt pour obtenir une sortie formatée et exploitable
- La différence entre "demander un avis" et "demander une analyse structurée" à un LLM

---

## Bot 3 — Le Simulateur d'Entretien

### But
S'entraîner à un entretien dans des conditions réalistes — avec un interlocuteur simulé qui connaît le poste, l'entreprise, et adapte ses questions au CV du candidat, avec du feedback en temps réel.

### Deliverable
Un bot Telegram qui simule un entretien complet : le bot joue le recruteur, pose des questions adaptées au contexte, réagit aux réponses de l'utilisateur, et fournit à la fin un bilan détaillé sur le fond et la forme.

> 💡 **Note** : simuler un interlocuteur à partir de données réelles est l'une des applications les plus puissantes des LLMs. C'est utilisé dans des contextes professionnels réels pour préparer des négociations, des présentations ou des entretiens à fort enjeu.

---

### Comment fonctionne le bot

**Réception des trois documents**
L'utilisateur envoie trois fichiers Markdown dans le chat :
- `/setcv` puis `cv.md`
- `/setfiche` puis `fiche.md`
- `/setinterviewer` puis `interviewer.md` — le profil LinkedIn de l'interviewer, copié depuis LinkedIn et sauvegardé en Markdown

**La commande `/entretien` — construction du persona**
Le bot fait un appel LLM de préparation : à partir du profil LinkedIn + fiche de poste + contexte de l'entreprise, il construit le persona du recruteur (ton, priorités, questions typiques de ce profil). Ce persona est stocké dans `context.user_data` et utilisé pour tous les échanges suivants.

**L'entretien commence**
Le bot envoie le premier message dans le persona du recruteur :
> *"Bonjour, je suis [Prénom], [Titre] chez [Entreprise]. On a 45 minutes ensemble — est-ce que vous pouvez commencer par vous présenter ?"*

**La boucle question / feedback**
À chaque réponse de l'utilisateur, le bot fait deux choses en un seul appel LLM :
1. **En tant que recruteur** : pose la question suivante, logique et contextualisée par rapport à ce qui vient d'être dit
2. **En aparté** (marqué visuellement avec `💬 Feedback :`) : commente brièvement la réponse précédente — ce qui était bien, ce qui était flou, ce qu'il aurait fallu ajouter

L'historique complet de la conversation est passé au LLM à chaque échange — c'est ce qui permet la cohérence et la progression naturelle de l'entretien.

**La commande `/stop` — bilan final**
Le bot sort du persona et génère un bilan structuré :
- Points forts du candidat pendant l'entretien
- Points à travailler (fond et forme)
- Les 2-3 moments clés où la réponse aurait pu être meilleure, avec une reformulation suggérée
- Une note globale sur 10 avec justification

---

### Ce que tu apprends
- Gérer un historique de conversation (liste de messages qui s'allonge à chaque échange)
- Construire un persona dynamique à partir de données réelles hétérogènes
- Faire coexister deux "voix" dans un même bot (le recruteur + le coach)
- Prompt engineering de roleplay contraint et cohérent sur plusieurs tours

---

## Récapitulatif

| | Bot 1 — Sourceur | Bot 2 — Coach CV | Bot 3 — Simulateur |
|---|---|---|---|
| **Documents** | `cv.md` | `cv.md` + `fiche.md` | `cv.md` + `fiche.md` + `interviewer.md` |
| **Commande principale** | `/parse` | `/cv` | `/entretien` |
| **Appels LLM** | 1 | 2 enchaînés | Multiple (boucle) |
| **Concept central** | Matching de documents | Analyse structurée en chaîne | État conversationnel |
| **Difficulté** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## Soumission

À la fin du workshop, soumettre via le formulaire Google :
- Le lien vers le **repository GitHub** (public, avec un `README.md` qui explique le bot)
- Le **nom du bot** sur Telegram (`@...`)
- Le ou les bots construits (1, 2 ou 3)

---

*Workshop ESIEE Paris — Master Art & Science — 2025*
