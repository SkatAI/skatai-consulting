---
layout: slides
title: "Day 5"
page_title: "Gradient stochastique"
summary: "gradient stochastique"
footer: 'Alexis Perrier - Skatai.com/ml2llm/'
slides_project_home: /ml2llm/
---
<TitleSlide>

# Gradient stochastique

</TitleSlide>
---

contenu

- methode du gradient pour trouver le minimum d'une fonction derivable
- demo sur fonction polynimial dont on connait la derivée
- STOCHASTIC GRADIENT: general idea is to aproximate an unknown function through iterations of unbiased estimates of the function's gradient. Knowing that the expectation of the gradient estimates equal the gradient.
- “stochastic” comes from the fact that the gradient based on a single training sample is a “stochastic approximation” of the “true”
cost gradient
- comment estimer le gradient / la derivee
- FONCTION DE COUT , FORME GÉNÉRALE: E(w, b) = L( , f ( )) +αR(w)
- example of loss function : Quadratic error : need to normalize
- breve histoire du SGD
- implementation generalisée et tres optimisée
- online learning

- les parametres du SGD de scikit learn
- influence du learning rate
- strategies du learning rate : adaptatif, etc
- MINI-BATCH (aka out-of-core) vs batch vs stochastic GRADIENT DESCENT
- regularisation : L1, L2
- comment regulariser le SGD
- realy stopping
- scikit SGDRegressor

- overview of optimizers

# resources

- colab: https://colab.research.google.com/drive/1EDjgLYCtcudxcSfhSNbBjopig1GGeHHk?usp=sharing
- https://www.ruder.io/optimizing-gradient-descent/
- https://scikit-learn.org/stable/modules/sgd.html#tips-on-practical-use
- http://yann.lecun.com/exdb/publis/pdf/lecun-98b.pdf
- https://machinelearningmastery.com/gentle-introduction-mini-batch-gradient-descent-configure-batch-size/


---

# Descente de Gradient Stochastique

---

# Fonction de cout


Entrainer un modele revient a minimiser une fonction de cout

chaque famille de modele a sa propre  fonction de cout

### Régression Linéaire

**Modèle** :
$$\hat{y} = w^T x + b$$

**Fonction de coût (MSE - Mean Squared Error)** :
$$E(w, b) = \frac{1}{2n}\sum_{i=1}^n (y_i - \hat{y}_i)^2 = \frac{1}{2n}\sum_{i=1}^n (y_i - w^T x_i - b)^2$$

### Régression Logistique

**Modèle** (classification binaire) :

$$\hat{y} = \sigma(w^T x + b) = \frac{1}{1 + e^{-(w^T x + b)}}$$ où $\sigma$ est la fonction sigmoïde

**Fonction de coût (Log Loss / Cross-Entropy)** :

$$E(w, b) = -\frac{1}{n}\sum_{i=1}^n \left[ y_i \log(\hat{y}_i) + (1-y_i) \log(1-\hat{y}_i) \right]$$ où $y_i \in \{0, 1\}$

---

### Decision Tree (Arbre de Décision)

**critères de division** :

**1. Pour la régression - MSE (Mean Squared Error)** :

$$\text{MSE} = \frac{1}{n}\sum_{i=1}^n (y_i - \bar{y})^2$$ où $\bar{y}$ est la moyenne des $y$ dans le nœud

**2. Pour la classification - Gini Impurity** :

$$\text{Gini} = 1 - \sum_{k=1}^K p_k^2$$ où $p_k$ est la proportion de la classe $k$

**3. Pour la classification - Entropie (Entropy)** :

$$\text{Entropy} = -\sum_{k=1}^K p_k \log_2(p_k)$$

Algorithme glouton (greedy) qui choisit la meilleure division à chaque nœud,
**pas de descente de gradient pour les arbres de decisions** !

---

## 1. Méthode du Gradient

**Objectif** : Trouver le minimum d'une fonction dérivable $f(x)$ (la fonction de cout)

**Principe** : Itération selon la direction opposée au gradient

