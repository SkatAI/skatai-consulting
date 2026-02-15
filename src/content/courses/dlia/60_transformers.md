---
layout: slides
title: "Tranformers"
page_title: "Transformers"
slides_project_home: /courses/dlia/
---

<TitleSlide>

# Des Séquences aux Transformers
## Attention, Self-Attention (l'architecture qui a tout changé)

</TitleSlide>

---

## Plan du cours

Ce cours se décompose en trois grandes parties.

- Les modèles **séquence-à-séquence (seq2seq)** fondés sur les RNN, en comprenant pourquoi ils atteignent leurs limites sur les longues séquences.
- Le **mécanisme d'attention** de Bahdanau, qui permet au décodeur de "regarder en arrière" vers l'encodeur.
- L'architecture **Transformer**, qui abandonne complètement la récurrence au profit de l'attention — et qui est à la base de tous les grands modèles de langage actuels (GPT, BERT, LLaMA, etc.).

Crédits visuels : les illustrations de ce cours sont adaptées des posts de Jay Alammar, *"Visualizing Seq2seq with Attention"* et *"The Illustrated Transformer"*.

---

<TitleSlide>

# Partie 1
## Seq2Seq et le goulot d'étranglement / bottleneck

</TitleSlide>

---

## Le modèle Seq2Seq

Un modèle **seq2seq**
- input: une séquence d'entrée (par exemple une phrase en français)
- output: une séquence de sortie (sa traduction en anglais).

L'architecture repose sur deux composants : un **encodeur** qui lit l'entrée mot par mot et compresse l'information dans un vecteur, et un **décodeur** qui génère la sortie à partir de ce vecteur.

L'encodeur est un RNN (souvent un LSTM ou GRU).

À chaque pas de temps, il reçoit le **word embedding** du mot courant et son état caché précédent, et produit un nouvel état caché.

Le dernier état caché constitue le **vecteur de contexte** — la seule information transmise au décodeur.

> 📌 **IMAGE** : Schéma animé d'un encodeur-décodeur seq2seq. L'encodeur traite "je suis étudiant" mot par mot, produit un vecteur de contexte, puis le décodeur génère "I am a student". *(Alammar: seq2seq_5.mp4 / seq2seq_6.mp4)*

---

## Rappel : le RNN pas à pas

<Columns>
<Column>

À chaque pas de temps $t$, un RNN calcule :

$$h_t = f(W_h \cdot h_{t-1} + W_x \cdot x_t + b)$$

où $x_t$ est l'embedding du mot courant et $h_{t-1}$ l'état caché précédent.

- La fonction $f$ est typiquement une tangente hyperbolique ou, dans le cas du LSTM, un mécanisme de portes (forget, input, output) qui contrôle le flux d'information.

Le problème fondamental : toute l'information de la phrase d'entrée doit passer par un unique vecteur $h_T$ de taille fixe (256, 512, ou 1024 dimensions).

</Column>
<Column>

```python
import keras
from keras import layers

# Encodeur LSTM simple
encoder_input = layers.Input(shape=(None, embedding_dim))
encoder_lstm = layers.LSTM(256, return_state=True)
_, state_h, state_c = encoder_lstm(encoder_input)

# state_h = le fameux vecteur de contexte
encoder_states = [state_h, state_c]
```

Ce `state_h` de 256 dimensions doit résumer une phrase entière — qu'elle fasse 5 ou 50 mots.

</Column>
</Columns>

---

## Le goulot d'étranglement du contexte fixe

Imaginez qu'on vous demande de traduire un paragraphe entier, mais que vous n'avez le droit de prendre qu'une seule note de taille fixe entre la lecture et l'écriture. Pour des phrases courtes, ça fonctionne. Pour des phrases longues, l'information se dégrade.

C'est exactement ce qui se passe avec le vecteur de contexte. Les expériences montrent une chute significative de la qualité de traduction au-delà de 20-30 mots. Les premiers mots de la phrase sont progressivement "oubliés" au profit des derniers — c'est le problème classique du **vanishing gradient** appliqué aux séquences longues, même avec des LSTM.

> 📌 **IMAGE** : Graphique montrant la dégradation du score BLEU en fonction de la longueur de la phrase d'entrée pour un modèle seq2seq sans attention. *(Référence : Bahdanau et al., 2014, Figure 2)*

---

## Seq2Seq complet en Keras

