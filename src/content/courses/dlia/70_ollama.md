# TP — Faire tourner un modèle de langage sur votre machine

## Master 1 Art & Science — ESIEE Paris

---

## 1. Introduction : Qu'est-ce qu'Ollama ?

### Le problème

Quand vous utilisez ChatGPT ou Claude, vos requêtes partent sur des serveurs distants, équipés de GPU coûtant des dizaines de milliers d'euros. C'est puissant, mais :

- Vos données quittent votre machine
- Vous dépendez d'une connexion internet
- Vous n'avez aucun contrôle sur le modèle

### La solution : Ollama

**Ollama** est un outil open source qui permet de **télécharger et exécuter des modèles de langage (LLM) directement sur votre ordinateur**, sans GPU, sans cloud, sans compte.

Concrètement, Ollama :

- Télécharge des modèles pré-entraînés (comme on téléchargerait une application)
- Les exécute sur votre CPU (pas besoin de carte graphique)
- Expose une API locale sur `http://localhost:11434` pour dialoguer avec le modèle

> **Analogie** : Ollama est à un LLM ce que VLC est à une vidéo — un lecteur local, simple et universel.

### Comment un modèle tient-il sur un PC ?

Les gros modèles comme GPT-4 ont des centaines de milliards de paramètres et nécessitent des serveurs entiers. Mais il existe des modèles plus petits, **quantifiés** (compressés) pour tenir en mémoire :

| Modèle | Paramètres | RAM nécessaire | Qualité |
|--------|-----------|----------------|---------|
| TinyLlama 1.1B | 1,1 milliard | ~1 Go | Basique, parfois incohérent |
| Phi-3 Mini 3.8B | 3,8 milliards | ~2,5 Go | Bon pour sa taille |
| Gemma 2 2B | 2 milliards | ~1,5 Go | Bon équilibre taille/qualité |
| Llama 3.1 8B | 8 milliards | ~5 Go | Très bon, besoin de 8+ Go de RAM |
| Mistral 7B | 7 milliards | ~4,5 Go | Excellent, modèle français 🇫🇷 |

> **Règle simple** : si votre PC a **8 Go de RAM**, les modèles jusqu'à ~3-4B tournent confortablement. Avec **16 Go de RAM**, vous pouvez aller jusqu'à 7-8B.

La **quantification** réduit la précision de chaque paramètre (de 32 bits à 4 bits par exemple), ce qui divise la taille du modèle par 4 à 8 tout en conservant l'essentiel de la qualité.

---

## 2. Installation d'Ollama

### Option A : Installation directe (recommandé)

#### Sur Windows

