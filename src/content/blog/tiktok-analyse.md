---
title: "Analysons TikTok"
date: 2024-06-19
description: "Analyse multimodal des videos TikTok grace au deep learning et machine learning classique"
author: Alexis Perrier
tags: [Workshop, Deep Learning, TikTok, Analysis, NLP, Computer Vision]
---

# TikTok

TikTok a un impact important sur la société. Les politiciens et politiciennes y sont nombreux et influencent les élections, ... TikTok est donc une mine d'or d'information qu'il convient d'analyser.

Dans ce workshop, nous allons télécharger une série de vidéos d'un compte et analyser leur contenu grâce aux deep learning.

Le workshop a 4 parties:
1. téléchargement des vidéos. Nous utilisons la librairie yt-dlp pour obtenir les vidéos d'un compte.
2. Analyse des images. Plutôt que de traiter les vidéos qui sont de fait assez lourdes, nous allons en extraire les images les plus représentatives grâce à pyscene-detect. Une fois obtenus les embeddings des images, nous pourrons les clusteriser pour analyser les représentations graphiques des vidéos
3. Nous allons aussi extraire le son des vidéos et ne gardant que la partie non musicale, en extraire les paroles. Grâce au speech-to-text nous pourrons faire l'analyse textuelle des vidéos, regarder quelles sont les termes utilisés, la sémantique, les sujets abordés etc.

## Choisir les chaines TikTok

Nous allons prendre des comptes TikTok francophones avec une diversité d'images et de contenu. Donc nous évitons des chaines de vidéos trop ressemblantes avec les mêmes backgrounds. Les chaines d'information sont intéressantes pour cela. Nous choisissons aussi des chaines assez polarisées dans le traitement de l'information pour obtenir des comparaisons intéressantes.

Voici une liste non exhaustive de chaines d'informations française et francophone que nous allons regarder:
@cnews, @france24, @bfmtv, @euronewsfr, @lci_tv_officiel

Sur chaque chaine, nous téléchargerons les 50 dernières vidéos.

## Comment télécharger les vidéos de TikTok

La constitution du dataset est la partie la plus difficile et instable du projet.
Les réseaux sociaux ont tendance à rendre le scraping de leur contenu le plus difficile possible.

L'outil le plus efficace pour télécharger les vidéos de YouTube, TikTok et d'autres sites, reste yt-dlp.

Pour TikTok il existe des librairies python dédiées telles que [TikTokApi](https://pypi.org/project/TikTokApi) ou [TikTokDownloader](https://github.com/JoeanAmier/TikTokDownloader), mais après quelques heures de travail, il me semble que [yt-dlp](https://github.com/yt-dlp/yt-dlp) est plus simple et surtout plus efficace.

Fréquemment mis à jour, compatible avec de nombreux sites, yt-dlp existe en version ligne de commande et librairie python.

Yt-dlp supporte plus de [1800 sites](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md) dont instagram, youtube, tiktok facebook, etc... ainsi que de nombreuses chaînes d'informations du monde entier.

Le concept de base est très simple, dans un terminal:

```bash
yt-dlp url_page_video
```

Mais les choses se compliquent très rapidement si l'on ne veut pas être détecté comme *bot* par la plateforme.
Il faut:
- se faire passer pour un navigateur
- simuler une session avec les bons cookies
- faire les requêtes de manière asynchrone
- ne pas enchainer les requêtes trop rapidement
- etc

A ce stade, le plus rapide pour obtenir un code qui tourne est de s'appuyer sur un LLM. J'utilise [claude.ai](https://claude.ai) d'Anthropic et le modèle Claude 3.5 Sonnet.

Obtenir les vidéos d'un compte TikTok est en 2 temps. D'abord les ID des vidéos et ensuite le téléchargement des vidéos elles-mêmes.

L'url d'une vidéo TikTok est par exemple:
`https://www.tiktok.com/@france24/photo/7379243276517313824`

Donc composée du nom de la chaine **france24** et de l'id de la vidéo **7379243276517313824**.

Le premier script permet d'obtenir les IDs des vidéos d'une page d'un compte TikTok:
[Gist: Get TikTok Video IDs](https://gist.github.com/alexisperrier/952a0c34b92ef76c761abdb4a9633f0d)

Le second script prend en entrée les urls des vidéos ainsi obtenues et les télécharge en parallèle en implémentant une limitation de débit pour éviter de surcharger le serveur:
[Gist: Download TikTok Videos](https://gist.github.com/alexisperrier/609a77b0cb8895437595d9dc2f754e29)

## Détecter les scènes

Même si les LLMs deviennent multimodaux, traiter une vidéo reste lourd en ressources. On va réduire le problème en passant pour chaque vidéo aux images les plus significatives. Il suffit d'utiliser pour cela [scenedetect](https://www.scenedetect.com/) une librairie python de détection des changements de scènes qui permet de sauvegarder les images correspondantes.

```bash
pip install scenedetect
```

Vous allez aussi devoir installer ffmpeg. Avec la commande (sur un mac):
```bash
brew install ffmpeg
```

Le code complet d'extraction des images significatives des vidéos est disponible sur le gist:
[Gist: Scene Detection](https://gist.github.com/alexisperrier/29a62eb6580ba07748d4e0c8d97bda56)

## Vectoriser les images

Pour regrouper les images par similarité, nous devons d'abord les vectoriser en trouvant leur embedding.
Le principe repose sur l'utilisation d'un modèle de deep learning adapté au traitement d'image et déjà entrainé.

On prend un modèle de type réseau neuronal convolutif (CNN) comme ResNet, VGG ou EfficientNet entraîné sur de la classification et par conséquent capable d'extraire les caractéristiques des images. L'embedding (vecteur) ainsi obtenu permettra de calculer une distance entre les images et donc de regrouper celles qui sont similaires entre elles (clustering).

Pour cela:
- on supprime la dernière couche de classification,
- on fait passer les images dans le réseau
- on récupère le vecteur en sortie

Le code avec Tensorflow et Keras est disponible sur ce gist:
[Gist: Image Vectorization](https://gist.github.com/alexisperrier/772eb91463f13758503774b042843b0f)

Le modèle EfficientNet-B0 allie rapidité et précision et permet de travailler sans GPU sans nécessiter beaucoup de mémoire.

On sauve les embeddings dans un fichier au format .h5

## Cluster des images

Nous avons maintenant les images résumant les vidéos et leur embeddings.
Nous pouvons maintenant faire du clustering.

3 étapes:
- réduire les dimensions des images à 2 pour pouvoir les afficher. On utilise du PCA pour la réduction de dimension
- clustering avec Kmeans ou t-SNE
- affichage des images pour montrer leur proximité

## Extraction de l'audio

Nous avons les images des vidéos. Nous pouvons en extraire le son.

## Speech to text

Nous allons maintenant extraire les paroles de chaque bande audio.
Il nous faut d'abord filtrer les bandes sons qui sont uniquement de la musique de celles qui sont des paroles.
Puis nous ferons du speech-to-text pour extraire ce qui est dit sur la vidéo.

## Conclusion

À partir d'un compte TikTok nous obtenons une grande quantité de données sur le contenu du compte.
Les images utilisées, ce qui est dit et donc le message de la chaine.

Un processus qui pourrait par exemple sur un sujet d'actualité mettre en avant les différences de traitement du sujet par les différentes chaines
ou comprendre rapidement de quoi parle une chaine ou ses followers.
