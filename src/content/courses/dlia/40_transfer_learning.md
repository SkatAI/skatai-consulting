---
layout: slides
title: "RNN"
page_title: "Transfer Learning & Recurrent Neural Networks"
slides_project_home: /courses/dlia/


---

<TitleSlide>

# Transfer learning

> include_top=False
> base_model.trainable = False


</TitleSlide>

---

# On a vu

- Tenseurs
- Keras & Tensorflow
- Fonction d'activation
- Backprop

et plein d'autres choses


---

# Transfer Learning

transfer learning : construire sur la base d'un méga modèle


<img src="/images/dlia/transfert_learning_architecture.webp" width="600">



---

# Changement de paradygme

Le process classique du machine learning
- instancier un modèle vierge (Foret Aleatoire, XGBoost, MLP, CNN, …)
- entraîner le modèle sur des données propriétaires

Nouvelle methode
- charger un large modèle pré-entrainé sur des datasets massifs
- réutiliser le modèle pour l'adapter aux données propriétaires

Ce qui a amené ce changement : la libre mise à disposition des modèles
- [https://www.tensorflow.org/hub](https://www.tensorflow.org/hub)
- [https://huggingface.co](https://huggingface.co) : 700k+ modèles

---
# Transfer Learning vs Fine tuning


**Transfer learning** est le concept général : prendre un modèle entraîné sur une tâche A et l'appliquer à une tâche B. C'est l'idée, la stratégie.

**Fine-tuning** est une technique pour faire du transfer learning.
La vraie distinction se fait entre les techniques de transfer learning :

- **Feature extraction** → couches gelées, on utilise le réseau comme un extracteur de features figé, on entraîne juste la nouvelle tête
- **Fine-tuning** → on dégèle et réentraîne une partie des couches

Donc quand on oppose "transfer learning vs fine-tuning", c'est un abus de langage. On devrait dire "feature extraction vs fine-tuning", les deux étant des formes de transfer learning.

---

# Use cases


<Columns>
<Column>

**Transfer learning  / Feature extraction :**

Prototypage rapide / POC

- Peu de données d'entraînement disponibles (risque d'overfitting si on dégèle tout)
- Tâche cible proche de la tâche d'origine (ex : classifier des chats/chiens avec un modèle pré-entraîné sur ImageNet)
- Ressources de calcul limitées (plus rapide à entraîner)

</Column>
<Column>

**Fine-tuning :**

Adaptation de LLMs à un domaine spécifique (ex : fine-tuner GPT ou LLaMA sur des données juridiques, médicales, etc.)

- Dataset suffisamment large sur la nouvelle tâche
- Tâche cible significativement différente du domaine d'origine (ex : imagerie médicale à partir d'un modèle entraîné sur des photos classiques)
- On veut des performances maximales et on a le **budget GPU** pour ça

</Column>
</Columns>

---

# Geler des couches


- Le principe : on met `layer.trainable = False` sur les couches qu'on veut geler.
- Seules les couches restées `trainable = True` seront mises à jour pendant l'entraînement.

Exemple Keras minimal :

```python
from tensorflow.keras.applications import VGG16
from tensorflow.keras import layers, Model

# Charger VGG16 pré-entraîné, sans la tête de classification
base_model = VGG16(weights='imagenet', include_top=False, input_shape=(224,224,3))

# Geler toutes les couches du modèle de base
for layer in base_model.layers:
    layer.trainable = False

# Ajouter notre propre classifieur
x = layers.Flatten()(base_model.output)
x = layers.Dense(128, activation='relu')(x)
output = layers.Dense(10, activation='softmax')(x)

model = Model(base_model.input, output)
model.compile(optimizer='adam', loss='categorical_crossentropy')
```

---

# Example Transfer Learning

> Contexte: une startup de dermatologie qui veut créer une app pour détecter des mélanomes à partir de photos de grains de beauté.

*Le problème* : ils ont seulement 2 000 images de grains de beauté étiquetées (bénin/malin). C'est beaucoup trop peu pour entraîner un réseau de vision from scratch : il faudrait des centaines de milliers d'images.

