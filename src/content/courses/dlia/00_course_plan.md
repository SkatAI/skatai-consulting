---
layout: prose
title: "Introduction"
page_title: "Deep Learning et Intelligence Artificielle"
summary: "Du deep learning en machine learning supervisée aux architectures complexes de type Transformers"
slides_project_home: /courses/dlia/
---

# Deep Learning et Intelligence Artificielle

## Plan du cours

[Introduction au machine learning](/courses/dlia/intro_ml/)
- classification vs régression
- calcul de sqrt(2), erreur, fonction de cout
- régression linéaire et régression logistique
- stochastic gradient descent
- biais et overfitting

---

## [Le perceptron](/courses/dlia/perceptron/)

- le perceptron (1957)
- fonctions d'activation
- perceptron multicouche
- backpropagation
- exploding et vanishing gradients
- réseaux de neurones feedforward
- regularization et dropout
- Keras, Tensorflow, Pytorch

---

## [Réseaux de neurones à convolution](/courses/dlia/cnn_rnn/)
- convolution
- pooling
- normalization

---

## [Transfer Learning](/courses/dlia/transfer_learning/)

Réutilisation de modèles pré-entraînés pour améliorer l'apprentissage sur de nouvelles tâches

---

## [Réseaux de neurones récurrents](/courses/dlia/rnn/)
- RNN
- LSTM
- GRU

---

## Attention and Transformers

- [notebook](https://github.com/SkatAI/deeplearning/blob/master/notebooks/moliere_lstm_generation.ipynb) : Generer du text avec un LSTM
- [Transformers & attention mechanism]((/courses/dlia/transformers/))
- [L'IA aujourd'hui](/courses/dlia/ai_today_feb_26)
- [TP Ollama](/courses/dlia/ollama/)

---

## [VAE - variational autoencoder]()

- Compresse des données complexes (images, texte, etc.) en une représentation latente continue et structurée.
- Génère de nouveaux exemples similaires en échantillonnant depuis cette représentation latente

**Use cases:** Génération d'images réalistes, Interpolation entre exemples, Détection d'anomalies

Comme dit CLaude:

> _Contrairement à un autoencoder classique, le VAE ajoute une régularisation probabiliste (divergence KL) qui force l'espace latent à suivre une distribution normale, ce qui le rend "explorable" pour générer de nouvelles données cohérentes._ 🤣🤣🤣

## [GANs - Generative Adversarial Networks]()
Deux réseaux en compétition :
- Générateur : crée des images fake à partir de bruit aléatoire
- Discriminateur : apprend à distinguer fake vs réel

Le générateur s'améliore pour tromper le discriminateur, qui s'améliore pour détecter les fakes. Cette compétition produit des images de plus en plus réalistes.
- Résultat : génération d'images très haute qualité et photréalistes (visages, paysages, etc.)
- Applications : deepfakes, synthèse d'images, style transfer, super-résolution...

## [Diffusion models]()

- Modèles génératifs qui créent des images en inversant un processus de bruit.
- DALL-E 3, Midjourney, Stable Diffusion - text-to-image - Imagen

## [Reinforcement Learning (RL)]()

- Un agent apprend par essai-erreur en interagissant avec un environnement, guidé par des récompenses.
- Jeux (AlphaGo, jeux vidéo), Robotique (apprentissage moteur), Recommandation (optimiser engagement), Contrôle (thermostat, drones)


## Evaluation

à definir

- projet final
- quiz