```python
from keras import layers, Model
import numpy as np

# Hyperparamètres
vocab_size_src = 10000
vocab_size_tgt = 8000
embedding_dim = 256
hidden_dim = 512

# --- ENCODEUR ---
enc_input = layers.Input(shape=(None,), name="encoder_input")
enc_emb = layers.Embedding(vocab_size_src, embedding_dim)(enc_input)
_, enc_h, enc_c = layers.LSTM(hidden_dim, return_state=True)(enc_emb)

# --- DÉCODEUR ---
dec_input = layers.Input(shape=(None,), name="decoder_input")
dec_emb = layers.Embedding(vocab_size_tgt, embedding_dim)(dec_input)
dec_lstm = layers.LSTM(hidden_dim, return_sequences=True, return_state=True)
dec_output, _, _ = dec_lstm(dec_emb, initial_state=[enc_h, enc_c])

# Couche de sortie : probabilité sur le vocabulaire cible
output = layers.Dense(vocab_size_tgt, activation="softmax")(dec_output)

model = Model([enc_input, dec_input], output)
model.compile(optimizer="adam", loss="sparse_categorical_crossentropy")
```

Notez le `initial_state=[enc_h, enc_c]` : c'est le seul lien entre l'encodeur et le décodeur. Toute la phrase source est compressée dans ces deux vecteurs.

---

<TitleSlide>

# Partie 2
## Le mécanisme d'Attention

</TitleSlide>

---

## L'idée clé de l'attention

En 2014, Bahdanau et al. proposent une solution élégante au goulot d'étranglement : plutôt que de forcer toute l'information à passer par un seul vecteur, **le décodeur peut regarder tous les états cachés de l'encodeur** à chaque étape de génération.

L'analogie est simple. Au lieu de prendre une seule note résumant tout le texte, vous gardez le texte source sous les yeux et vous pouvez y jeter un coup d'œil à chaque mot que vous traduisez. Naturellement, votre regard se porte sur les parties pertinentes du texte — c'est exactement ce que fait l'attention.

> 📌 **IMAGE** : Schéma montrant l'encodeur qui transmet *tous* ses états cachés (h₁, h₂, ..., hₙ) au décodeur, au lieu d'un seul vecteur de contexte. *(Alammar: seq2seq_7.mp4)*

---

## Attention : le calcul étape par étape

<Columns>
<Column>

À chaque pas de décodage $t$, on calcule un **vecteur de contexte** $c_t$ spécifique :

**1. Score** — On mesure la pertinence de chaque état caché de l'encodeur $h_i^{enc}$ par rapport à l'état courant du décodeur $s_t$ :

$$e_{t,i} = \text{score}(s_t, h_i^{enc})$$

**2. Normalisation** — On transforme les scores en poids via softmax :

$$\alpha_{t,i} = \frac{\exp(e_{t,i})}{\sum_j \exp(e_{t,j})}$$

**3. Contexte** — On calcule la somme pondérée :

$$c_t = \sum_i \alpha_{t,i} \cdot h_i^{enc}$$

</Column>
<Column>

Les $\alpha_{t,i}$ forment une distribution de probabilité sur les mots source. En traduction français→anglais, quand le décodeur génère "student", les poids d'attention seront élevés sur "étudiant" et faibles sur les autres mots.

Le score peut être calculé de différentes façons :

| Variante | Formule |
|----------|---------|
| Dot product | $s_t^\top h_i$ |
| Général (Luong) | $s_t^\top W_a h_i$ |
| Additif (Bahdanau) | $v_a^\top \tanh(W_1 s_t + W_2 h_i)$ |

</Column>
</Columns>

---

## Visualiser l'alignement

Quand on affiche la matrice d'attention $\alpha$ pour une paire de phrases, on obtient une **matrice d'alignement** qui montre quels mots source contribuent à chaque mot cible.

Un résultat remarquable : le modèle apprend seul l'alignement entre les langues. Par exemple, pour "la zone économique européenne" → "the European Economic Area", l'attention apprend automatiquement l'inversion de l'ordre des adjectifs entre le français et l'anglais.

> 📌 **IMAGE** : Matrice d'alignement (heatmap) pour la traduction d'une phrase français→anglais, montrant comment les mots se correspondent. On voit clairement l'inversion de l'ordre pour "zone économique européenne" → "European Economic Area". *(Alammar: attention_sentence.png)*

---

## Attention avec Keras

```python
from keras import layers, Model

hidden_dim = 512

# --- ENCODEUR avec return_sequences ---
enc_input = layers.Input(shape=(None,), name="encoder_input")
enc_emb = layers.Embedding(vocab_size_src, embedding_dim)(enc_input)
enc_outputs, enc_h, enc_c = layers.LSTM(
    hidden_dim, return_sequences=True, return_state=True  # return_sequences=True !
)(enc_emb)

# --- DÉCODEUR ---
dec_input = layers.Input(shape=(None,), name="decoder_input")
dec_emb = layers.Embedding(vocab_size_tgt, embedding_dim)(dec_input)
dec_outputs, _, _ = layers.LSTM(
    hidden_dim, return_sequences=True, return_state=True
)(dec_emb, initial_state=[enc_h, enc_c])

# --- ATTENTION (Luong dot-product) ---
# scores : (batch, dec_len, enc_len)
attention_scores = layers.Dot(axes=[2, 2])([dec_outputs, enc_outputs])
attention_weights = layers.Activation("softmax")(attention_scores)

# contexte : (batch, dec_len, hidden_dim)
context = layers.Dot(axes=[2, 1])([attention_weights, enc_outputs])

# concaténation et projection
concat = layers.Concatenate()([dec_outputs, context])
output = layers.Dense(hidden_dim, activation="tanh")(concat)
output = layers.Dense(vocab_size_tgt, activation="softmax")(output)

model = Model([enc_input, dec_input], output)
```