1. Allez sur **https://ollama.com/download**
2. Téléchargez l'installateur Windows
3. Exécutez le `.exe` et suivez les instructions
4. **Pas besoin de droits administrateur** dans la plupart des cas (l'installation se fait dans votre profil utilisateur)

> **⚠️ Si l'installation échoue** : certaines machines en salle de TP bloquent les installations. Passez à l'**Option B (Docker)**.

#### Sur macOS

```bash
# Méthode 1 : téléchargement direct
# Allez sur https://ollama.com/download et téléchargez la version macOS

# Méthode 2 : via Homebrew (si installé)
brew install ollama
```

### Option B : Via Docker (si vous avez Docker installé)

Docker est souvent déjà installé sur les machines de TP. C'est la méthode la plus fiable si l'installation directe pose problème.

```bash
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

Cette commande :
- Télécharge l'image Docker d'Ollama
- Lance un conteneur en arrière-plan (`-d`)
- Stocke les modèles dans un volume persistant (`-v ollama:/root/.ollama`)
- Rend l'API accessible sur le port 11434 (`-p 11434:11434`)

Pour exécuter des commandes Ollama via Docker :

```bash
# Télécharger un modèle
docker exec ollama ollama pull tinyllama

# Lancer un chat
docker exec -it ollama ollama run tinyllama
```

### Vérification de l'installation

Ouvrez un **terminal** et tapez :

```bash
ollama --version
```

Vous devriez voir un numéro de version. Si ce n'est pas le cas, relisez la section installation.

---

## 3. Ouvrir un terminal

> **Si vous savez déjà ouvrir un terminal, passez à la section suivante.**

### Sur Windows

Trois façons d'ouvrir un terminal :

1. **PowerShell** (recommandé) : Tapez `PowerShell` dans la barre de recherche Windows (en bas à gauche), puis cliquez sur l'application
2. **Windows Terminal** : Si installé, tapez `Terminal` dans la barre de recherche
3. **Invite de commandes** : Tapez `cmd` dans la barre de recherche

> Vous verrez une fenêtre avec un curseur clignotant. C'est ici que vous taperez les commandes.

### Sur macOS

1. Ouvrez **Spotlight** (Cmd + Espace)
2. Tapez `Terminal`
3. Appuyez sur Entrée

---

## 4. Télécharger et lancer votre premier modèle

### Étape 1 : Télécharger un modèle

Nous commençons avec **TinyLlama** — petit, rapide, parfait pour un premier test :

```bash
ollama pull tinyllama
```

Le téléchargement fait environ **600 Mo**. Attendez qu'il se termine.

> **Via Docker** : `docker exec ollama ollama pull tinyllama`

### Étape 2 : Lancer le modèle

```bash
ollama run tinyllama
```

Vous êtes maintenant **en conversation directe avec un Transformer qui tourne sur votre CPU**.

Essayez :

```
>>> Explique-moi ce qu'est un réseau de neurones en 3 phrases.
```

Observez :
- Le texte apparaît **mot par mot** (génération auto-régressive, exactement comme dans le cours)
- La vitesse dépend de votre processeur
- La qualité est... variable (c'est un tout petit modèle !)

Pour quitter : tapez `/bye`

### Étape 3 : Essayer un modèle plus gros

Si votre machine le permet (8+ Go de RAM libre) :

```bash
ollama pull phi3:mini
ollama run phi3:mini
```

Posez-lui la **même question** qu'à TinyLlama. La différence de qualité est le résultat direct du nombre de paramètres — un concept clé de l'architecture Transformer.

---

## 5. Explorer l'API Ollama avec Python

Ollama expose une API REST locale. On peut donc dialoguer avec le modèle depuis un script Python.

### Pré-requis

Python doit être installé. Vérifiez :

```bash
python --version
```

Installez la bibliothèque `requests` si nécessaire :

```bash
pip install requests
```

### Exercice 1 : Premier appel API

Créez un fichier `chat.py` :

```python
import requests
import time

# L'URL de l'API locale d'Ollama
URL = "http://localhost:11434/api/generate"

# Notre requête
payload = {
    "model": "tinyllama",          # Le modèle à utiliser
    "prompt": "Qu'est-ce qu'un Transformer en intelligence artificielle ?",
    "stream": False                 # On attend la réponse complète
}

print("⏳ Génération en cours...")
start = time.time()

response = requests.post(URL, json=payload)
result = response.json()

elapsed = time.time() - start

print(f"\n🤖 Réponse :\n{result['response']}")
print(f"\n⏱️  Temps de génération : {elapsed:.1f} secondes")
print(f"📊 Tokens générés : {result.get('eval_count', '?')}")

if result.get('eval_count') and elapsed > 0:
    tokens_per_sec = result['eval_count'] / elapsed
    print(f"🚀 Vitesse : {tokens_per_sec:.1f} tokens/seconde")
```

Exécutez :

```bash
python chat.py
```

> **Ce que vous observez** : votre CPU génère du texte token par token, exactement comme le décodeur Transformer que nous avons vu en cours. Chaque token est prédit en fonction de tous les tokens précédents grâce au mécanisme d'attention.

---

### Exercice 2 : L'effet de la température

La **température** contrôle le caractère aléatoire de la génération :
- `temperature = 0.0` → le modèle choisit toujours le token le plus probable (déterministe)
- `temperature = 1.0` → distribution naturelle
- `temperature = 2.0` → très aléatoire, créatif mais parfois incohérent

Créez un fichier `temperature.py` :

```python
import requests

URL = "http://localhost:11434/api/generate"
PROMPT = "Il était une fois dans un château"

temperatures = [0.0, 0.5, 1.0, 1.5, 2.0]

for temp in temperatures:
    payload = {
        "model": "tinyllama",
        "prompt": PROMPT,
        "stream": False,
        "options": {
            "temperature": temp,
            "num_predict": 80       # Limiter la longueur de la réponse
        }
    }

    response = requests.post(URL, json=payload)
    result = response.json()

    print(f"\n{'='*60}")
    print(f"🌡️  Température = {temp}")
    print(f"{'='*60}")
    print(result['response'][:300])  # Afficher les 300 premiers caractères
```

> **Question pour vous** : à quelle température le texte est-il le plus cohérent ? Le plus créatif ? À partir de quelle température le texte devient-il du charabia ?

---

### Exercice 3 : Comparer les modèles

Si vous avez téléchargé plusieurs modèles, comparez-les sur la même tâche :

Créez un fichier `compare.py` :

```python
import requests
import time

URL = "http://localhost:11434/api/generate"
PROMPT = "Explique le concept d'attention en intelligence artificielle en 5 phrases simples."

# Liste des modèles à comparer (adaptez selon ce que vous avez téléchargé)
models = ["tinyllama"]

# Décommentez les modèles que vous avez installés :
# models.append("phi3:mini")
# models.append("gemma2:2b")
# models.append("mistral")

for model in models:
    print(f"\n{'='*60}")
    print(f"🤖 Modèle : {model}")
    print(f"{'='*60}")

    payload = {
        "model": model,
        "prompt": PROMPT,
        "stream": False,
        "options": {"num_predict": 200}
    }

    start = time.time()
    response = requests.post(URL, json=payload)
    elapsed = time.time() - start
    result = response.json()

    print(f"\n{result['response']}")
    print(f"\n⏱️  {elapsed:.1f}s | "
          f"📊 {result.get('eval_count', '?')} tokens | "
          f"🚀 {result.get('eval_count', 0)/elapsed:.1f} tok/s")
```

> **Ce que vous devez observer** :
> - Les **gros modèles** donnent des réponses plus précises et mieux structurées
> - Les **petits modèles** sont plus rapides mais font plus d'erreurs
> - C'est le compromis fondamental des Transformers : **plus de paramètres = meilleure qualité, mais plus de calcul**

---

### Exercice 4 : Génération en streaming (voir les tokens arriver)

Le streaming permet de voir la génération **token par token** — exactement ce qui se passe dans le décodeur du Transformer.

Créez un fichier `stream.py` :

```python
import requests
import json
import time

URL = "http://localhost:11434/api/generate"

payload = {
    "model": "tinyllama",
    "prompt": "Raconte-moi une courte histoire sur un robot qui apprend à peindre.",
    "stream": True              # ← Active le streaming
}

print("🤖 Génération token par token :\n")

start = time.time()
token_count = 0

# La réponse arrive morceau par morceau
response = requests.post(URL, json=payload, stream=True)

for line in response.iter_lines():
    if line:
        data = json.loads(line)
        token = data.get("response", "")
        print(token, end="", flush=True)  # Affiche chaque token immédiatement
        token_count += 1

elapsed = time.time() - start
print(f"\n\n⏱️  {elapsed:.1f}s | 📊 {token_count} tokens | 🚀 {token_count/elapsed:.1f} tok/s")
```

> **Ce que vous voyez** : la nature auto-régressive du Transformer. Chaque token est généré en tenant compte de tous les tokens précédents grâce au mécanisme de **self-attention**.

---

## 6. Pour aller plus loin

### Voir les modèles disponibles

```bash
# Modèles installés sur votre machine
ollama list

# Catalogue complet : https://ollama.com/library
```

### Commandes utiles

```bash
ollama pull <modèle>      # Télécharger un modèle
ollama run <modèle>       # Lancer un chat interactif
ollama list               # Voir les modèles installés
ollama rm <modèle>        # Supprimer un modèle (libérer de l'espace)
ollama show <modèle>      # Voir les détails d'un modèle
```

### Modèles recommandés selon votre machine

| RAM disponible | Modèle recommandé | Commande |
|---------------|-------------------|----------|
| 4 Go | TinyLlama 1.1B | `ollama pull tinyllama` |
| 8 Go | Phi-3 Mini | `ollama pull phi3:mini` |
| 8 Go | Gemma 2 2B | `ollama pull gemma2:2b` |
| 16 Go | Mistral 7B 🇫🇷 | `ollama pull mistral` |
| 16 Go | Llama 3.1 8B | `ollama pull llama3.1` |

---

## 7. Récapitulatif

Ce que vous avez fait aujourd'hui :

1. **Installé Ollama** — un runtime local pour LLM
2. **Téléchargé un Transformer** et discuté avec lui dans le terminal
3. **Utilisé l'API** pour dialoguer avec le modèle depuis Python
4. **Exploré la température** — comment le sampling affecte la génération
5. **Comparé des modèles** de tailles différentes — vu l'impact du nombre de paramètres
6. **Observé le streaming** — la génération auto-régressive en temps réel

> **L'essentiel** : les modèles que vous avez utilisés sont des **Transformers** — la même architecture que ChatGPT, Claude, Gemini, etc. La différence est la taille : vos modèles locaux ont 1 à 8 milliards de paramètres, les modèles commerciaux en ont des centaines de milliards. Mais le principe est identique : de l'attention, des couches empilées, et une génération mot par mot.
