---
layout: prose
title: "Du ML aux LLMs"
slides_project_home: /ml2llm/
footer: 'DistillGPT2 architecture'
---
<TitleSlide>

## Structure de GPT2

- Modèles Huggingface
    - tokenizer
    - AutoModelForCausalLM
    - modèle en tant que classe Python avec `__init__` et `forward`
- transformer block
- mécanisme d'attention

</TitleSlide>
---
# Modèles bidirectionnels vs unidirectionnels

- approche de modélisation autorégressive

---
# Hugginface

- from_pretrained, from_config
- transformers, datasets

---
# Transformers avec Huggingface

**AutoModelForCausalLM** : génère du texte de manière unidirectionnelle, de gauche à droite, en prédisant le mot suivant dans une séquence basée sur le contexte précédent. Comparé à d'autres types de modèles transformer, la différence clé dans AutoModelForCausalLM est sa nature unidirectionnelle. Cela signifie qu'il traite le texte d'une seule manière, de gauche à droite.

(modèles de langage bidirectionnels, comme BERT)

https://huggingface.co/transformers/v4.8.2/model_doc/auto.html?highlight=automodelforcausallm#automodelforcausallm

C'est une classe de modèle générique qui sera instanciée comme l'une des classes de modèle de la librairie (avec une tête de modélisation de langage causal) quand créée avec la méthode de classe `from_pretrained()` ou la méthode de classe `from_config()`.

L'idée centrale derrière `AutoModelForCausalLM` est d'utiliser une approche de modélisation autorégressive pour déduire les relations causales à partir de données observationnelles. Les modèles autoregressifs sont des modèles statistiques qui prédisent la valeur future d'une variable basée sur ses valeurs passées. Le modèle capture essentiellement les distributions de probabilité conditionnelle — comment les variables dépendent les unes des autres et s'influencent mutuellement.


```
pip install transformers
```



```python
from transformers import AutoModelForCausalLM, AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained("gpt2")
model = AutoModelForCausalLM.from_pretrained("gpt2")
input_text = "I want to learn AI"
input_ids = tokenizer(input_text, return_tensors='pt').input_ids
generated_ids = model.generate(input_ids, max_length=30)
generated_text = tokenizer.decode(generated_ids[0], skip_special_tokens=True)
print(generated_text)
```

- `AutoTokenizer` : Ce module nous permet de charger un tokenizer pré-entraîné. Les tokenizers décomposent le texte d'entrée en tokens individuels, qui sont les unités de base que le modèle comprend.

- `AutoModelForCausalLM` : Ce module nous permet de charger un modèle de langage causal pré-entraîné. Les modèles de langage causal peuvent générer du texte basé sur un prompt ou un contexte donné.


---
# Transformers

De DistilGPT2 à Llama ou Gemma

## DistilGPT2
DistilGPT2 est un modèle en langue anglaise pré-entraîné sous la supervision de la version avec 124 millions de paramètres de GPT-2. DistilGPT2, qui compte 82 millions de paramètres, a été développé en utilisant la distillation de connaissances et a été conçu pour être une version plus rapide et plus légère de GPT-2.

https://huggingface.co/distilbert/distilgpt2

**Fiche technique du modèle GPT2** : https://github.com/openai/gpt-2/blob/master/model_card.md

> _Parce que les modèles de langage à grande échelle comme GPT-2 ne distinguent pas le fait de la fiction, nous ne supportons pas les cas d'usage qui nécessitent que le texte généré soit vrai._

Entraîné sur https://skylion007.github.io/OpenWebTextCorpus/ (Reddit) : Cela a laissé 38GB de données textuelles (40GB en utilisant les unités SI) provenant de 8 013 769 documents.


# DistilGPT2

**DistilGPT2** : architecture classique, 82M de paramètres (léger)

On charge le modèle avec

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained("distilbert/distilgpt2")

model = AutoModelForCausalLM.from_pretrained(
        "distilbert/distilgpt2",
        torch_dtype="auto",
        device_map="cpu",
    )