La différence clé avec le modèle précédent : `return_sequences=True` sur l'encodeur. On garde maintenant *tous* les états cachés, pas seulement le dernier.

---

## Ce que l'attention a changé — et ses limites

L'attention a résolu le goulot d'étranglement et amélioré considérablement la traduction automatique, surtout sur les phrases longues. Mais le modèle reste fondamentalement **séquentiel** : l'encodeur RNN doit traiter les mots un par un, dans l'ordre. Impossible de paralléliser le calcul. Sur un GPU moderne avec des milliers de cœurs, c'est un gâchis monumental.

De plus, même avec des LSTM et l'attention, l'information sur les dépendances à très longue distance reste fragile. Le RNN doit propager les gradients à travers de nombreux pas de temps.

En 2017, l'équipe de Google Brain pose une question audacieuse dans un article au titre provocateur : et si on se débarrassait complètement de la récurrence ?

---

<TitleSlide>

# Partie 3
## Le Transformer
### "Attention Is All You Need"
Vaswani et al., 2017

</TitleSlide>

---

## Vue d'ensemble du Transformer

<Columns>
<Column>

Le Transformer conserve l'architecture encodeur-décodeur, mais remplace entièrement les RNN par des couches d'**attention**. L'article original empile 6 encodeurs et 6 décodeurs.

Chaque bloc **encodeur** contient deux sous-couches :
— une couche de **self-attention** multi-têtes
— un réseau **feed-forward** position par position

Chaque bloc **décodeur** contient trois sous-couches :
— une couche de **self-attention masquée**
— une couche d'**attention croisée** (encoder-decoder)
— un réseau **feed-forward**

Chaque sous-couche est entourée d'une **connexion résiduelle** et d'une **normalisation de couche**.

</Column>
<Column>

> 📌 **IMAGE** : Architecture complète du Transformer. À gauche, la pile de 6 encodeurs. À droite, la pile de 6 décodeurs. Montrer les connexions entre le dernier encodeur et chaque décodeur (K, V envoyés à l'attention croisée). *(Alammar: The_transformer_encoders_decoders.png + The_transformer_encoder_decoder_stack.png)*

</Column>
</Columns>

---

## Pourquoi abandonner les RNN ?

Le Transformer traite **tous les mots en parallèle**. Là où un LSTM avec une phrase de 50 mots nécessite 50 étapes séquentielles, le Transformer n'en fait qu'une seule passe matricielle. En pratique, le temps d'entraînement est divisé par un facteur significatif.

Mais comment le modèle peut-il capturer les relations entre les mots s'il les traite tous en même temps ? C'est ici qu'intervient la **self-attention** : chaque mot peut "regarder" tous les autres mots de la séquence en une seule opération. Le mot "it" dans *"The animal didn't cross the street because it was too tired"* peut directement s'associer au mot "animal", sans avoir à propager l'information à travers une chaîne de states cachés.

> 📌 **IMAGE** : Visualisation de la self-attention sur la phrase "The animal didn't cross the street because it was too tired". Des lignes colorées relient "it" aux mots auxquels il prête attention, avec "animal" fortement pondéré. *(Alammar: transformer_self-attention_visualization.png)*

---

## Self-Attention : l'intuition Query-Key-Value

L'idée centrale est une analogie avec un système de recherche d'information. Pour chaque mot de la séquence, on crée trois vecteurs :

**Query (Q)** — "Que cherche ce mot ?" C'est la question que pose le mot courant.

**Key (K)** — "Qu'est-ce que ce mot offre comme information ?" C'est l'étiquette que porte chaque mot.

**Value (V)** — "Quelle information ce mot transporte réellement ?" C'est le contenu.

Le score d'attention entre deux mots est le produit scalaire entre la Query de l'un et la Key de l'autre. Ce score mesure la compatibilité : à quel point ce que je cherche correspond à ce que l'autre offre. Les scores sont ensuite normalisés par softmax pour obtenir des poids, et la sortie est une somme pondérée des Values.

C'est comme un moteur de recherche interne à la phrase : chaque mot lance une requête et récupère les informations pertinentes des autres mots.

---

## Self-Attention : le calcul vectoriel

<Columns>
<Column>

Pour un mot $x_i$ avec son embedding (ou sa représentation venant de la couche précédente), on projette vers Q, K, V via des matrices de poids apprises :

$$q_i = x_i \cdot W^Q, \quad k_i = x_i \cdot W^K, \quad v_i = x_i \cdot W^V$$

L'embedding a une dimension $d_{model} = 512$. Les vecteurs Q, K, V ont une dimension $d_k = 64$ (on verra pourquoi avec le multi-head).

Le **score** entre le mot $i$ (query) et le mot $j$ (key) :

$$\text{score}_{ij} = q_i \cdot k_j^\top$$

</Column>
<Column>

On divise par $\sqrt{d_k}$ pour stabiliser les gradients :

$$\text{score}_{ij}^{scaled} = \frac{q_i \cdot k_j^\top}{\sqrt{d_k}}$$

Pourquoi $\sqrt{d_k}$ ? Quand $d_k$ est grand, les produits scalaires deviennent grands en magnitude, ce qui pousse le softmax dans ses zones saturées (gradients quasi-nuls). Diviser par $\sqrt{d_k}$ ramène la variance des scores à 1.

Après softmax et pondération des values :

$$z_i = \sum_j \text{softmax}(\text{score}_{ij}^{scaled}) \cdot v_j$$

</Column>
</Columns>

> 📌 **IMAGE** : Schéma pas-à-pas du calcul de self-attention pour le mot "Thinking" : q₁·k₁, q₁·k₂, division par √64, softmax, puis pondération des values et somme. *(Alammar: transformer_self_attention_score.png + self-attention_softmax.png + self-attention-output.png)*

---

## Self-Attention : la formule matricielle

En pratique, on ne calcule pas mot par mot. On empile tous les embeddings dans une matrice $X$ de taille $(n \times d_{model})$ et on calcule tout en une seule opération :

$$Q = X \cdot W^Q, \quad K = X \cdot W^K, \quad V = X \cdot W^V$$

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{Q \cdot K^\top}{\sqrt{d_k}}\right) \cdot V$$

