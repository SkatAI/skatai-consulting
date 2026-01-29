---
layout: slides
title: "IA for Business"
slides_project_home: /courses/iabiz/chatgpt/
footer: 'Alexis Perrier - SkatAI.com/courses/iabiz/chatgpt/'
---

<TitleSlide>

# Bien travailler avec L'IA

</TitleSlide>

---

![IA for Business](/images/iabiz/cocreer_avec_ia.png)


---

# Objectifs

La delegation integrale ne fonctionne pas. C'est le piege classique. TRavailler avec une IA demande de l'effort et de la précision. rien de magique.

**co-création** plutôt que **délégation**

**Comment travailler avec chatgpt** dans un mode de co-création ?

*   Résoudre un problème
*   Prendre une décision
*   Définir une suite d'actions
*   Comprendre


[Pour de belles slides](/pdf/IA_strategies_maitrise.pdf)

---

# Modes de travail

On peut distnguer 2 modes de travail

## Délégation entière

*fais le travail*, survoler les résultats, copier coller

*   Gain de temps mais perte de pertinence et de qualité.
*   Qualité moyenne. erreurs potentielles. résultats peu probants


## Itératif, interactif, progressif
*   Travail collaboratif et itératif
*   Contrôle de l'IA avec délégation de certaines tâches spécifiques. L'humain reste en contrôle.

---

## Le Prompt Initial
*   Il est long et précis
*   Ça prend du temps
*   On oublie toujours quelque chose

---
## Le Contexte (Primordial)
*   Assigner un rôle : *tu es un spécialiste en informatique solution de stockage...*
*   Alternative : indiquer le domaine par quelques mots clefs
*   Spécifier le contexte :
    *   Qui je suis (occupation, familiarité avec le sujet, ...)
    *   De quoi j'ai besoin
    *   Pourquoi j'en ai besoin
    *   Ce qui est important pour moi

---
## Attentes et Conclusion du Prompt
*   Quelles sont les attentes
    *   Je cherche ..., j'attends ..., j'ai besoin de ...
    *   Format de la réponse (document, excel, google doc, image, video, etc.)
*   Conclusion du premier prompt
    *   As-tu des questions ?
    *   Est-ce que tu as besoin de plus d'information ? / Tu as compris ce que je veux ?

---
## Extra (Instructions Spécifiques)
*   Préciser le style : narratif, pas de bullet points
*   Challenge ce que je dis, pas de sycophantisme exacerbé
*   Réponses courtes et précises
*   Je suis un adulte, je sais lire
*   J'ai surtout besoin des faits, pas besoin de prendre de précautions

---
## Méthodologie Itérative
*   Travail itératif
*   Ensuite :
    *   Lire
    *   Vérifier
    *   Itérer
    *   Prendre le temps de bien spécifier

---
## Bonnes Pratiques
*   Quelques bonnes pratiques
    *   Reformuler : voici ce que j'ai compris
    *   Demander des précisions
    *   Prendre du recul : plus généralement ...
    *   Push back, challenger les réponses : es-tu sûr de ce que tu dis ?
    *   Quelles sources utilises-tu ?
*   On est dans une phase de co-création de savoir.

---
## En cas de blocage
*   Quand on sèche, on peut lui demander :
    *   De l'aide à la rédaction
    *   Rédiger un prompt : écrit un bon prompt pour générer une image à partir de ...

---
## Gestion technique
*   Fenêtre de contexte
*   La fenêtre de contexte est limitée.
*   Si la conversation dure depuis longtemps, lui demander un résumé pour recommencer une autre session

---
## Introspection
*   Il faut développer une intuition sur la qualité, l'exactitude des rendus et sur son ressenti personnel
*   Y'a un truc qui colle pas (*a smell*)
*   Fatigue
*   Envie d'aller vite
*   On tourne en rond -> recommencer, nouveaux chat, différent model

---
## Conclusion
*   Travailler avec l'IA demande de la concentration, beaucoup de lecture et d'écriture.
*   C'est fatiguant, c'est intense


---

<TitleSlide>

# Focus sur chatGPT

</TitleSlide>
---




# scope

- GPT-5
- openAI Agent
- tools: Operator and deep research
    - Operator could scroll, click, and type on the web,
    - deep research excelled at analyzing and summarizing information
    - application : https://help.openai.com/en/articles/11487775-connectors-in-chatgpt
- style d'ecriture

- agent tools: a visual browser that interacts with the web through a graphical-user interface, a text-based browser for simpler reasoning-based web queries, a terminal, and direct API access


# Mode agentic dans chatGPT


- chatGPT lance son propre espace de travail / ordinateur

Dans cet espace de travail, chatGPT va planifier et exécuter des tâches

Il a acces
- a des outils
- a des ressources
- a de la memoire


des outils externs
- recherche web
- creer des documents: images, slides, spreadsheet

des outils internes
- ecrire du code et l'executer
    - analyse de données
    - creation de diagramme

et des agents specialisés.

- un coordonateur / planificateur des taches qui va transformer votre requetes en une serie de petites taches
- un evaluateur qui verifie la bonne execution des taches.
- un verificateur final

Chaque de ces agents est en fait un LLM avec un role precis.

---

on passe d'un chatGPT qui répond a un chatGPT qui fait des choses!

le mode agent peut par exemple

- activement parcourir le web (cliquer, remplir des cases etc )
- avec une connection a gmail, ou google drive il peut
   - lire les emails te les resumer (il ne peut envoyer d'email)
   - creer ou analyser des documents

---

# dans la realité

- bien vendu: gagner du temps, automatiser les taches repetitives etc
- mais tres lent
- pas tres _intelligent_
- ca marche sur certaines taches simples. mais la qualité n'est pas au rendez vous
- gros risques de securité si on le laisse travailler sur le web
- ok pour des taches sans risque :
    - lire et resumer
    - scanner et alerter
    - transformer des données non critiques (pas grave s'il y a une erreur)
    - gestion documentaire
    - converser et aider

- ca va surement s'ameliorer donc commencer a travailler avec des maintenant va payer sur le moyen terme

mais frustration et chronophage

resources

https://www.datacamp.com/fr/tutorial/chatgpt-agent