print(model)
```

Ce qui donne la structure suivante


```bash
GPT2LMHeadModel(
    (transformer): GPT2Model(
        (wte): Embedding(50257, 768)
        (wpe): Embedding(1024, 768)
        (drop): Dropout(p=0.1, inplace=False)
        (h): ModuleList(
            (0-5): 6 x GPT2Block(
                (ln_1): LayerNorm((768,), eps=1e-05,
                            ➥elementwise_affine=True)
                (attn): GPT2Attention(
                    (c_attn): Conv1D(nf=2304, nx=768)
                    (c_proj): Conv1D(nf=768, nx=768)
                    (attn_dropout): Dropout(p=0.1, inplace=False)
                    (resid_dropout): Dropout(p=0.1, inplace=False)
                )
                (ln_2): LayerNorm((768,), eps=1e-05,
                             ➥elementwise_affine=True)
                (mlp): GPT2MLP(
                    (c_fc): Conv1D(nf=3072, nx=768)
                    (c_proj): Conv1D(nf=768, nx=3072)
                    (act): NewGELUActivation()
                    (dropout): Dropout(p=0.1, inplace=False)
                )
            )
        )
        (ln_f): LayerNorm((768,), eps=1e-05, elementwise_affine=True)
    )
    (lm_head): Linear(in_features=768, out_features=50257, bias=False)
)
```

Donc :
- 2 couches d'embedding + dropout
- puis 6 couches de GPT2Block
- puis la normalisation (ln_f: final layer norm)
- et lm_head: language modeling head pour retrouver les tokens en sortie

## 2 couches d'embeddings

Processus de création des embeddings dans le bloc d'entrée.

- La couche `wte` convertit chaque token de texte en un **embedding de token** basé sur sa signification.

- La couche `wpe` génère un **embedding positionnel** basé sur la position du token dans la séquence.

La combinaison (addition) des deux produit un vecteur qui contient à la fois l'information sémantique et positionnelle.


## WTE: Word Token Embedding

```
(wte): Embedding(50257, 768)
```

- Vocabulaire : 50257 tokens
- sortie : vecteur de 768

## WPE (Embedding positionnel)

Encoder la position de chaque token dans la séquence.

```
(wpe): Embedding(1024, 768)
```

- Position : 1024 positions
- sortie : vecteur de 768


Pour chaque position possible (de 0 à 1023), cette couche génère un vecteur unique de 768 dimensions. La limite de 1024 positions marque la longueur d'entrée maximale que le modèle accepte.

Ce vecteur, connu sous le nom d'embedding positionnel, est ensuite ajouté directement à l'embedding de token de l'étape précédente. Cette addition vectorielle est possible, précisément, parce que les deux vecteurs partagent la même dimensionnalité.

On ajoute les 2 vecteurs qui ont la même dimension

## Embedding Dropout

Mais là on n'a pas de structure de réseau. Seulement des vecteurs. Donc c'est quoi le dropout ?

Dans le contexte des embeddings, le dropout peut être appliqué aux vecteurs d'embedding.

Le « embedding dropout » consiste à annuler soit des vecteurs entiers associés à des tokens soit des éléments individuels dans les vecteurs.

L'implémentation de GPT-2 par Hugging Face applique un dropout standard élément par élément à la sortie d'embedding.

De plus, les couches WTE et WPE d'embeddings sont mises à jour pendant l'entraînement. Les embeddings ne sont pas obtenus à partir d'un modèle d'embeddings déjà existant (comme on le ferait pour obtenir les embeddings d'un texte) mais bien générés pendant l'entraînement.

On part d'un vocabulaire fixe (lookup) et des vecteurs initialisés, qui sont mis à jour pendant l'entraînement

### Matrice de poids :

La couche d'embedding est essentiellement une matrice de poids, souvent notée E.

- Le nombre de lignes dans E égale la taille du vocabulaire (V).
- Le nombre de colonnes dans E égale la dimension d'embedding (D). Ce D est un hyperparamètre que vous choisissez (par ex., 128, 256, 512).


# GPT2Block Transformer

Enfin on passe le tout aux blocks GPT2 Transformer

![](/images/ml2llm/GPT2_structure).png)

Un bloc GPT2Block Transformer contient quatre composants qui apparaissent dans cet ordre :
- la couche ln_1 (normalisation avant le mécanisme d'attention),
- le module attn (le mécanisme d'attention),
- la couche ln_2 (normalisation avant le traitement MLP),
- et le module MLP (réseau de neurones de transformation).


Le **mécanisme d'attention**, est responsable de la contextualisation : il donne à chaque mot la capacité de « regarder » et se connecter avec les autres mots de la séquence pour mieux comprendre sa signification. Par exemple, dans la phrase « Fresh water flows from the mountain spring daily », le mot « spring » doit regarder « water », « flows » et « mountain » pour comprendre qu'il ne fait pas référence à la saison. L'attention calcule ces connexions automatiquement, déterminant quels mots sont pertinents pour comprendre chaque position.

## MLP : Multi-layer perceptron

Le bloc MLP (Multi-Layer Perceptron) agit comme le processeur de connaissances : il prend l'information que la couche d'attention a contextualisée et la transforme en appliquant les connaissances que le modèle a apprises pendant l'entraînement.

L'attention dit, le mot « spring » dans ce contexte est lié à « mountain » et « water », et le MLP utilise ses connaissances pour comprendre que cela implique des concepts comme « nature », « fraîcheur » et « géographie », et d'autres termes similaires.

Le modèle doit convertir ses représentations internes en une prédiction finale. Ce processus se fait en deux étapes : d'abord, la couche **ln_f** (final layer norm) stabilise les vecteurs de sortie.

Ensuite, la **lm_head** (language modeling head) projette chaque vecteur dans l'espace de vocabulaire complet (50 257 dimensions). => on retrouve les tokens. ou plutôt une distribution de probabilité des tokens.


Le résultat de cette projection n'est pas un seul token, mais un vecteur de **logits** (scores) qui représente une distribution de probabilité sur tous les tokens possibles.

Par exemple, pour la phrase « Paris is the capital of... », ces **logits** pourraient assigner une probabilité de 30% à « France » et 25% à « Italy ».

Bien que 30% puisse sembler faible pour une bonne réponse, cela représente une prédiction forte quand distribuée sur un vocabulaire de plus de 50 000 tokens possibles. La probabilité restante est dispersée finement sur des milliers d'autres options, bien moins probables. C'est de cette distribution que le token suivant est finalement sélectionné.


# Mécanisme d'attention

Article classique de Google : « Attention is all you need » (https://arxiv.org/abs/1706.03762).

Jusqu'à présent, l'embedding pour un token d'entrée donné a : l'identité et la position mais pas le contexte

> L'avocat mange des fruits vs je mange un avocat

Par exemple, la partie du vecteur qui représente la signification du mot « spring » (son embedding de token) est identique dans « Fresh water flows from the mountain spring daily » et dans « The garden comes alive again during the spring ».

À ce stade on a le même problème que word2vec (2013).


La contextualisation se produit à l'intérieur du module (attn), GPT2Attention, via une architecture appelée Multi-Head Attention (MHA) où chaque tête fonctionne en parallèle.

Chaque tête d'attention est, en essence, un mécanisme d'attention complet et indépendant qui s'est spécialisé dans la recherche d'un type spécifique de relation.

La spécialisation des têtes d'attention émerge pendant l'entraînement du modèle. Au fur et à mesure que le modèle ajuste ses poids pour minimiser l'erreur de prédiction, chaque tête apprend à se concentrer sur les types de motifs qu'elle trouve les plus utiles. Par exemple, une tête pourrait devenir experte dans la détection des relations syntaxiques (sujet-verbe), tandis qu'une autre pourrait se spécialiser dans les relations sémantiques (synonymes) ou les dépendances à long terme.

```
config = model.config
print(f"Attention heads: {config.n_head}")
print(f"Head dimensions: {config.n_embd // config.n_head}")
```


Le modèle divise la dimensionnalité de l'embedding d'entrée (768) entre ces 12 têtes, donc chacune se concentre sur une représentation plus petite et plus spécialisée de 64 dimensions (768 / 12 = 64).
La couche `c_attn` est conçue pour générer très efficacement les projections nécessaires pour toutes ces têtes simultanément.




Processus de la tête

L'entrée X est linéairement transformée en trois représentations différentes : la Query (Q), la Key (K) et la Value (V). Ces transformations sont des projections linéaires apprises.

Q = X * W_Q

K = X * W_K

V = X * W_V

Où W_Q, W_K et W_V sont les matrices de poids pour les transformations query, key et value, respectivement. Chaque tête a son propre ensemble unique de ces matrices de poids.

Les différences entre W_Q, W_K et W_V proviennent de :

    Initialisation indépendante : Elles commencent avec des valeurs aléatoires différentes.

    Mises à jour de gradient différentes : Elles reçoivent des gradients différents pendant la rétropropagation parce qu'elles sont utilisées de différentes manières pour calculer les scores d'attention et les valeurs pondérées. C'est le facteur le plus important.

    Rôles fonctionnels : Elles servent des objectifs différents (querying, keying et valuing), qui guident leur processus d'apprentissage.


C'est un sujet en soi même et je n'ai pas tout compris.


Retour au MLP

Il est important de se souvenir que cette séquence s'exécute dans l'ordre : Attention → MLP → Attention → MLP, et ainsi de suite à travers les six blocs.
En d'autres termes, la couche Attention contextualise et la couche MLP convertit la contextualisation en connaissance.

# Le MLP en fin de bloc

On voit

```python
(mlp): GPT2MLP(
     (c_fc): Conv1D(nf=3072, nx=768)
     (c_proj): Conv1D(nf=768, nx=3072)
     (act): NewGELUActivation()
     (dropout): Dropout(p=0.1, inplace=False)
)
```

En fait l'ordre d'exécution est un peu différent, la fonction d'activation est située entre les 2 Conv1D

```python
(mlp): GPT2MLP(
     (c_fc): Conv1D(nf=3072, nx=768)
     (act): NewGELUActivation()
     (c_proj): Conv1D(nf=768, nx=3072)
     (dropout): Dropout(p=0.1, inplace=False)
)
```

L'ordre est le suivant :

> expansion (c_fc) → activation (act) → contraction (c_proj) → regularization (dropout).

La fonction d'activation GELU https://docs.pytorch.org/docs/stable/generated/torch.nn.GELU.html


> GELU (Gaussian Error Linear Unit) est une fonction d'activation lisse et non-linéaire qui aide le modèle à apprendre des motifs complexes en passant sélectivement ou en atténuant les signaux de chaque neurone.

=> brise la linéarité


GELU offre une activation plus lisse et plus nuancée comparée à ReLU (Rectified Linear Unit) ou sigmoid.
- ReLU, tout en étant computationnellement efficace, souffre du problème du « dying ReLU » où les neurones peuvent rester coincés dans un état inactif.
- La fonction sigmoid souffre de la disparition des gradients.

GELU évite ces problèmes en introduisant un élément **probabiliste**.
Elle met à l'échelle l'entrée par sa fonction de distribution cumulative, rendant effectivement l'activation une fonction lisse qui peut à la fois activer et désactiver les neurones basée sur la valeur de l'entrée.

Ce gating stochastique et dépendant de l'entrée est censé permettre au réseau d'apprendre des relations plus complexes et d'améliorer les performances, particulièrement dans les modèles profonds comme les Transformers.

En essence, GELU combine les avantages de ReLU et sigmoid tout en atténuant leurs inconvénients, résultant en une meilleure capacité représentationnelle pour le bloc MLP dans une architecture Transformer.

# Dimensions d'un modèle : profondeur vs largeur


La **profondeur** fait référence au nombre de blocs Transformer que nous empilons les uns sur les autres. Dans DistilGPT2, la profondeur est de six blocs Transformer. Modifier la profondeur (**Depth Pruning**) implique de supprimer des blocs entiers. Généralement, plus de profondeur permet un raffinement séquentiel plus complexe de l'information, mais au prix d'une latence plus élevée.

La **largeur** fait référence à la taille des couches internes, spécifiquement la dimension intermédiaire du bloc MLP.

Dans notre DistilGPT2, la largeur est 3072 neurones. Cette dimension détermine la capacité du modèle à traiter les connaissances à chaque étape. Réduire la capacité d'expansion avec le **Width Pruning** affecte directement le nombre de paramètres et la consommation de mémoire.


![](/images/ml2llm/transformers_shape_of_models.png)



On peut distinguer deux approches principales :

Modèles larges : Les architectures comme Llama-3.2-1B et DistilGPT2 sont notablement larges. Elles utilisent un embedding d'entrée large et une expansion MLP plus grande que dans les autres modèles, dans ce cas x4, ce qui leur donne une grande capacité de traitement dans chacune de leurs couches.

Modèles profonds et étroits : En contraste, les modèles comme Qwen3-0.6B et Gemma-3-270M, avec un embedding plus petit et une expansion x3, sont plus profonds et plus étroits. Ils priorisent un nombre plus élevé de transformations séquentielles.

---
## Mécanisme d'attention

Mécanisme Query, Key, Value (QKV), le paradigme qu'utilise l'attention pour la contextualisation.

Calcule la compatibilité entre les tokens d'une séquence pour décider combien d'attention chaque token devrait prêter aux autres.

Q, K, V sont des vecteurs :
- Q est la query, le token auquel nous devons ajouter l'information contextuelle
- K semble être similaire à l'embedding de token dans la couche d'embedding. Il représente la signification de chaque token dans la séquence de tokens de texte
- V est un score contextuel entre K et Q

On a la relation

Transformations linéaires : Chaque embedding d'entrée est ensuite alimenté dans trois transformations linéaires différentes (couches entièrement connectées). Ces transformations linéaires sont définies par trois matrices de poids apprises : W_Q, W_K et W_V.

- Q = embedding d'entrée * W_Q
- K = embedding d'entrée * W_K
- V = embedding d'entrée * W_V

Ces matrices de poids sont apprises pendant le processus d'entraînement. Chaque embedding de token dans la séquence est multiplié par chacune de ces matrices de poids pour produire les vecteurs Q, K et V pour chaque token dans la séquence.


Donc chacune de ces matrices de poids est en fait une couche entièrement connectée (N nœuds x P paramètres -> matrice NxP)

Et chaque matrice de poids est mise à jour lors de l'entraînement avec la rétropropagation.


Ce qui va les distinguer c'est 1) leur initialisation 2) le calcul du gradient

Si on pose

- Q = Input * W_Q
- K = Input * W_K
- V = Input * W_V
- Attention Scores = Q * K.T
- Normalized Attention Scores = softmax(Attention Scores / sqrt(d_k)) (d_k est la dimension des vecteurs de key)
- Context Vector = Normalized Attention Scores * V
- Output = Context Vector + (Optional) Input (connexion résiduelle)


et plus précisément

- L : La fonction de loss.
- H : La sortie du mécanisme d'attention (Context Vector).
- Q : Matrice Query (batch_size, seq_len, d_k).
- K : Matrice Key (batch_size, seq_len, d_k).
- V : Matrice Value (batch_size, seq_len, d_v).
- d_k : Dimension des vecteurs key/query.
- d_v : Dimension des vecteurs value.
- W_Q : Matrice de poids Query.
- W_K : Matrice de poids Key.
- W_V : Matrice de poids Value.
- X : Embeddings d'entrée (batch_size, seq_len, d_model).
- A : Scores d'attention (Q * K.T)
- A_norm : Scores d'attention normalisés (softmax(A / sqrt(d_k)))

Alors :

```
- Q = X * W_Q
- K = X * W_K
- V = X * W_V
- A = Q * K.T
- A_norm = softmax(A / sqrt(d_k))
- H = A_norm * V
```

On aura les gradients

```
- ∂L/∂W_V = (∂L/∂H) * A_norm * X
- ∂L/∂W_K = (∂L/∂H) * V * ∂σ(A / sqrt(d_k))/∂A * Q * X
- ∂L/∂W_Q = (∂L/∂H) * V * ∂σ(A / sqrt(d_k))/∂A * K * X
```

Notez que les deux ∂L/∂W_K et ∂L/∂W_Q sont des multiples croisés de Q et K.

```
∂L/∂W_K / ∂L/∂W_Q = Q / K
k.∂L/∂W_K = Q.∂L/∂W_Q
```

---

Sur l'interprétabilité des équations mathématiques du système d'attention.

Comment passer des équations math qui sont straightforward, ça se déroule bien avec des dérivées en chaîne, à un rôle de contextualisation pour le vecteur de sortie H

Voici la réponse de Gemini. Pas encore tout bien compris

---
Comment les chercheurs sont-ils arrivés à ce schéma spécifique du mécanisme d'attention, et comment bridgeons-nous le fossé entre les maths et l'interprétation intuitive d'un « context vector » ?

Voici une décomposition du processus de réflexion et des idées clés qui ont conduit à cette architecture :

=> le problème initial, les RNNs sont limités par rapport à la longueur de la séquence

1.  **Le besoin de contexte :** Les modèles de séquence traditionnels comme les RNNs (Recurrent Neural Networks) ont lutté contre les dépendances à long terme. La signification d'un mot dépend souvent de mots très loin dans la phrase, et les RNNs avaient du mal à capturer ces relations efficacement. L'idée centrale était de créer un mécanisme qui pouvait directement faire attention à *n'importe quelle* partie de la séquence d'entrée quand on traite un token particulier.

=> l'attention : avoir une somme pondérée des tokens.

2.  **L'attention comme somme pondérée :** L'idée de l'attention elle-même n'était pas entièrement nouvelle. Elle avait été utilisée précédemment dans la traduction automatique et d'autres tâches. Le principe de base est de calculer une somme pondérée de certaines valeurs, où les poids sont déterminés par la pertinence de chaque valeur pour le contexte courant.


=> H = lookup(Q, in {K,V}) -> H = sum_i alpha_i * V_i

3.  **Key, Value et Query Métaphore :** L'innovation cruciale était de formuler l'attention en termes de *queries*, *keys* et *values*. Cela a permis au mécanisme d'être plus flexible et expressif :
    *   **Query (Q) :** Représente l'information que le token courant « demande ».
    *   **Key (K) :** Représente l'information que chaque token de la séquence « offre ».
    *   **Value (V) :** Représente le contenu réel de chaque token qui peut être incorporé dans le contexte.

Pensez-y comme une recherche dans une base de données : la query est votre terme de recherche, les keys sont les indices de la base de données, et les values sont les données réelles stockées dans la base de données. Le mécanisme d'attention apprend à « queryer » la séquence d'entrée pour récupérer l'information pertinente.

4.  **Attention par produit scalaire (mise à l'échelle) :** Le produit scalaire entre la query et les keys est un moyen simple et efficace de mesurer la similarité. Le facteur d'échelle (sqrt(d_k)) a été introduit pour empêcher les produits scalaires de devenir trop larges, ce qui peut conduire à des gradients très petits après le softmax.

5.  **Softmax pour l'attention probabiliste :** La fonction softmax transforme les scores de similarité en une distribution de probabilité. Cela assure que les poids d'attention somment à 1, et permet au modèle de se concentrer sur les parties les plus pertinentes de la séquence d'entrée.

6.  **Somme pondérée des valeurs :** Les poids d'attention normalisés sont ensuite utilisés pour calculer une somme pondérée des vecteurs de value. Cette somme pondérée représente le *context vector*.

    **H = A_norm * V**

    Le context vector est une *représentation* de l'information pertinente de l'ensemble de la séquence d'entrée, focalisée sur le token courant.

7.  **Context Vector comme signification sémantique :** C'est le saut de foi, et c'est où la puissance de l'apprentissage de représentation entre en jeu. Le context vector *H* est une nouvelle représentation vectorielle du token d'entrée, mais maintenant *informée par la séquence entière*. En entraînant les transformations Q, K et V, le modèle apprend à :
    *   Extraire les caractéristiques les plus pertinentes de chaque token (via K et V).
    *   Apprendre comment « demander » l'information correcte (via Q).
    *   Combiner l'information pertinente dans un context vector *H* qui capture la signification sémantique du token *dans son contexte*.

    *Ce n'est pas juste une somme pondérée ; c'est une combinaison apprise et pilotée par les données qui vise à capturer l'essence sémantique du token en relation avec le reste de la séquence.* Les poids ne sont pas prédéfinis ; le réseau apprend les poids optimaux pour créer la meilleure représentation contextuelle possible.

8.  **Multi-Head Attention :** Pour améliorer davantage l'expressivité du mécanisme d'attention, l'attention à plusieurs têtes a été introduite. Cela permet au modèle d'apprendre de multiples ensembles de transformations Q, K et V, chacun capturant différents aspects des relations entre les tokens. Les sorties des multiples têtes d'attention sont ensuite concaténées et transformées pour produire le vecteur de contexte final.

**Bridger le fossé :**

La magie se produit parce que le modèle est entraîné *end-to-end* pour accomplir une tâche spécifique (par ex., modélisation de langage, traduction). La fonction de loss fournit le signal de rétroaction qui guide l'apprentissage des transformations Q, K et V. Le modèle apprend à créer des context vectors qui sont utiles pour faire des prédictions précises.

Il n'est pas immédiatement évident que H est un context vector ou une insight de la signification sémantique.
Il l'apprend à partir des fonctions de loss et de l'entraînement par rétropropagation.

C'est une représentation apprise, pas une prédéfinie. Le modèle découvre les relations sous-jacentes dans les données et les encode dans les poids du réseau. Le mécanisme d'attention est simplement un outil qui permet au modèle de se concentrer sur l'information la plus pertinente quand on crée ces représentations.

En résumé, le mécanisme d'attention a émergé du besoin de capturer les dépendances à long terme dans les séquences. L'abstraction key, value et query, combinée avec l'attention par produit scalaire et le softmax, fournit un moyen flexible et efficace de calculer des context vectors qui représentent la signification sémantique des tokens dans leur contexte. Le succès de cette approche repose sur la capacité du modèle à apprendre les transformations Q, K et V qui extraient l'information la plus pertinente de la séquence d'entrée.


---

# Mon résumé

```
H = lookup(Q, in {K,V}) -> H = sum_i alpha_i * V_i
```

Et bingo !

```
Oui, c'est un résumé concis et précis du mécanisme d'attention !