La matrice $Q \cdot K^\top$ a une taille $(n \times n)$ — chaque élément $(i,j)$ mesure à quel point le mot $i$ doit prêter attention au mot $j$. Après softmax (ligne par ligne), on multiplie par $V$ pour obtenir les nouvelles représentations.

> 📌 **IMAGE** : Calcul matriciel de l'attention. Montrer X → (Q, K, V) via les matrices de poids, puis le produit QKᵀ, la division, le softmax, et la multiplication par V. *(Alammar: self-attention-matrix-calculation.png + self-attention-matrix-calculation-2.png)*

---

## Implémentation NumPy de la self-attention

```python
import numpy as np

def self_attention(X, W_q, W_k, W_v):
    """
    X     : (seq_len, d_model) — embeddings de la séquence
    W_q/k/v : (d_model, d_k) — matrices de projection
    """
    Q = X @ W_q  # (seq_len, d_k)
    K = X @ W_k
    V = X @ W_v

    d_k = Q.shape[-1]

    # Scores : (seq_len, seq_len)
    scores = Q @ K.T / np.sqrt(d_k)

    # Softmax ligne par ligne
    exp_scores = np.exp(scores - scores.max(axis=-1, keepdims=True))
    weights = exp_scores / exp_scores.sum(axis=-1, keepdims=True)

    # Sortie : somme pondérée des values
    output = weights @ V  # (seq_len, d_k)
    return output, weights

# Exemple avec 4 mots, d_model=8, d_k=4
np.random.seed(42)
X = np.random.randn(4, 8)
W_q = np.random.randn(8, 4) * 0.1
W_k = np.random.randn(8, 4) * 0.1
W_v = np.random.randn(8, 4) * 0.1

out, attn = self_attention(X, W_q, W_k, W_v)
print("Poids d'attention:\n", np.round(attn, 3))
```

Observez que `weights` est une matrice $(n \times n)$ dont chaque ligne somme à 1. C'est la "carte d'attention" qui montre qui regarde qui.

---

## Multi-Head Attention : pourquoi plusieurs têtes ?

Une seule tête d'attention ne capture qu'un seul "type" de relation. Mais dans une phrase, les relations sont multiples : syntaxiques, sémantiques, coréférentielles. Le Transformer utilise **8 têtes d'attention en parallèle**, chacune avec ses propres matrices $W^Q_i, W^K_i, W^V_i$.

<Columns>
<Column>

Chaque tête opère dans un sous-espace de dimension $d_k = d_{model}/h = 512/8 = 64$. Les 8 sorties sont concaténées puis projetées :

$$\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, ..., \text{head}_8) \cdot W^O$$

où chaque $\text{head}_i = \text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)$

La matrice $W^O$ a une taille $(8 \times 64, 512) = (512, 512)$, ramenant la sortie à la dimension $d_{model}$.