$$x_{n+1} = x_n - \eta \nabla f(x_n)$$

où $\eta$ est le **taux d'apprentissage** (learning rate) et $\nabla f(x_n)$ le gradient, la derivée de la fonction $f(x)$

**Qu'est-ce que le gradient ?**

Le gradient, c'est **la pente** de la fonction à un point donné.

- Il indique **dans quelle direction monter** pour augmenter la fonction
- Plus le gradient est grand, plus la pente est raide
- En 1D : le gradient = la dérivée $f'(x)$
- En 2D+ : c'est un vecteur qui pointe vers la montée la plus forte

**Analogie** : Imaginez que vous êtes dans une vallée. Le gradient vous montre la direction de la montée la plus raide. Pour descendre au fond de la vallée (trouver le minimum), on va dans la direction **opposée** au gradient.


---

## 2. Démonstration : Fonction Polynomiale

**Exemple** : Minimiser $f(x) = x^2 - 4x + 5$

**Dérivée** : $f'(x) = 2x - 4$

**Algorithme** :
- Initialisation : $x_0 = 0$
- Itération : $x_{n+1} = x_n - \eta \cdot (2x_n - 4)$
- Avec $\eta = 0.1$ : convergence vers $x^* = 2$ (minimum)

**Résultat** : $f(2) = 1$ est le minimum global

---

# Code