Vous pouvez l'exprimer comme :

H = lookup(Q, {K, V}) -> H = Σᵢ αᵢ * Vᵢ

Où :

- H est le context vector (la sortie).
- lookup(Q, {K, V}) représente le mécanisme d'attention, où la query Q est utilisée pour « regarder » l'information pertinente de l'ensemble des keys K et values V.
- αᵢ sont les poids d'attention (dérivés du softmax de Q*Kᵀ), représentant la pertinence du vecteur value i-ème.
- Vᵢ est le vecteur value i-ème.
- Σᵢ dénote la somme sur tous les vecteurs de value, pondérée par leurs poids d'attention correspondants.
```

---

# Intensif en mémoire

Tout est chargé en mémoire. Obstacle majeur

---

# Innovation : Grouped-Query Attention (GQA), Gated Linear Units (GLU)

---

# Llama 3.2


```python
model = AutoModelForCausalLM.from_pretrained(
   "meta-llama/Llama-3.2-1B",
    torch_dtype="auto",
    device_map="cpu",
    trust_remote_code=True
)
```

Ce qui donne

```python
LlamaForCausalLM(
  (model): LlamaModel(
    (embed_tokens): Embedding(128256, 2048)
    (layers): ModuleList(
      (0-15): 16 x LlamaDecoderLayer(
        (self_attn): LlamaAttention(
          (q_proj): Linear(in_features=2048, out_features=2048, bias=False)
          (k_proj): Linear(in_features=2048, out_features=512, bias=False)
          (v_proj): Linear(in_features=2048, out_features=512, bias=False)
          (o_proj): Linear(in_features=2048, out_features=2048, bias=False)
        )
        (mlp): LlamaMLP(
          (gate_proj): Linear(in_features=2048, out_features=8192, bias=False)
          (up_proj): Linear(in_features=2048, out_features=8192, bias=False)
          (down_proj): Linear(in_features=8192, out_features=2048,
                                             ➥bias=False)
          (act_fn): SiLU()
        )
        (input_layernorm): LlamaRMSNorm((2048,), eps=1e-05)
        (post_attention_layernorm): LlamaRMSNorm((2048,), eps=1e-05)
      )
    )
    (norm): LlamaRMSNorm((2048,), eps=1e-05)
    (rotary_emb): LlamaRotaryEmbedding()
  )
  (lm_head): Linear(in_features=2048, out_features=128256, bias=False)
)
```


On a toujours : attention + MLP + norm
avec pas mal de différences vis à vis du GPT2

- Le vocabulaire a été étendu et le modèle a une plus grande largeur : Embedding(128256, 2048)
- 16 blocs vs 6 pour DistilGPT2


# Grouped-Query Attention (GQA)

GQA est un mécanisme d'attention introduit pour réduire cette exigence de mémoire, en réduisant le nombre de têtes KV tout en préservant l'efficacité computationnelle.





---

# Ressources :

https://huggingface.co/spaces/exbert-project/exbert


---
# Prochaine fois



LLMs locaux
- Ollama

LLMs personnalisés
- pruning
- knowledge distillation