</Column>
<Column>

> 📌 **IMAGE** : Schéma du multi-head attention. 8 "têtes" parallèles produisent chacune une matrice Z de taille (n, 64). On les concatène en (n, 512) puis on multiplie par Wᴼ. *(Alammar: transformer_attention_heads_z.png + transformer_attention_heads_weight_matrix_o.png)*

Le coût total est comparable à une seule tête de dimension 512, puisque $8 \times 64 = 512$. On ne paye pas plus cher, mais on obtient 8 "points de vue" différents sur la séquence.

</Column>
</Columns>

---

## Multi-Head en Keras

```python
from keras import layers

# Keras fournit une couche MultiHeadAttention prête à l'emploi
mha = layers.MultiHeadAttention(
    num_heads=8,
    key_dim=64,       # d_k par tête
    value_dim=64,     # d_v par tête (souvent = d_k)
)

# Pour de la self-attention : query = key = value = même séquence
# x shape: (batch_size, seq_len, d_model=512)
attention_output = mha(query=x, key=x, value=x)  # (batch, seq_len, 512)

# Avec un masque causal (pour le décodeur) :
attention_output = mha(
    query=x, key=x, value=x,
    use_causal_mask=True  # masque les positions futures
)
```

La couche `MultiHeadAttention` de Keras encapsule toute la logique : projections Q/K/V, split en têtes, scaled dot-product, concaténation, projection de sortie. En une ligne, vous avez le cœur du Transformer.

---

## Encodage positionnel : donner le sens de l'ordre

<Columns>
<Column>

Le Transformer traite tous les mots simultanément — il n'a donc aucune notion d'ordre. Les phrases "le chat mange la souris" et "la souris mange le chat" produiraient la même représentation sans mécanisme supplémentaire.

La solution : ajouter un **vecteur de position** à chaque embedding avant de l'envoyer dans l'encodeur. L'article original utilise des fonctions sinusoïdales :

$$PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d_{model}}}\right)$$

$$PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d_{model}}}\right)$$

Chaque dimension du vecteur oscille à une fréquence différente, créant un "code" unique pour chaque position.

</Column>
<Column>

> 📌 **IMAGE** : Heatmap des encodages positionnels. En ligne : la position (0 à 50+). En colonne : les dimensions (0 à 511). On voit les sinusoïdes de fréquences croissantes — la moitié gauche (sinus) et droite (cosinus). *(Alammar: transformer_positional_encoding_large_example.png)*

Un avantage clé : le modèle peut **généraliser à des séquences plus longues** que celles vues à l'entraînement, car les fonctions sinusoïdales sont définies pour toute position.

</Column>
</Columns>

---

## Encodage positionnel en code

```python
import numpy as np

def positional_encoding(max_len, d_model):
    """Génère la matrice d'encodage positionnel (max_len, d_model)."""
    pe = np.zeros((max_len, d_model))
    position = np.arange(max_len)[:, np.newaxis]       # (max_len, 1)
    div_term = 10000 ** (np.arange(0, d_model, 2) / d_model)  # (d_model/2,)

    pe[:, 0::2] = np.sin(position / div_term)  # dimensions paires
    pe[:, 1::2] = np.cos(position / div_term)  # dimensions impaires
    return pe

pe = positional_encoding(100, 512)
print(pe.shape)  # (100, 512)
# pe[0] = position 0, pe[1] = position 1, etc.
```

En Keras, on peut l'intégrer comme une couche personnalisée ou simplement l'ajouter au tensor d'embeddings :

```python
class TransformerEmbedding(layers.Layer):
    def __init__(self, vocab_size, d_model, max_len=5000):
        super().__init__()
        self.embedding = layers.Embedding(vocab_size, d_model)
        self.pe = positional_encoding(max_len, d_model).astype("float32")
        self.d_model = d_model

    def call(self, x):
        seq_len = x.shape[1]
        # On multiplie l'embedding par √d_model (convention du papier)
        return self.embedding(x) * np.sqrt(self.d_model) + self.pe[:seq_len]
```

---

## Connexions résiduelles et normalisation

Chaque sous-couche du Transformer (self-attention, feed-forward) est enveloppée dans un schéma **Add & Norm** :

$$\text{output} = \text{LayerNorm}(x + \text{SubLayer}(x))$$

<Columns>
<Column>

La **connexion résiduelle** ($x + \text{SubLayer}(x)$) permet aux gradients de circuler directement à travers les couches, facilitant l'entraînement de réseaux profonds. C'est la même idée que dans ResNet.

La **normalisation de couche** stabilise les activations en normalisant sur la dimension des features (contrairement au batch norm qui normalise sur la dimension du batch). Pour chaque vecteur, on centre et réduit, puis on applique un scale/shift appris.

</Column>
<Column>

