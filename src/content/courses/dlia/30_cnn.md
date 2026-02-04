---
layout: slides
title: "CNN & RNN"
page_title: "Convolutional Neural Networks & Recurrent Neural Networks"
summary: "Reseaux de neurones convolutifs et reccurents"
slides_project_home: /courses/dlia/
---

<TitleSlide>

# Convolutional Neural Networks

# Recurrent Neural Networks



[slides: Tenseurs, Keras, ...](https://docs.google.com/presentation/d/101_5TpuJgcOGTP5_x9m4aXEg9bNa44r7uHTxOjD8Kw0/edit?usp=sharing)

</TitleSlide>

---

# On a vu (rapidement)

**ML classique** :
- classification / regression,
- biais / overfitting,
- métriques, fonction de coût,
- techniques de régularisation
- **Le Perceptron**
- Fonctions d'activation, optimiseur
- Descente de Gradient Stochastique (SGD)
- Perceptron Multi Couche

---

# Vocabulaire

<Columns>
<Column>

- **Noeuds, Nodes, Neurones** : Les unités fonctionnelles des couches
- **Layers, Couches** : ensemble de noeuds
- **Activations** : Les valeurs de la couche cachée après l'application des fonctions d'activation.

</Column>
<Column>

- **Perceptron multicouche (MLP)** : réseau de neurones avec au moins une couche cachée.
- **Réseaux peu profonds (shallow)** : Réseaux avec 1 seule couche cachée.
- **Réseaux profonds (deep)** : Réseaux avec plusieurs couches cachées.

et:
- **Réseaux feedforward** : Réseaux où les connexions forment un graphe acyclique (sans boucles).
- **Réseaux entièrement connectés, dense** : Réseaux où chaque élément d'une couche est connecté à tous les éléments de la couche suivante.

</Column>
</Columns>

---

# Feature engineering

<Columns>
<Column>
Plus besoin de **feature engineering**

**Feature engineering** : transformer / créer des **variables** brutes en caractéristiques informatives pour améliorer les performances d’un modèle de machine learning.

Le réseau trouve lui même la meilleur représentation / transformation des données qui minimise la fonction de coût.

Donc l'étape manuelle de transformation des données basée sur l'expertise domaine du data scientist n'est plus nécessaire

</Column>
<Column>

![feature engineering](/images/dlia/feature_engineering_titanoc_slop.png)



> deep network as a multistage information distillation process, where information goes through successive filters and comes out increasingly purified. **Francois Chollet - Deep Learning with python**

</Column>
</Columns>

---

# Autres avantages des NN vs ML classique


- **Simplicité** : Le deep learning supprime le besoin de feature engineering et simplifie les pipelines
- **Évolutivité** : facilement parallélisable sur les GPU/TPU et peut être entraîné sur des ensembles de données de taille arbitraire (batch).
- **Versatilité et réutilisabilité** : Les modèles d'apprentissage profond peuvent être entraînés sur des données supplémentaires sans recommencer l'intégralité de l'entraînement à zéro (transfer learning)

**Francois Chollet - Deep Learning with python p25**


---

# Playground

[https://playground.tensorflow.org/](https://playground.tensorflow.org/)


![tensorflow playground](/images/dlia/tensorflow_playground.png)

---

# DL au dela de classification / regression

- **embeddings** : On  utilisant les représentations internes => NLP, LLMs
- **transfer learning** : on utilise la dernière couche d'un modèle large pour entraîner un modèle spécialisé sur un dataset petit
- **multi modal representation** : image to caption
- **traduction** : encoder - decoder
- **style transfer**
- **détection d'anomalie** : autoencoder apprends à reconstruire les données d'entrée et produit des erreurs sur de nouvelles données anormales


---

<TitleSlide>

# Les tenseurs

</TitleSlide>

---

# Les tenseurs

- En machine learning classique, on travaille sur des dataframe pandas adaptées aux données tabulaires : dimension = 2
- En deep learning, on utilise des tenseurs

Structure de représentation de données adapté à  tous les types de données

| **Type de donnée** | **Exemple** |
|---|---|
| scalaire – rang 0 | 1 |
| vectoriel – rang 1 | [1, 2, 3, …] |
| matriciel – rang 2 | [[1, 2], [3, 4], [5, 6], …] |
| mais aussi – rang 3, 4, 5, … | [[[1, 2], [3, 4], [5, 6]], [[7, 8], [9, 10], [11]], …] |

---

# le rang d'un tenseur

Pour N échantillons :

| Rang | Exemples |
|---|---|
| rang 2 | données tabulaires : N × P features samples, dataframe, csv, excel |
| rang 3 | images noir et blanc : N images × hauteur × largeur ; séries temporelles : samples, time, value |
|  | - N images × hauteur × largeur ; séries temporelles : samples, time, value |
|  | -  séries temporelles : samples, time, value |
| rang 4 | images couleurs : N images × hauteur × largeur × channel (RGB) |
| rang 5 | vidéo : samples, frames, height, width, channels |


---
# Rang 3 et 4: serie temporelles et images

<Columns>
<Column>

## rang 3

![tenseur de rang 3 pour serie temporelle](/images/dlia/tenseur_rang_3_serie_temporelle.png)

- stock prices
- temperatures

</Column>
<Column>

## rang 4
- trajet de vehicules : longitude, latitude

##  Image

samples, height, width, color_depth (RGB)

![tenseur de rang 4 pour image](/images/dlia/tenseur_rang_4_image.png)

</Column>
</Columns>

---

# Operations

<Columns>
<Column>

On peut faire les opérations classiques sur les tenseurs de la même façon que sur les vecteurs ou matrices

[https://www.tensorflow.org/guide/tensor#basics](https://www.tensorflow.org/guide/tensor#basics)


</Column>
<Column>

```python
import tensorflow as tf

tf.math.add(tensor1, tensor2),
tf.math.subtract(tensor1, tensor2),
tf.math.multiply(tensor1, tensor2),
tf.math.divide(tensor1, tensor2)
tf.math.square(tensor),
tf.math.sqrt(tensor),
tf.math.exp(tensor)
```

</Column>
</Columns>

tenseur avec numpy

```python
import numpy as np

batch_images = np.random.randint(0, 256,
    size=(batch_size, height, width),
    dtype=np.uint8)
```

---
# Keras Flatten

Dans le MLP, le couche Flatten aplatit le tenseur des données en entrée

```python
import tensorflow as tf


# Create a tensor
tensor = tf.constant([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])
# Print the original shape
print("Original shape:", tensor.shape)
# Flatten the tensor using tf.keras.layers.Flatten
flatten_layer = tf.keras.layers.Flatten()
flattened_tensor = flatten_layer(tensor)
# Print the flattened shape
print("Flattened shape:", flattened_tensor.shape)
```

---
# Une autre couche importante dans Keras : softmax

<Columns>
<Column>


La function softmax permet de transformer les valeurs de sortie du réseau en valeurs dans l'intervale [0,1] et donc interpretable comme des probabilités.

Dans un contexte de classification avec N classe, le reseau produit un array de dimension N.

La classe la plus probable est celle avec la plus grande valeur.

Voici un exemple sur un array arbitraire

</Column>
<Column>

```python
# soit un array de taille 4
inputs = np.array([[1.1, 3.3, 4.4, 2.2]])
inputs = tf.convert_to_tensor(inputs)
print(f'input: {inputs.numpy()}')

# appliquer la fonction softmax
outputs = tf.keras.activations.softmax(inputs)
print(f'output: {outputs.numpy()}')

# on verifie que la somme des probabilité est bien 1
sum = tf.reduce_sum(outputs)
print(f'somme des proba: {sum}')

# La categorie la plus probable est
prediction = np.argmax(outputs)
print(f'index categorie la plus probable: {prediction}')
print(f'soit la valeur : {inputs.numpy()[0][prediction]}')
```

</Column>
</Columns>

---

# Pratique sur les tenseurs

quelques opérations sur les tenseurs
- charger une dataframe
- charger des images et les transformer
[les_tenseurs.ipynb](https://colab.research.google.com/github/SkatAI/deeplearning/blob/master/notebooks/les_tenseurs.ipynb)

Pour aller plus loin, le notebook de Tensorflow :
[https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/guide/tensor.ipynb](https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/guide/tensor.ipynb)


---

# Keras sur FMINST

[keras_sequential_fmnist.ipynb](https://colab.research.google.com/github/SkatAI/deeplearning/blob/master/notebooks/keras_sequential_fmnist.ipynb)

le modèle : Sequential
- input(28,28)
- flatten
- dense 128, activation relu
- dense 10, activation softmax


Observer l'influence :
- de l'architecture
- des paramètres
- du solver
- de la fonction d'activation
- performance, overfit ?





---

# CNN / RNN

[Convolutional Neural Networks / Recurrent Neural Networks](/courses/ml2llm/cnn_rnn)
