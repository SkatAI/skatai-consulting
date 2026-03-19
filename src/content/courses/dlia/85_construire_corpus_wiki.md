---
title: "Construire son propre corpus Wiki"
page_title: "Construire son propre corpus Wiki"
---

# Construire son propre corpus Wiki

> **Objectif :** Télécharger un sous-ensemble ciblé de pages depuis un wiki de fans (basé sur MediaWiki) pour constituer un corpus qui servira de base de connaissances à un système de Retrieval-Augmented Generation (RAG).

Pas besoin de milliers de pages. **30 à 80 pages bien choisies** suffisent largement pour construire un pipeline RAG fonctionnel et poser des questions intéressantes.

---

## 1. Choisir son univers

Le script [wiki_downloader.py](https://alexisperrier.com/python/wiki_downloader.py) fonctionne avec **n'importe quel wiki basé sur MediaWiki**. Il suffit de modifier la variable `BASE_URL` en haut du fichier.

Voici quelques options populaires :

| Franchise | Wiki | `BASE_URL` | Chemin API |
|-----------|------|------------|------------|
| Pokémon | Bulbapedia | `https://bulbapedia.bulbagarden.net` | `/w/api.php` |
| Star Trek | Memory Alpha | `https://memory-alpha.fandom.com` | `/api.php` |
| Dragon Ball | Dragon Ball Wiki | `https://dragonball.fandom.com` | `/api.php` |
| Star Wars | Wookieepedia | `https://starwars.fandom.com` | `/api.php` |
| One Piece | One Piece Wiki | `https://onepiece.fandom.com` | `/api.php` |
| Naruto | Narutopedia | `https://naruto.fandom.com` | `/api.php` |
| Seigneur des Anneaux | Tolkien Gateway | `https://tolkiengateway.net` | `/w/api.php` |
| Marvel | Marvel Database | `https://marvel.fandom.com` | `/api.php` |
| Zelda | Zelda Wiki | `https://zelda.wiki` | `/w/api.php` |
| Minecraft | Minecraft Wiki | `https://minecraft.wiki` | `/w/api.php` |
| Harry Potter | Harry Potter Wiki | `https://harrypotter.fandom.com` | `/api.php` |
| Doctor Who | TARDIS | `https://tardis.fandom.com` | `/api.php` |

> **⚠️ Attention aux chemins API :** Les wikis indépendants (Bulbapedia, Tolkien Gateway, Zelda Wiki, Minecraft Wiki) utilisent en général `/w/api.php`. Les wikis hébergés par Fandom utilisent `/api.php`. Si vous obtenez des erreurs 404, essayez l'autre chemin.

Pour changer de wiki, modifiez **deux lignes** dans le script :

```python
BASE_URL = "https://dragonball.fandom.com"        # ← votre wiki
API_ENDPOINT = f"{BASE_URL}/api.php"               # ← adapter le chemin si nécessaire
```

---

## 2. Installation et test

```bash
pip install requests
python wiki_downloader.py search "Goku"
```

Si des résultats s'affichent, c'est bon.

---

## 3. Stratégie : construire un corpus cohérent

Un bon corpus pour le RAG est **thématiquement cohérent**. Ne téléchargez pas des pages au hasard — choisissez une tranche de l'univers qui forme un ensemble logique, pour que votre RAG puisse répondre à des questions connectées entre elles.

### Stratégie A — Choisir un arc narratif

Téléchargez les pages autour d'un arc ou d'une saga spécifique.

**Exemple : Dragon Ball Z — Saga de Freezer**

```bash
# Chercher les sujets clés
python wiki_downloader.py search "Frieza"
python wiki_downloader.py search "Namek"
python wiki_downloader.py search "Super Saiyan"

# Télécharger personnages et lieux principaux
python wiki_downloader.py bulk \
    Frieza Goku Vegeta Piccolo Krillin Gohan \
    "Captain Ginyu" "Ginyu Force" Zarbon Dodoria \
    Namek "Planet Vegeta" "Dragon Balls" \
    "Super Saiyan" "Frieza Saga" \
    --dir corpus/saga_freezer
```

### Stratégie B — Choisir une catégorie

La plupart des wikis organisent leurs pages en catégories. Utilisez la commande `category` pour découvrir les pages, puis téléchargez-les.

**Exemple : Star Trek — Espèce et culture vulcaine**

```bash
# Lister les pages d'une catégorie
python wiki_downloader.py category "Vulcans"
python wiki_downloader.py category "Vulcan culture"

# Télécharger les pages pertinentes
python wiki_downloader.py bulk \
    Vulcan Spock T'Pol Sarek Tuvok \
    "Vulcan nerve pinch" "Pon farr" "Kolinahr" \
    "Vulcan High Command" "Mount Seleya" \
    "Mind meld" "Live long and prosper" \
    --dir corpus/vulcains
```

### Stratégie C — Choisir une génération / époque

Téléchargez les personnages, lieux et mécaniques d'une ère précise.

**Exemple : Pokémon — Génération I**

```bash
# Lister les pokémon de la gen 1
python wiki_downloader.py category "Generation I Pokémon"

# Télécharger une sélection + concepts clés
python wiki_downloader.py bulk \
    Bulbasaur Charmander Squirtle Pikachu Eevee \
    Mewtwo Mew Gengar Snorlax Dragonite \
    "Pallet Town" "Indigo Plateau" "Kanto" \
    "Professor Oak" "Pokémon Red and Blue" \
    --dir .
```

---

## 4. Formats de sortie

Le script propose trois formats. Choisissez en fonction de votre pipeline RAG :

| Format | Option | Adapté pour |
|--------|--------|-------------|
| **Texte brut** | `--format text` (défaut) | Découpage en chunks, embeddings, la plupart des pipelines RAG |
| **Wikitext** | `--format wikitext` | Si vous voulez le balisage brut avec liens et templates |
| **HTML** | `--format html` | Si votre pipeline gère le HTML structuré |

**Pour ce TP, utilisez le texte brut.** C'est le plus simple à découper et à vectoriser.

```bash
# Toutes les pages en texte brut (par défaut)
python wiki_downloader.py bulk Goku Vegeta --dir corpus/dbz

# Les mêmes pages en HTML
python wiki_downloader.py bulk Goku Vegeta --dir corpus/dbz_html --format html
```

---

## 5. Vérifier son corpus

Après le téléchargement, vérifiez que vos fichiers contiennent bien du contenu :

```bash
# Compter les fichiers
ls corpus/mon_sujet/ | wc -l

# Vérifier qu'un fichier n'est pas vide
head -50 corpus/mon_sujet/Goku.txt

# Taille totale du corpus en mots
wc -w corpus/mon_sujet/*.txt
```

**Ce qu'il faut viser :**

| Métrique | Cible |
|----------|-------|
| Nombre de pages | 30 – 80 |
| Mots par page | 500 – 5 000 (variable selon l'article) |
| Taille totale du corpus | 50 000 – 200 000 mots |

Si une page revient vide, le titre est peut-être légèrement différent sur le wiki. Utilisez `search` pour trouver le titre exact.

---

## 6. En cas de problème

**Page introuvable / contenu vide :**

Les titres des wikis sont sensibles à la casse et peuvent contenir des underscores. Cherchez d'abord :

```bash
python wiki_downloader.py search "super saiyan"
# → Utilisez le titre exact renvoyé par les résultats
```

**Erreurs sur un wiki Fandom :**

Vérifiez que vous utilisez bien `/api.php` (et non `/w/api.php`) pour les wikis Fandom :

```python
API_ENDPOINT = f"{BASE_URL}/api.php"
```

**Limitation de débit / timeouts :**

Soyez respectueux du serveur. Ajoutez un petit délai si vous téléchargez beaucoup de pages :

```python
import time
# Dans une boucle :
time.sleep(1)  # 1 seconde entre chaque requête
```

**Caractères spéciaux dans les titres :**

Entourez les titres avec des caractères spéciaux de guillemets en ligne de commande :

```bash
python wiki_downloader.py page "Majin Buu (fat)"
```

---

## 7. Et après ?

Une fois votre corpus constitué sous forme de fichiers `.txt`, les étapes du pipeline RAG sont les suivantes :

1. **Charger** — Lire chaque fichier `.txt`
2. **Découper** — Diviser les pages longues en passages plus courts (ex. 500 tokens avec 50 tokens de chevauchement)
3. **Vectoriser** — Calculer les embeddings vectoriels de chaque passage
4. **Indexer** — Stocker les embeddings dans une base vectorielle (FAISS, Chroma, etc.)
5. **Interroger** — Vectoriser la question de l'utilisateur → récupérer les top-k passages similaires → les passer en contexte à un LLM

**Exemples de questions auxquelles votre RAG devrait pouvoir répondre :**

- *Dragon Ball :* « Comment Goku s'est-il transformé en Super Saiyan pour la première fois ? »
- *Star Trek :* « Qu'est-ce que le rituel vulcain du Kolinahr ? »
- *Pokémon :* « Quels sont les avantages de type de Dracaufeu ? »
- *Star Wars :* « Qui a formé Obi-Wan Kenobi ? »

---

## Récapitulatif

```text
1. Choisir sa franchise et modifier BASE_URL
2. Explorer avec `search` et `category`
3. Télécharger 30-80 pages en texte brut avec `bulk`
4. Vérifier que le corpus n'est pas vide
5. Brancher le tout sur votre pipeline RAG
```