> 📌 **IMAGE** : Schéma d'un bloc encodeur montrant le flux : Input → Self-Attention → Add & Norm → Feed-Forward → Add & Norm → Output. Avec des flèches de skip connection. *(Alammar: transformer_resideual_layer_norm_2.png)*

</Column>
</Columns>

---

## Le réseau Feed-Forward

Après la self-attention, chaque position passe indépendamment par le même réseau feed-forward à deux couches :

$$\text{FFN}(x) = \text{ReLU}(x \cdot W_1 + b_1) \cdot W_2 + b_2$$

La dimension intérieure est $d_{ff} = 2048$, soit 4× la taille de $d_{model} = 512$. C'est dans cette couche que le modèle effectue la "réflexion" sur les informations agrégées par l'attention. On peut l'interpréter comme une mémoire associative position par position.

```python
def feed_forward_block(d_model=512, d_ff=2048):
    return keras.Sequential([
        layers.Dense(d_ff, activation="relu"),   # expansion 512 → 2048
        layers.Dense(d_model),                    # compression 2048 → 512
    ])
```

Un point important : ce réseau est appliqué **identiquement et indépendamment** à chaque position. Il n'y a pas d'interaction entre positions ici — toute l'interaction inter-mots se fait dans la couche d'attention.

---

## Un bloc encodeur complet

```python
class TransformerEncoderBlock(layers.Layer):
    def __init__(self, d_model=512, num_heads=8, d_ff=2048, dropout_rate=0.1):
        super().__init__()
        self.mha = layers.MultiHeadAttention(
            num_heads=num_heads, key_dim=d_model // num_heads
        )
        self.ffn = keras.Sequential([
            layers.Dense(d_ff, activation="relu"),
            layers.Dense(d_model),
        ])
        self.norm1 = layers.LayerNormalization()
        self.norm2 = layers.LayerNormalization()
        self.dropout1 = layers.Dropout(dropout_rate)
        self.dropout2 = layers.Dropout(dropout_rate)

    def call(self, x, training=False):
        # Self-attention + résidu + norm
        attn_output = self.mha(query=x, key=x, value=x)
        attn_output = self.dropout1(attn_output, training=training)
        x = self.norm1(x + attn_output)

        # Feed-forward + résidu + norm
        ffn_output = self.ffn(x)
        ffn_output = self.dropout2(ffn_output, training=training)
        x = self.norm2(x + ffn_output)

        return x
```

On empile 6 de ces blocs pour former l'encodeur complet. Chaque bloc raffine les représentations : les couches basses capturent les relations locales (syntaxe), les couches hautes les relations globales (sémantique).

---

<TitleSlide>

# Le décodeur
## Masked Self-Attention et Attention Croisée

</TitleSlide>

---

## Le décodeur : trois sous-couches

Le décodeur est plus complexe que l'encodeur car il ajoute une couche et un mécanisme de masquage. Ses trois sous-couches sont :

**1. Self-attention masquée** — Le décodeur ne doit pas "tricher" en regardant les mots futurs. Quand il génère le 3e mot, il ne peut voir que les mots 1 et 2. On applique un masque triangulaire qui met $-\infty$ aux positions futures avant le softmax, ce qui produit des poids d'attention nuls pour ces positions.

**2. Attention croisée (encoder-decoder)** — Les Queries viennent du décodeur, mais les Keys et Values viennent de la sortie de l'encodeur. C'est l'équivalent de l'attention de Bahdanau, mais sans récurrence. Le décodeur "interroge" les représentations de la phrase source.

**3. Feed-Forward** — Identique à celui de l'encodeur.

> 📌 **IMAGE** : Architecture du décodeur montrant les 3 sous-couches empilées. Attention particulière sur les flèches K, V qui viennent de l'encodeur vers la couche d'attention croisée. *(Alammar: Transformer_decoder.png + transformer_decoding_1.gif)*

---

## Le masque causal en détail

<Columns>
<Column>

Sans masque, la self-attention voit toute la séquence — passé et futur. Or à l'inférence, les mots futurs n'existent pas encore. Pour assurer la cohérence entre entraînement et inférence, on masque les positions futures :

$$\text{Mask} = \begin{pmatrix} 0 & -\infty & -\infty & -\infty \\ 0 & 0 & -\infty & -\infty \\ 0 & 0 & 0 & -\infty \\ 0 & 0 & 0 & 0 \end{pmatrix}$$

On ajoute ce masque aux scores avant le softmax. Les $-\infty$ deviennent des 0 après softmax → les mots futurs sont invisibles.

</Column>
<Column>

```python
import numpy as np

def causal_mask(size):
    """Matrice triangulaire supérieure
    remplie de -inf."""
    mask = np.triu(
        np.ones((size, size)) * float("-inf"),
        k=1
    )
    return mask

print(causal_mask(4))
# [[ 0.  -inf -inf -inf]
#  [ 0.   0.  -inf -inf]
#  [ 0.   0.   0.  -inf]
#  [ 0.   0.   0.   0. ]]
```