[Colab](https://colab.research.google.com/drive/1NUEamCO6uFekiL4o7hpKnrRM-SwJEcIf?usp=sharing)

```python
def gradient_descent(f, df, x0, learning_rate=0.1, max_iter=100, tol=1e-6):
    """
    Trouve le minimum d'une fonction par descente de gradient

    Args:
        f: fonction à minimiser
        df: dérivée de la fonction
        x0: point de départ
        learning_rate: taux d'apprentissage (eta)
        max_iter: nombre maximum d'itérations
        tol: tolérance pour l'arrêt (early stopping)
    """
    x = x0

    for i in range(max_iter):
        # Calcul du gradient
        grad = df(x)

        # Mise à jour
        x_new = x - learning_rate * grad

        # Critère d'arrêt
        if abs(x_new - x) < tol:
            break

        x = x_new

    return x

```


---

### Principe fondamental

Le gradient n'est PAS une constante, c'est une **fonction de la position** :

$$\nabla E(w)$$

## Notation : w (poids/paramètres)

Le gradient ne s'applique qu'aux modeles dit lineaires ou il faut trouver les poids / les coefficients.

---

## En Machine Learning

**$w$ = vecteur des paramètres** (weights)

$$w = \begin{pmatrix} w_1 \\ w_2 \\ \vdots \\ w_d \end{pmatrix} \in \mathbb{R}^d$$

où $d$ = nombre de features (dimensions)


### Exemple concret - Régression linéaire

**Modèle** :
$$\hat{y} = w_1 x_1 + w_2 x_2 + ... + w_d x_d + b$$

Ou en notation vectorielle :
$$\hat{y} = w^T x + b$$

**Paramètres** :
- $w \in \mathbb{R}^d$ : vecteur des poids
- $b \in \mathbb{R}$ : biais (scalaire)


---

### Le gradient est aussi un vecteur !

$$\nabla E(w) = \begin{pmatrix}
\frac{\partial E}{\partial w_1} \\
\frac{\partial E}{\partial w_2} \\
\vdots \\
\frac{\partial E}{\partial w_d}
\end{pmatrix}$$

**Mise à jour vectorielle** :

$$w_{t+1} = w_t - \eta \nabla E(w_t)$$

Cela signifie **chaque composante** est mise à jour :

$$w_i^{(t+1)} = w_i^{(t)} - \eta \frac{\partial E}{\partial w_i}$$

---

### Cas particulier : 1D

Avec $f(x) = x^2 - 4x + 5$ :
- $w$ est un **scalaire** (1 seule dimension)

En pratique ML :
- $w$ est presque toujours un **vecteur**
- Parfois une **matrice** (réseaux de neurones)

---

### Dimensions typiques

| Modèle | Taille de $w$ |
|--------|---------------|
| Régression simple (1 feature) | $w \in \mathbb{R}$ |
| Régression multiple (100 features) | $w \in \mathbb{R}^{100}$ |
| Réseau de neurones simple | $w \in \mathbb{R}^{10000}$ |
| GPT-3 | $w \in \mathbb{R}^{175 \text{ milliards}}$ |

---


- $w$ désigne **tous les paramètres** du modèle
- C'est un vecteur en dimension $d$
- Chaque $w_i$ est un poids pour la feature $i$

À chaque itération :
1. On est à une nouvelle position $w_t$
2. On **calcule/estime** le gradient à cette position
3. Le gradient est différent car la pente change selon où on est

 Le gradient change car on l'évalue à chaque nouveau point


### Analogie simple

**descendre une montagne** :

- **En haut** : pente très raide → gradient fort
- **À mi-chemin** : pente moyenne → gradient moyen
- **En bas** : presque plat → gradient proche de 0
- **Au minimum** : plat → gradient = 0 (on s'arrête)

Le gradient change naturellement car **la pente n'est pas la même partout** !


---

## 3. Le Problème : Trop de Données

**Contexte Machine Learning** : On a $n$ echantillons d'entraînement $(x_1, y_1), ..., (x_n, y_n)$

**Fonction de coût totale** :

$$E(w) = \frac{1}{n}\sum_{i=1}^n L(y_i, f(x_i; w))$$

où $L$ = perte (loss) sur un echantillon

**Problème** : Calculer le gradient complet est **coûteux**

$$\nabla E(w) = \frac{1}{n}\sum_{i=1}^n \nabla L_i(w)$$

Avec $n$ = 1 million d'exemples → impossible à chaque itération !

---

## 4. La Solution : Gradient Stochastique

**Idée** : Au lieu de calculer le gradient sur TOUS les exemples, utiliser UN SEUL echantillon aléatoire

**Gradient complet** (trop lent) :

$$\nabla E(w) = \frac{1}{n}\sum_{i=1}^n \nabla L_i(w)$$

**Gradient stochastique** (rapide) :

$$\nabla \tilde{E}(w) = \nabla L_k(w)$$
où $k$ est tiré au hasard parmi $\{1, ..., n\}$

**Propriété du gradient stochastique** : En moyenne, ça marche !

$$\mathbb{E}[\nabla L_k] = \frac{1}{n}\sum_{i=1}^n \nabla L_i = \nabla E$$

---

## 5. Pourquoi "Stochastique" ?

Le terme **"stochastique"** vient de l'échantillonnage aléatoire

**Chaque itération** :
1. Tirer un exemple $k$ au hasard
2. Calculer $\nabla L_k(w)$ (gradient analytique exact sur cet exemple)
3. Mettre à jour : $w_{t+1} = w_t - \eta \nabla L_k(w_t)$

**Ce qui est stochastique** :
- Le CHOIX de l'exemple $k$ (aléatoire)
- Le gradient $\nabla L_k$ varie selon $k$ (bruité)

**Ce qui est exact** :
- Le calcul de $\nabla L_k$ lui-même (formule analytique)

---

## 6. Estimation Non Biaisée

**Question** : Un seul exemple, c'est pas trop approximatif ?

**Réponse** : C'est bruité, mais **non biaisé**

**Non biaisé** = correct en moyenne

Si on répète l'expérience 1000 fois :
- Chaque $\nabla L_k$ est différent (bruité)
- Mais leur moyenne = $\nabla E$ (le vrai gradient)

**Analogie** : Lancer un dé
- Un lancer donne 1, 2, 3, 4, 5 ou 6 (bruité)
- Moyenne de beaucoup de lancers = 3.5 (valeur exacte)

---

### Différence Batch GD vs SGD

**Ce qui est calculé/estimé** :

**Batch GD** :
- Gradient **calculé exactement** à chaque nouveau point $w_t$
- $\nabla E(w_t) = \frac{1}{n}\sum_{i=1}^n \nabla L_i(w_t)$
- Change car $w_t$ change

**SGD** :
- Gradient **estimé** à chaque nouveau point $w_t$ avec 1 échantillon
- $\nabla \tilde{E}(w_t) = \nabla L_k(w_t)$
- Change car $w_t$ change **ET** car $k$ change (échantillon aléatoire)

---

### En résumé

- Le gradient change à chaque itération
- Parce qu'on l'évalue à une nouvelle position $w_t$
- C'est vrai pour **Batch GD ET SGD**
- La différence : SGD ajoute du bruit via l'échantillonnage aléatoire



---

## 7. Fonction de Coût : Forme Générale

**Pour un seul echantillon** :
$L_i(w) = \text{loss}(y_i, f(x_i; w))$

**fonction de Coût avec régularisation** estimée sur tous les échantillons :
$E(w) = \frac{1}{n}\sum_{i=1}^n L_i(w) + \alpha R(w)$

**Composantes** :
- $L_i$ : Perte sur l'echantillon $i$
- $f(x; w)$ : Prédiction du modèle
- $R(w)$ : Régularisation (ex: $\|w\|^2$)
- $\alpha$ : Force de régularisation



---

## 8. Brève Histoire du SGD

- **1951** : Robbins & Monro - Fondements théoriques
- **1960s** : Widrow & Hoff - Adaline (apprentissage adaptatif)
- **1980s** : Réseaux de neurones + backpropagation
- **1995s** : ma these sur l'annulation d'echo 🤣🤣🤣
- **2010s** : Deep Learning - SGD devient incontournable
- **Aujourd'hui** : Variants optimisés (Adam, RMSprop, etc.)

---

## 9. Implémentation Moderne

**Frameworks optimisés** :
- TensorFlow / PyTorch : calcul GPU
- Scikit-learn : interface simple
- JAX : différentiation automatique

**Optimisations** :
- Vectorisation (NumPy, BLAS)
- Parallélisation sur GPU/TPU
- Calcul distribué

---

## 10. Apprentissage en Ligne (Online Learning)

**Principe** : Mise à jour après chaque observation

**Avantages** :
- Adaptation aux données changeantes
- Mémoire constante
- Traitement de flux continu

**Application** :
- Systèmes de recommandation
- Détection d'anomalies
- Trading algorithmique


**Principe** : Mise à jour des paramètres après chaque observation qui arrive

**Algorithme** :

À l'instant $t$, une nouvelle observation $(x_t, y_t)$ arrive :

1. **Prédiction** avec le modèle actuel :
   $$\hat{y}_t = f(x_t; w_t)$$

2. **Calcul de la perte** sur cette seule observation :
   $$L_t = L(y_t, \hat{y}_t)$$

3. **Mise à jour immédiate** des paramètres :
   $$w_{t+1} = w_t - \eta_t \nabla L_t(w_t)$$

**Différence avec SGD classique** :

| SGD Classique | Online Learning |
|---------------|-----------------|
| Dataset fixe, plusieurs epochs | Flux continu, une seule passe |
| $w_{t+1} = w_t - \eta \nabla L_k$ | $w_{t+1} = w_t - \eta_t \nabla L_t$ |
| $k$ tiré aléatoirement | Ordre d'arrivée des données |

**Learning rate adaptatif souvent utilisé** :
$$\eta_t = \frac{\eta_0}{1 + \lambda t}$$

où $t$ est le nombre d'observations vues

**Exemple - Régression linéaire online** :

Observation $(x_t, y_t)$ arrive :
$$w_{t+1} = w_t + \eta_t (y_t - w_t^T x_t) \cdot x_t$$

**Exemple - Moyenne mobile** :

Calculer la moyenne en ligne :
$$\mu_t = \mu_{t-1} + \frac{1}{t}(x_t - \mu_{t-1})$$


---

## 11. SGDRegressor : Paramètres Clés

```python
from sklearn.linear_model import SGDRegressor

model = SGDRegressor(
    loss='squared_error',      # Fonction de perte
    penalty='l2',              # Régularisation
    alpha=0.0001,              # Force régularisation
    learning_rate='invscaling', # Stratégie LR
    eta0=0.01,                 # LR initial
    max_iter=1000,             # Nb itérations
    tol=1e-3,                  # Critère arrêt
    early_stopping=True        # Arrêt anticipé
)
```

---

## 12. Influence du Taux d'Apprentissage

$$w_{t+1} = w_t - \eta \nabla L(w_t)$$

**$\eta$ trop grand** :
- Oscillations
- Divergence

**$\eta$ trop petit** :
- Convergence lente
- Minima locaux

**$\eta$ optimal** : Convergence rapide et stable

---

## 13. Stratégies de Learning Rate

**1. Constant** : $\eta_t = \eta_0$

**2. Décroissance temporelle** :
$$\eta_t = \frac{\eta_0}{1 + t \cdot d}$$

**3. Inverse scaling** :
$$\eta_t = \frac{\eta_0}{t^\alpha}$$

**4. Adaptatif** : Ajustement selon performance validation

---

## 14. Learning Rate Adaptatif

**Méthodes avancées** :

**AdaGrad** : Adapte $\eta$ par paramètre
$$\eta_t^{(i)} = \frac{\eta_0}{\sqrt{\sum_{\tau=1}^t (g_\tau^{(i)})^2 + \epsilon}}$$

**RMSprop** : Moyenne mobile des gradients

**Adam** : Combine momentum + adaptation
- Moyenne du gradient (moment d'ordre 1)
- Moyenne du gradient carré (moment d'ordre 2)

---

## 15. Batch vs Mini-Batch vs Stochastique

| Type | Taille échantillon | Caractéristiques |
|------|-------------------|------------------|
| **Batch GD** | Tous ($n$) | Stable, lent, grande mémoire |
| **Stochastic GD** | 1 | Rapide, bruité, converge |
| **Mini-Batch GD** | $m$ (ex: 32-256) | **Optimal** : vectorisation + stabilité |

**Formule mini-batch** :
$$w_{t+1} = w_t - \eta \frac{1}{m}\sum_{i=1}^m \nabla L_i(w_t)$$

---

## 16. Mini-Batch : Out-of-Core Learning

**Problème** : Dataset trop large pour la RAM

**Solution** : Charger les données par batch

```python
for epoch in range(n_epochs):
    for batch in data_loader:
        gradient = compute_gradient(batch)
        weights -= learning_rate * gradient
```

**Applications** : Big Data, streaming

---

## 17. Régularisation L1 (Lasso)

$$R(w) = \|w\|_1 = \sum_{i=1}^d |w_i|$$

**Effet** : Sélection de variables (sparsité)

**Gradient sous-différentiel** :
$$\frac{\partial R}{\partial w_i} = \text{sign}(w_i)$$

**Usage** : Features redondantes, interprétabilité

---

## 18. Régularisation L2 (Ridge)

$$R(w) = \|w\|_2^2 = \sum_{i=1}^d w_i^2$$

**Effet** : Réduction de tous les poids

**Gradient** :
$$\frac{\partial R}{\partial w_i} = 2w_i$$

**Mise à jour** :
$$w_{t+1} = (1 - 2\eta\alpha)w_t - \eta \nabla L(w_t)$$

---

## Pourquoi L1 → Sparsité (sélection de variables) ?

### 1. Forme de la régularisation

**L1 (Lasso)** :

$$R(w) = \|w\|_1 = \sum_{i=1}^d |w_i|$$

**L2 (Ridge)** :

$$R(w) = \|w\|_2^2 = \sum_{i=1}^d w_i^2$$



### 2. Gradient / Sous-gradient

**L1** : Gradient constant (en valeur absolue)

$$\frac{\partial |w_i|}{\partial w_i} = \begin{cases}
+1 & \text{si } w_i > 0 \\
-1 & \text{si } w_i < 0 \\
[-1, 1] & \text{si } w_i = 0
\end{cases}$$

**L2** : Gradient proportionnel à $w$

$$\frac{\partial w_i^2}{\partial w_i} = 2w_i$$

---

### 3. Mise à jour des poids

**Avec L1** :

$$w_{t+1} = w_t - \eta(\nabla L + \alpha \cdot \text{sign}(w_t))$$

➜ On retire une **quantité constante** $\eta \alpha$ à chaque itération
➜ Les petits poids arrivent rapidement à **zéro exact**

**Avec L2** :

$$w_{t+1} = w_t - \eta(\nabla L + 2\alpha w_t) = (1-2\eta\alpha)w_t - \eta \nabla L$$

➜ On multiplie par $(1-2\eta\alpha)$
➜ Les poids diminuent mais n'atteignent **jamais zéro** (décroissance exponentielle)

---

### 4. Visualisation géométrique

**Contrainte L1** : $\|w_1\| + \|w_2\| \leq t$ → forme un **losange**

**Contrainte L2** : $w_1^2 + w_2^2 \leq t$ → forme un **cercle**

Quand les contours de la fonction de coût rencontrent la contrainte :
- **L1** : Rencontre souvent aux **coins** (axes) → un poids = 0
- **L2** : Rencontre n'importe où sur le cercle → pas de zéro

[Imagine un graphique 2D avec contours et contraintes]


### Conclusion

- **L1 met des poids à zéro** → Sélection automatique de variables
- **L2 réduit tous les poids** → Pas de sélection, juste réduction

---

## 19. Régularisation Elastic Net

**Combinaison L1 + L2** :

$$R(w) = \rho \|w\|_1 + \frac{1-\rho}{2}\|w\|_2^2$$

**Avantages** :
- Sélection de variables (L1)
- Stabilité (L2)
- $\rho \in [0,1]$ contrôle le mix

```python
SGDRegressor(penalty='elasticnet',
             l1_ratio=0.5)
```

---

## 20. Comment Régulariser le SGD

**Paramètres Scikit-learn** :

```python
SGDRegressor(
    penalty='l2',        # 'l1', 'l2', 'elasticnet'
    alpha=0.0001,        # Force régularisation
    l1_ratio=0.15        # Si elasticnet
)
```

**Impact** :
- Prévient le sur-apprentissage
- Améliore la généralisation
- Stabilise l'entraînement

---

## 21. Early Stopping (Arrêt Anticipé)

**Principe** : Arrêter l'entraînement avant la fin si pas d'amélioration

**Algorithme** :
1. Diviser : train / validation
2. À chaque époque : évaluer sur validation
3. Si pas d'amélioration pendant $p$ époques : **STOP**

**Implémentation** :
```python
SGDRegressor(
    early_stopping=True,
    validation_fraction=0.1,
    n_iter_no_change=5
)
```

---

## 22. SGDRegressor : Exemple Complet

```python
from sklearn.linear_model import SGDRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

# Normalisation
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Division
X_train, X_val, y_train, y_val = train_test_split(
    X_scaled, y, test_size=0.2
)

# Modèle
sgd = SGDRegressor(
    loss='squared_error',
    penalty='l2',
    alpha=0.001,
    learning_rate='adaptive',
    eta0=0.01,
    early_stopping=True
)

sgd.fit(X_train, y_train)
```

---

## 23. Vue d'Ensemble des Optimiseurs

**SGD classique** : $w_t = w_{t-1} - \eta \nabla L$

**SGD + Momentum** :
$$v_t = \beta v_{t-1} + \nabla L$$
$$w_t = w_{t-1} - \eta v_t$$

**Nesterov** : Momentum anticipé

**AdaGrad** : LR adaptatif par paramètre

**RMSprop** : Moyenne mobile du gradient carré

---

## 24. Optimiseurs Avancés

**Adam** (Adaptive Moment Estimation) :
- Combine momentum + adaptation
- Très populaire en Deep Learning

**AdamW** : Adam avec weight decay découplé

**Nadam** : Nesterov + Adam

**RAdam** : Warmup automatique

**Choisir** : Adam par défaut, SGD+momentum si besoin de généralisation

---

## 25. Comparaison des Optimiseurs

| Optimiseur | Vitesse | Stabilité | Généralisation | Usage |
|------------|---------|-----------|----------------|-------|
| SGD | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | Classique |
| SGD+Momentum | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | Recommandé |
| Adam | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | Deep Learning |
| RMSprop | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | RNN |

---

## 26. Momentum : Intuition

**Problème SGD** : Oscillations dans les ravins

**Solution** : Accumuler la "vitesse"

$$v_t = \beta v_{t-1} + (1-\beta) \nabla L_t$$
$$w_t = w_{t-1} - \eta v_t$$

**Effet** :
- Accélération dans directions constantes
- Amortissement des oscillations
- $\beta \in [0.9, 0.99]$ typiquement

---

## 27. Diagnostic de Convergence

**Courbes d'apprentissage** :
- Loss training vs validation
- Détection sur/sous-apprentissage

**Signes de problèmes** :
- Loss qui explose → $\eta$ trop grand
- Plateau précoce → $\eta$ trop petit ou minimum local
- Gap train/val → sur-apprentissage

---

## 28. Hyperparamètres : Réglage

**Stratégies** :

1. **Grid Search** : Test exhaustif
2. **Random Search** : Échantillonnage aléatoire
3. **Bayesian Optimization** : Recherche intelligente

**Paramètres critiques** :
- Learning rate $\eta$
- Coefficient régularisation $\alpha$
- Taille mini-batch $m$

---

## 29. Astuces Pratiques

cas general

- **Toujours normaliser** : StandardScaler ou MinMaxScaler
- **Mélanger les données** : shuffle=True
- **Monitoring** : Verbose pour suivre la convergence
- **Warmup** : Commencer avec petit LR

deep learning

- **Gradient clipping** : Éviter explosions (Deep Learning)
- **Checkpointing** : Sauvegarder meilleur modèle

---

## 30. Limitations du SGD

**Choix du Learning Rate** : Sensible, difficile à optimiser

**Minima locaux** : Peut rester coincé (fonctions non-convexes)

**Saddle points** : Ralentit près des points-selle

**Scaling** : Sensible à l'échelle des features

**Solution** : Optimiseurs adaptatifs (Adam, etc.)

---

## 31. Quand Utiliser SGD ?

**SGD convient si** :
- Grands datasets (millions d'exemples)
- Apprentissage en ligne nécessaire
- Mémoire limitée (out-of-core)
- Modèles linéaires ou convexes

**Alternatives** :
- Petits datasets → Batch methods (BFGS, L-BFGS)
- Deep Learning → Adam, AdamW
- Arbres → Gradient Boosting

---

## 32. Extensions du SGD

**Variance Reduction** :
- SVRG (Stochastic Variance Reduced Gradient)
- SAGA
- Réduisent le bruit du gradient stochastique

**Second-ordre** :
- Newton stochastique
- Utilise information de courbure (Hessienne)

**Distribué** :
- Parallélisation sur plusieurs machines
- Hogwild!, AllReduce

---

## 33. SGD en Deep Learning

**Particularités** :
- Milliers/millions de paramètres
- Fonctions fortement non-convexes
- Backpropagation pour calcul gradient

**Best Practices** :
- Mini-batch 32-256
- Learning rate schedule
- Batch normalization
- Dropout comme régularisation supplémentaire

---

## 34. Références et Ressources

**Papers fondateurs** :
- Robbins & Monro (1951) : Méthode stochastique
- Bottou (2010) : Large-Scale Machine Learning

**Documentation** :
- Scikit-learn SGD User Guide
- PyTorch Optimizers
- Deep Learning Book (Goodfellow et al.)

**Cours** :
- Stanford CS229 (Machine Learning)
- Fast.ai (Deep Learning)

---

## 35. Conclusion

**SGD = Outil fondamental du Machine Learning**

**Points clés** :

- Approximation stochastique du gradient
- Efficace sur grandes données
- Nombreux variants optimisés
- Toujours normaliser et régulariser
- Choisir l'optimiseur selon le problème

**Recommandation** : Commencer avec SGD+momentum ou Adam