La solution : **Le transfer learning** : Ils prennent un ResNet pré-entraîné sur ImageNet (1,4 million d'images de chats, voitures, paysages, etc.). Ce réseau a déjà appris à reconnaître des features visuelles universelles : bords, textures, formes, contrastes, motifs...

- **Étape 1** : Feature extraction : ils gèlent tout ResNet, remplacent la dernière couche par un classifieur binaire (bénin/malin), et entraînent uniquement cette couche sur leurs 2 000 images. Résultat : déjà 85% de précision, en quelques minutes d'entraînement.
- **Étape 2** : Fine-tuning : pas satisfaits, ils dégèlent les 10 dernières couches de ResNet et réentraînent avec un learning rate très faible. Le réseau apprend alors des features spécifiques à la peau : texture cutanée, asymétrie des bords, variations de pigmentation. Résultat : 93% de précision.

Sans transfer learning, avec seulement 2 000 images et un réseau from scratch, ils auraient probablement plafonné à 60-65% avec un overfitting massif.

C'est exactement pour ça que le transfer learning a révolutionné la vision par ordinateur : on ne part plus jamais de zéro.

---

# Learning rate

- Avec un learning rate élevé, les mises à jour des gradients sont grandes → on écrase les poids précieux d'un coup → le réseau "oublie" ce qu'il savait. C'est ce qu'on appelle le **catastrophic forgetting**.

- Avec un learning rate faible, tu fais des petits ajustements progressifs → on garde l'essentiel des features apprises tout en les adaptant doucement à son domaine

---

# Cas usage fine tuning

**Contexte** : un cabinet d'avocats veut détecter les clauses à risque dans des contrats.

**Le problème** : ils reçoivent des centaines de contrats par mois et veulent un modèle qui détecte automatiquement les clauses à risque (clauses abusives, pénalités cachées, ambiguïtés juridiques). Un LLM généraliste comme GPT ou LLaMA comprend bien le français, mais il ne connaît pas les subtilités du droit commercial français.

Un simple **transfer learning** (feature extraction) ne suffit pas ici : le langage juridique est tellement spécifique (formulations latines, tournures archaïques, vocabulaire technique) que les couches profondes du modèle doivent elles aussi s'adapter. Un simple classifieur greffé à la fin ne capte pas ces nuances.

- Prend [CamemBERT](https://arxiv.org/abs/1911.03894) (pré-entraîné sur du français général)
- Dégèle les couches du transformer, réentraîne sur 50 000 clauses annotées
- Le modèle apprend les subtilités du langage juridique en profondeur
- Résultat : le modèle "pense comme un juriste", détecte des patterns invisibles en surface

---

Le **fine-tuning est plus coûteux**, car :

- Plus de paramètres à mettre à jour à chaque étape de backpropagation (couches dégelées)
- Plus de mémoire GPU nécessaire (il faut stocker les gradients de toutes les couches dégelées)
- Plus d'époques souvent nécessaires pour converger proprement
- Learning rate est délicat à régler (trop haut → on détruit les poids pré-entraînés, trop bas → ça converge pas)

Le **transfer learning** est bien plus léger : on n'entraîne que la tête de classification, donc c'est quasi comme entraîner un petit réseau classique.

Ordre de grandeur typique : pour un modèle comme VGG16,
- le transfer learning entraîne ~500K paramètres
- vs ~138M pour un fine-tuning complet

soit un facteur ~300x de différence.

---

Quelques cas où le transfer learning ne marche pas bien :

**1. Domaines trop éloignés : Negative transfer**

Un modèle entraîné sur ImageNet (photos naturelles) appliqué à des images satellite radar ou des spectrogrammes audio. Les features apprises (textures, formes d'objets) ne sont pas pertinentes. Le modèle transfère du bruit plutôt que du signal utile.

**2. Données de nature très différente**

Un modèle NLP entraîné sur du texte Wikipedia appliqué à du code source, des séquences ADN ou des logs serveur. Les embeddings pré-appris n'ont aucune valeur pour ces structures.

**3. Biais hérités du modèle source**

On hérite des biais du dataset d'origine. Un modèle de vision entraîné majoritairement sur des peaux claires performera mal en dermatologie sur des peaux foncées. Le transfer learning propage et parfois amplifie ces biais.

**4. Tâche cible trop simple**
Si la tâche est triviale (classifier 2 catégories très distinctes avec peu d'images), un modèle classique ou du feature engineering suffit. Le transfer learning apporte une complexité inutile.

**5. Architecture incompatible**
On ne peut pas transférer efficacement les poids d'un CNN vers un problème séquentiel (séries temporelles longues). L'architecture source doit correspondre à la structure du problème cible.

> Le transfer learning fonctionne quand les features du modèle source sont pertinentes et réutilisables pour la tâche cible. Sinon, on transfère du bruit et c'est pire que de partir de zéro.

---

Excellent article

https://neptune.ai/blog/transfer-learning-guide-examples-for-images-and-text-in-keras

---

# Transfer Learning en 6 étapes

*Source : [Neptune.ai – Transfer Learning Guide](https://neptune.ai/blog/transfer-learning-guide-examples-for-images-and-text-in-keras)*

---

## Étape 1 : Obtenir un modèle pré-entraîné

On choisit un modèle déjà entraîné sur un large dataset (ImageNet, GloVe, etc.).

Les sources principales :
- **Keras Applications** : ResNet, VGG, Xception, MobileNet…
- **TensorFlow Hub** : modèles prêts à l'emploi
- **Hugging Face** : modèles NLP (BERT, CamemBERT, GPT…)
- **Embeddings pré-entraînés** : GloVe, Word2Vec, FastText

Le modèle apporte des **features génériques** apprises sur des millions d'exemples.

---

## Étape 2 : Créer le modèle de base

On instancie l'architecture choisie **avec ses poids pré-entraînés**, mais **sans la couche de sortie finale** (`include_top=False`).

```python
base_model = keras.applications.Xception(
    weights='imagenet',
    input_shape=(150, 150, 3),
    include_top=False)
```

On retire la dernière couche car elle est spécifique au dataset d'origine (ex : 1000 classes ImageNet). Elle sera remplacée par une couche adaptée à notre problème.

---

## Étape 3 : Geler les couches

On gèle toutes les couches du modèle de base pour **préserver les poids pré-entraînés**.

```python
base_model.trainable = False
```

Sans cette étape, les poids seraient réinitialisés pendant l'entraînement. On perdrait tout le bénéfice du transfer learning.

Point important : les couches de **BatchNormalization** doivent aussi être gelées, sinon leurs statistiques (moyenne, variance) seront mises à jour et dégraderont les performances.

---

## Rappel : Batch Normalization

**À quoi ça sert ?** :

Au fil de l'entraînement, les poids changent → les valeurs de sortie de chaque couche (les *activations*) dérivent.

La couche suivante reçoit des entrées de plus en plus instables et doit constamment se réadapter (*internal covariate shift*).

La BatchNorm recentre ces activations (moyenne ≈ 0, écart-type ≈ 1) à chaque couche → entrées stables, convergence plus rapide.

> La **Batch Normalization** normalise les activations de chaque couche sur le mini-batch en cours :

$$\hat{x}_i = \frac{x_i - \mu_B}{\sqrt{\sigma_B^2 + \epsilon}}$$

- $\mu_B$ et $\sigma_B^2$ : moyenne et variance calculées sur le mini-batch
- Pendant l'**entraînement** : ces stats sont recalculées à chaque batch, et le modèle maintient une **moyenne glissante** (running mean/variance)
- Pendant l'**inférence** : on utilise la moyenne glissante accumulée pendant l'entraînement

---

**Pourquoi geler BatchNorm en transfer learning ?**

Si on laisse `trainable=True`, les stats glissantes se mettent à jour avec nos nouvelles données, qui ont une distribution différente d'ImageNet. Les couches gelées en amont reçoivent alors des entrées renormalisées de façon incohérente → les features pré-apprises sont corrompues.

```python
# Geler explicitement les couches BatchNorm
for layer in base_model.layers:
    if isinstance(layer, tf.keras.layers.BatchNormalization):
        layer.trainable = False
```

---

## Étape 4 : Ajouter de nouvelles couches entraînables

On greffe de nouvelles couches au-dessus du modèle gelé pour adapter la sortie à notre problème.

```python
x = base_model(inputs, training=False)
x = keras.layers.GlobalAveragePooling2D()(x)
x = keras.layers.Dropout(0.2)(x)
outputs = keras.layers.Dense(1)(x)  # 1 sortie = classification binaire
model = keras.Model(inputs, outputs)
```

Ces nouvelles couches sont les **seules qui seront entraînées**. Elles transforment les features extraites par le modèle de base en prédictions adaptées à notre tâche.

---

## Étape 5 : Entraîner les nouvelles couches

On compile et entraîne le modèle. Seules les couches ajoutées à l'étape 4 sont mises à jour.

```python
model.compile(optimizer='adam',
              loss=BinaryCrossentropy(from_logits=True),
              metrics=[BinaryAccuracy()])
model.fit(training_set, epochs=20, validation_data=val_dataset)
```

L'entraînement est **rapide** car très peu de paramètres sont concernés. La validation accuracy démarre déjà haut grâce aux features pré-apprises.

C'est l'étape de **feature extraction** : souvent suffisante pour obtenir de bons résultats.

---

## Étape 6 : Améliorer par fine-tuning (optionnel)

On dégèle tout ou partie du modèle de base et on réentraîne l'ensemble avec un **learning rate très faible**.

```python
base_model.trainable = True

model.compile(optimizer=keras.optimizers.Adam(1e-5),
              loss=BinaryCrossentropy(from_logits=True),
              metrics=[BinaryAccuracy()])

model.fit(training_set, epochs=15,
          validation_data=val_dataset,
          callbacks=[EarlyStopping(patience=5)])
```

Points clés :
- **Learning rate faible** (ex : `1e-5`) pour ne pas écraser les poids existants
- **Recompiler** obligatoirement après avoir changé `trainable`
- **EarlyStopping** pour éviter l'overfitting
- Cette étape apporte un gain de performance supplémentaire, mais augmente le risque d'overfitting

---

## sources de modèles pré-entraînés mentionnées :

**1. Keras Applications** : Plus de 20 modèles de vision (ResNet, VGG, Xception, MobileNet…).

```python
model = tf.keras.applications.MobileNet(
    weights="imagenet",
    include_top=True,
    classes=1000
)
```

Les poids sont téléchargés automatiquement et stockés dans `~/.keras/models/`.

---

**2. TensorFlow Hub** : Des modèles prêts à intégrer directement dans un `Sequential`.

```python
model = tf.keras.Sequential([
    hub.KerasLayer("https://tfhub.dev/google/imagenet/mobilenet_v2.../feature_vector/4",
                   trainable=False),
    tf.keras.layers.Dense(num_classes, activation='softmax')
])
```

---

**3. Hugging Face** : Des milliers de modèles
- NLP (question answering, summarization, traduction, génération de texte…) dans plus de 100 langues.
- Vision : classification d'images, détection d'objets, segmentation (ViT, DETR, SAM…)
- Audio : reconnaissance vocale, classification audio (Whisper, Wav2Vec2…)
vMultimodal : texte + image (CLIP, BLIP, LLaVA…)
- Vidéo : classification, génération
- Tabular : données structurées
- Génération d'images : Stable Diffusion, etc.

```python
from transformers import pipeline
classifier = pipeline('sentiment-analysis')
```

---

# Pratique

Demo transfer Learning : [transfer_learning_inception_fr.ipynb](https://github.com/SkatAI/deeplearning/blob/master/notebooks/transfer_learning_inception_fr.ipynb)

Atelier : [transfer_learning_hands_on_claude_flowers.ipynb](https://github.com/SkatAI/deeplearning/blob/master/notebooks/transfer_learning_hands_on_claude_flowers.ipynb)


---

# DeepDream

[deep_dream_claude.ipynb](https://github.com/SkatAI/deeplearning/blob/master/notebooks/deep_dream_claude.ipynb)