En Keras : `use_causal_mask=True` dans `MultiHeadAttention` gère cela automatiquement.

</Column>
</Columns>

---

## Couche de sortie : Linear + Softmax

La sortie du dernier décodeur est un vecteur de dimension $d_{model} = 512$ pour chaque position. Pour produire un mot, on projette ce vecteur vers la taille du vocabulaire cible et on applique un softmax :

$$P(\text{mot}_j) = \text{softmax}(W_{vocab} \cdot h + b)$$

<Columns>
<Column>

Si le vocabulaire cible contient 30 000 mots, la couche linéaire est une matrice $(512, 30000)$. Le softmax transforme les logits en probabilités. On prend le mot avec la plus haute probabilité (**greedy decoding**) ou on utilise le **beam search** pour explorer plusieurs hypothèses en parallèle.

</Column>
<Column>

> 📌 **IMAGE** : Schéma montrant le vecteur de sortie du décodeur (512 dims) → couche linéaire → logits (30000 dims) → softmax → distribution de probabilité. Le mot avec la plus haute probabilité est sélectionné. *(Alammar: transformer_decoder_output_softmax.png)*

</Column>
</Columns>

---

## L'entraînement : Teacher Forcing et Cross-Entropy

Pendant l'entraînement, on ne génère pas mot par mot. Grâce au masque causal, on peut calculer la loss sur **toute la séquence cible en une seule passe** :

```python
# Entrées d'entraînement pour "I am a student <eos>"
# decoder_input  = ["<sos>", "I",  "am", "a", "student"]    (décalé de 1)
# decoder_target = ["I",    "am", "a",  "student", "<eos>"] (la vérité)
```

On fournit au décodeur les vrais mots décalés d'une position (technique appelée **teacher forcing**) et on compare la sortie prédite au mot attendu via la **cross-entropy** :

$$\mathcal{L} = -\sum_{t=1}^{T} \log P(y_t | y_{<t}, X)$$

Le masque causal garantit que la prédiction du mot $t$ ne dépend que des mots $1$ à $t-1$, même si toute la séquence est présente dans le tenseur d'entrée. C'est ce qui permet la parallélisation massive de l'entraînement.

---

<TitleSlide>

# Récapitulatif
## Tout mettre ensemble

</TitleSlide>

---

## L'architecture complète en un coup d'œil

> 📌 **IMAGE** : Diagramme complet du Transformer original, style papier "Attention Is All You Need" Figure 1. Montrer les 6 encodeurs, 6 décodeurs, les connexions K/V, les embeddings + positional encoding des deux côtés, la couche linéaire + softmax finale.

Le flux des données :

**Encodeur** — Les tokens d'entrée sont convertis en embeddings, additionnés aux encodages positionnels, puis passent à travers 6 blocs identiques (self-attention + FFN). La sortie est un ensemble de représentations contextualisées de chaque mot source.

**Décodeur** — Les tokens cibles (décalés) suivent le même processus, mais avec une self-attention masquée. Ensuite, une attention croisée interroge les représentations de l'encodeur. Après 6 blocs, une couche linéaire + softmax produit la distribution sur le vocabulaire.

**À l'inférence** — Le décodeur génère un mot à la fois, en mode auto-régressif. Chaque mot prédit est réinjecté comme entrée pour le pas suivant.

---

## Seq2Seq vs Attention vs Transformer

| Aspect | Seq2Seq (RNN) | Seq2Seq + Attention | Transformer |
|--------|--------------|-------------------|-------------|
| Encodeur | RNN séquentiel | RNN séquentiel | Self-attention parallèle |
| Contexte | Vecteur fixe unique | Somme pondérée dynamique | Self-attention + croisée |
| Parallélisation | Impossible (séquentiel) | Limitée (RNN) | Totale |
| Longues séquences | Dégradation rapide | Amélioration notable | Excellente (mais $O(n^2)$) |
| Entraînement | Lent | Lent | Rapide (GPU/TPU) |
| Papier de référence | Sutskever 2014 | Bahdanau 2014 | Vaswani 2017 |

---

## Pourquoi le Transformer domine aujourd'hui

Le Transformer est à la base de pratiquement tous les modèles de NLP modernes. BERT (2018) utilise uniquement la pile d'encodeurs pour des tâches de compréhension. GPT (2018→2024) utilise uniquement la pile de décodeurs pour la génération de texte. T5 et les modèles de traduction utilisent l'architecture complète encodeur-décodeur.

Au-delà du NLP, l'architecture s'est propagée à la vision (Vision Transformer / ViT), à l'audio, aux protéines (AlphaFold), à la robotique. Le mécanisme de self-attention est devenu le couteau suisse du deep learning.

