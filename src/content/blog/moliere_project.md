---
title: "Moliere.love : traduire Molière en français moderne avec l’IA"
date: 2025-08-01
author: Alexis Perrier
tags: [AI générative, EDtech, Claude, LLMs, Littérature, WCAG]
image: /images/blog/moliere_et_son_iphone.webp
description: "Un projet expérimental mêlant intelligence artificielle et humanités numériques pour traduire les œuvres de Molière en français moderne, vers par vers. Conçu comme un laboratoire de travail avec les LLM, il explore le prompt engineering, la génération contrôlée de texte et les enjeux d’accessibilité, à travers une application web et mobile pensée pour un usage pédagogique réel."
link: "https://Moliere.love"
link_text: "Moliere.love"
---


# [Moliere.love](https://Moliere.love) : Molière en français moderne avec l’IA

Molière est omniprésent dans l’enseignement secondaire français. Du collège au lycée, ses pièces accompagnent des générations d’élèves, au point d’incarner presque à lui seul la littérature classique. Pourtant, cette omniprésence ne rime pas toujours avec accessibilité. Pour beaucoup d’élèves, Molière est moins une découverte qu’un obstacle : une langue perçue comme lointaine, des tirades interminables, un effort de décodage qui prend souvent le pas sur la compréhension du fond.

C’est de ce constat qu’est né le projet [Moliere.love](https://Moliere.love). L’idée est simple dans son principe, mais ambitieuse dans son exécution : traduire Molière en français moderne, en s’appuyant sur l’intelligence artificielle, afin de rendre ses textes plus accessibles aux collégiens et lycéens, sans trahir l’œuvre originale.

Ce projet est à la fois personnel et pédagogique. Personnel, parce qu’il s’inscrit dans une volonté d’apprendre à travailler avec l’IA générative sur le long terme. Pédagogique, parce qu’il vise avant tout à faciliter la vie d’élève, en abaissant les barrières linguistiques qui empêchent souvent l’entrée dans les textes.

**Pourquoi traduire Molière ?**

En France, Molière est un monument. Sa langue est souvent présentée comme “la” langue française par excellence. C’est précisément ce caractère sacralisé qui rend toute transgression délicate. Pourtant, ailleurs, la question ne se pose plus vraiment : les textes de Shakespeare, par exemple, sont modernisés, adaptés, retraduits depuis longtemps, sans que cela n’enlève quoi que ce soit à leur valeur littéraire.

Pourquoi Molière échapperait-il à ce mouvement ? Pourquoi considérer qu’un élève doit d’abord souffrir du texte avant de pouvoir en saisir l’intelligence, la satire sociale, la finesse des rapports humains ?

Le terme employé ici n’est pas celui d’“adaptation”, mais bien de **traduction**. Le travail est mené vers par vers, en respectant la structure de l’original. Les deux textes sont proposés en vis-à-vis : le texte classique et sa version en français moderne. L’objectif n’est pas de remplacer l’original, mais de servir de passerelle. Une porte d’entrée.

Tout est pensé dans un seul sens : faciliter.
- Faciliter la compréhension du vocabulaire.
- Faciliter l’accès au sens global d’une scène.
- Faciliter la lecture des tirades, parfois raccourcies lorsque leur longueur nuit à l’attention.

**Apprendre à écrire avec l’IA n’a rien d’évident**

Le projet a commencé  en 2023, il y a une eternité dans le monde de l'IA.  Les premières tentatives ont été frustrantes. Générer un texte grammaticalement correct est une chose ; produire une traduction qui respecte à la fois l’histoire, le ton, le style, et les contraintes formelles d’un texte théâtral en est une autre.

Les difficultés étaient nombreuses. Le vouvoiement et le tutoiement variaient selon l’“humeur” du modèle. Le nombre de vers n’était pas respecté. Le registre de langue glissait parfois vers le familier et l'argot. Autant d’écueils pour un texte destiné à un usage pédagogique.

Un détour par la rhétorique et les figures de style s’est avéré nécessaire. Comprendre précisément ce que l’on attend du texte permet d’affiner les prompts, d’imposer des contraintes claires, et d’obtenir progressivement des résultats plus cohérents. Ce travail patient a accompagné l’évolution des modèles, en particulier ceux de la famille Claude, dont les progrès ont été très nets au fil du temps.

**Images, scènes… et limites culturelles**

La génération d’images a posé d’autres problèmes. Maintenir une cohérence visuelle des personnages d’une scène à l’autre s’est révélé quasiment impossible. Chaque tentative produisait des visages légèrement différents, rompant l’illusion de continuité théâtrale.

Certaines scènes ont également buté sur des limites plus inattendues. Par exemple, il s’est avéré impossible de générer une image représentant une nourrice allaitant un enfant. Une forme de censure culturelle, probablement d’inspiration puritaine, qui rappelle que ces outils ne sont jamais neutres. Cet épisode reste une anecdote, mais une anecdote révélatrice des cadres implicites dans lesquels évoluent les IA actuelles.

**Accessibilité : un fil conducteur**

L’application, disponible à la fois sur le web et sur mobile (iOS et Android), a été conçue avec un souci constant d’accessibilité. Respect des normes existantes, choix d’une police adaptée aux personnes dyslexiques, réglage de la taille du texte, mode sombre… Autant de détails qui, mis bout à bout, changent profondément l’expérience de lecture.

La question du neuro-atypisme n’est jamais traitée de manière frontale ou militante, mais elle traverse tout le projet. Les outils modernes offrent aujourd’hui une opportunité rare : rendre les textes classiques non seulement plus compréhensibles, mais réellement accessibles au plus grand nombre. Ce serait dommage de s’en priver.

**Coder avec l’IA : une méthode avant tout**

[Moliere.love](https://Moliere.love) est aussi un terrain d’expérimentation pour le coding avec l’IA. Je n’avais jamais développé d’application mobile auparavant. Avec des outils comme Claude Code, il a été possible de mettre en production, en quelques semaines, une application complète sur [l'App Store](https://apps.apple.com/us/app/moliere-love/id6749472602) et [Google Play](https://play.google.com/store/apps/details?id=com.skatai.molierelove&hl=en-US&pli=1), avec un accompagnement à chaque étape de publication et de validation.

Contrairement à une idée reçue, coder avec l’IA ne signifie pas abandonner toute rigueur. Bien au contraire. Les applications obtenues sont stables et performantes à condition de respecter quelques principes simples : décomposer chaque fonctionnalité en sous-tâches élémentaires, éviter toute complexité inutile, écrire beaucoup de tests automatisés, et refactorer régulièrement. KISS, SOLID et YAGNI sont d'autant plus importante que la generation de code est déléguée à un agent.

Une règle empirique s’impose rapidement : quand quelque chose “sent mauvais” dans le code, c’est souvent que l’agent a dérapé.

**Et ensuite ?**

Le projet est mis à jour régulièrement avec de nouvelles pièces. Une piste envisagée consiste à intégrer un bot open source via Ollama afin de réduire les coûts d’API, tout en anticipant les enjeux de modération que cela implique.
Les idées ne manquent pas mais le temps est compté.

[Moliere.love](https://Moliere.love) reste avant tout un projet de démonstration : démonstration de ce que l’IA permet aujourd’hui dans le champ éducatif, démonstration d’une méthode de travail avec l’IA générative, et démonstration qu’il est possible de toucher à des textes considérés comme intouchables, non par provocation gratuite, mais par souci de transmission.