La question de recherche active n'est plus "faut-il utiliser des Transformers ?" mais "comment les rendre plus efficaces ?" — d'où les travaux sur l'attention linéaire, les Transformers creux, les architectures Mamba/State Space Models, etc.

---

<TitleSlide>

# Compléments optionnels

</TitleSlide>

---

## [Optionnel] Positional Encoding : pourquoi ça marche

Les fonctions sinusoïdales ont une propriété cruciale : pour tout décalage fixe $k$, il existe une transformation linéaire qui relie $PE_{pos}$ à $PE_{pos+k}$. Le modèle peut donc apprendre à raisonner sur les positions relatives.

$$PE_{pos+k} = f(PE_{pos})$$

Intuitivement, c'est similaire à la représentation binaire des nombres : le bit de poids faible alterne à chaque position (0,1,0,1...), le suivant alterne tous les 2 (0,0,1,1,0,0...), etc. Les sinusoïdes jouent le même rôle mais en continu.

Les modèles plus récents utilisent d'autres approches : **RoPE** (Rotary Position Embeddings) dans LLaMA encode la position comme une rotation dans l'espace complexe, et **ALiBi** (Attention with Linear Biases) ajoute un biais linéaire directement aux scores d'attention plutôt qu'aux embeddings.

---

## [Optionnel] Détail du training : warm-up et label smoothing

<Columns>
<Column>

L'article original utilise un **learning rate schedule** spécifique avec warm-up :

$$lr = d_{model}^{-0.5} \cdot \min(step^{-0.5}, step \cdot warmup^{-1.5})$$

Le learning rate monte linéairement pendant les premières `warmup_steps` (typiquement 4000), puis décroît comme $1/\sqrt{step}$. Le warm-up est crucial car les premières itérations avec des poids aléatoires produisent des gradients instables.

L'article utilise aussi le **label smoothing** ($\epsilon = 0.1$) : au lieu de cibles one-hot, on redistribue 10% de la probabilité sur les autres classes. Cela améliore la généralisation et le score BLEU.

</Column>
<Column>

```python
class TransformerSchedule(
    keras.optimizers.schedules.LearningRateSchedule
):
    def __init__(self, d_model, warmup_steps=4000):
        super().__init__()
        self.d_model = float(d_model)
        self.warmup = float(warmup_steps)

    def __call__(self, step):
        step = float(step)
        arg1 = step ** -0.5
        arg2 = step * self.warmup ** -1.5
        return self.d_model ** -0.5 * min(
            arg1, arg2
        )

optimizer = keras.optimizers.Adam(
    learning_rate=TransformerSchedule(512),
    beta_1=0.9, beta_2=0.98, epsilon=1e-9
)
```

</Column>
</Columns>

---

## [Optionnel] Beam Search à l'inférence

À l'inférence, le greedy decoding (prendre le mot le plus probable à chaque étape) n'est pas optimal globalement. Le **beam search** explore $B$ hypothèses en parallèle :

À chaque pas, on garde les $B$ séquences partielles les plus probables (le "faisceau"). Pour chaque hypothèse, on calcule les $V$ continuations possibles, ce qui donne $B \times V$ candidats. On ne garde que les $B$ meilleurs parmi tous ces candidats.

```python
# Pseudo-code simplifié du beam search
beam_size = 4
sequences = [{"tokens": [SOS], "score": 0.0}]

for step in range(max_length):
    all_candidates = []
    for seq in sequences:
        probs = model.predict(seq["tokens"])  # distribution sur le vocab
        top_k = np.argsort(probs)[-beam_size:]
        for token in top_k:
            candidate = {
                "tokens": seq["tokens"] + [token],
                "score": seq["score"] + np.log(probs[token])
            }
            all_candidates.append(candidate)
    # Garder les B meilleures
    sequences = sorted(all_candidates, key=lambda x: x["score"])[-beam_size:]
```

En pratique, un beam size de 4-6 offre un bon compromis qualité/vitesse.

---

## Références

Sutskever, I., Vinyals, O., Le, Q. V. (2014). *Sequence to Sequence Learning with Neural Networks.* NeurIPS.

Bahdanau, D., Cho, K., Bengio, Y. (2014). *Neural Machine Translation by Jointly Learning to Align and Translate.* ICLR 2015.

Luong, M-T., Pham, H., Manning, C. D. (2015). *Effective Approaches to Attention-based Neural Machine Translation.* EMNLP.

Vaswani, A. et al. (2017). *Attention Is All You Need.* NeurIPS.

Alammar, J. (2018). *The Illustrated Transformer.* jalammar.github.io.

Alammar, J. (2018). *Visualizing A Neural Machine Translation Model.* jalammar.github.io.

---

<TitleSlide>

# Merci !
## Questions ?

</TitleSlide>
