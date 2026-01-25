---
layout: default_en
title: "Du ML aux LLMs"
slides_project_home: /ml2llm/
footer: 'Huggingface'
---

# Huggingface

2 librairies principales : [datasets](https://github.com/huggingface/datasets) et [transformers](https://github.com/huggingface/transformers)


**datasets** : compatible pytorch, tensorflow, Jax -> retourne des tenseurs PyTorch ou TensorFlow

**transformers** :
- API unifiée pour charger, entraîner et déployer des modèles sur différents frameworks (Pytorch, tensorflow, Jax)
- fournit des modèles pré-entraînés.

Ces modèles peuvent être fine-tunés pour des tâches spécifiques. Ca permte d'obtenir de bonnes performances  sans devoir entraîner un modèle à partir de zéro.

La librairie inclut également des outils pour la tokenization. Chqaue modele a son propre tokenizer.

---
# Structure d'un modele dans pytorch

```python
import torch
from torch.utils.data import Dataset, DataLoader

class CustomDataset(Dataset):
    def __init__(self, data, targets):
        self.data = data
        self.targets = targets

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        return self.data[idx], self.targets[idx]

class SimpleNN(torch.nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(SimpleNN, self).__init__()
        self.layer1 = torch.nn.Linear(input_size, hidden_size)
        self.relu = torch.nn.ReLU()
        self.layer2 = torch.nn.Linear(hidden_size, output_size)

    def forward(self, x):
        x = self.layer1(x)
        x = self.relu(x)
        x = self.layer2(x)
        return x

    def predict(self, x):
        self.eval()  # Met le modèle en mode évaluation
        with torch.no_grad():  # Désactive le calcul du gradient
            x = torch.from_numpy(x).float()  # Convertit en tenseur (si nécessaire)
            predictions = self.forward(x)  # Effectue le passage vers l'avant
        return predictions.numpy()  # Convertit en numpy (si nécessaire)
```

ou `torch.nn` est [Base class](https://docs.pytorch.org/docs/stable/generated/torch.nn.Module.html) for all neural network modules.


#### Exemple d'utilisation
```python
data = torch.randn(100, 10)  # 100 échantillons, 10 caractéristiques
targets = torch.randint(0, 2, (100,))  # 100 cibles, 0 ou 1

dataset = CustomDataset(data, targets)
dataloader = DataLoader(dataset, batch_size=32, shuffle=True)

model = SimpleNN(input_size=10, hidden_size=5, output_size=2)
```



**CustomDataset** : cette classe gère le chargement et le traitement des données.
- __init__ initialise les données et les cibles,
- __len__ renvoie la taille de l’ensemble de données
- __getitem__ récupère un élément de données à un index donné.

**SimpleNN** : simple réseau neuronal avec une couche cachée.
- `__init__` définit les couches,
- `forward` définit le flow des données à travers le réseau. ordre d'execution réel.

**DataLoader** : automatise le regroupement des données, le mélange et le chargement par batch pour l’entraînement.


---
# Exemple : Analyse de sentiments avec DistilBERT sur les IMDB movie reviews

### avec transformers et datasets

- [model_doc/distilbert](https://huggingface.co/docs/transformers/model_doc/distilbert)
- [distilbert](https://huggingface.co/distilbert)

DistilBERT est pré-entraîné par distillation de connaissances pour créer un modèle plus petit avec une inférence plus rapide et nécessitant moins de calcul pour l'entraînement.


## Distillation

- on reduit drastiquement la dimension du modele.
- on re-entraine le modele en prenant le model original comme tuteur. le tuteur fait de l'inference. on se base sur l'output du tuteur pour entrainer le modele simplifié.
- on obtient 90% - 95% des performances initiales avec un modele plus simple sur des taches plus centrees, plsu specifiques.

# Workflow typique d'une tâche NLP :

Les données
- 1:  **Charger les données** avec la librairie `datasets`
- 2:  **Préparer les données**: filtrer, modifier et splitter le dataset en training, validation, test

Choisir le modele
- 3:  **Tokenizer les données :** avec le tokenizer de  `transformers`, spécifiques au modèle
- 4:  **Charger le modèle :** Charger un modèle pré-entraîné et adapté à la tâche NLP spécifique (par ex., classification de texte, question-réponse, langue, casing).

training

- 5:  **Entraîner le modèle :** Fine-tuner le modèle pré-entraîné sur les données d'entraînement. Classe `Trainer` de `transformers`, arguments : batch size, learning rate, epoch, etc.

Evaluation etc:

- 6:  **Évaluer le modèle**
- 7:  **Déployer et utiliser**


## Loader un modele: `from_pretrained` vs `from_config`

2 façons de charger un modèle :

`from_pretrained(pretrained_model_name_or_path, **kwargs)` :
- charge un modèle pré-entraîné et sa configuration à partir d'un nom de modèle (par ex., `"bert-base-uncased"`).
- on obtient les poids du modele deja entraine. on peut le fine tuner ou lultiser comme tel.

`from_config(config, **kwargs)` :
- initialise un modèle à partir d'un objet configuration.
- L'argument `config` est une instance d'une classe de configuration (par ex., `BertConfig`, `GPT2Config`) qui spécifie l'architecture du modèle, la taille et d'autres paramètres.
- Le modèle est initialisé avec des poids aléatoires basés sur la configuration.
- On n'obtient pas les poids : l'objectif étant d'entrainer le modele integralement.


# Code

> [Notebook sur Google Colab avec T4 free tier](https://colab.research.google.com/drive/143lmW5fO3Auze8i8zt5-kWKvbjo0JkJ_#scrollTo=NUpFARa0DqdI)



### Charger les données

```python
import numpy as np
import torch

from datasets import load_dataset

# Charger le dataset IMDb
dataset = load_dataset('imdb')

# Splitter le dataset
train_dataset = dataset['train']
test_dataset = dataset['test']
```

### Tokenizer (2mn)

[DistilBertTokenizerFast](https://huggingface.co/transformers/v3.4.0/model_doc/distilbert.html?highlight=distilberttokenizerfast#distilberttokenizerfast) derivé de [BertTokenizer](https://huggingface.co/transformers/v3.4.0/model_doc/bert.html#transformers.BertTokenizer)

```python
# tokenizer
from transformers import DistilBertTokenizerFast

# Initialiser le tokenizer
tokenizer = DistilBertTokenizerFast.from_pretrained('distilbert-base-uncased')

# Tokenizer les datasets
def tokenize_function(examples):
    """applique le tokenizer à chaque exemple dans le dataset.
    - truncation=True assure que les séquences plus longues que max_length sont tronquées,
    - padding='max_length' remplit les séquences plus courtes à la même longueur.
    """

    return tokenizer(
        examples["text"],
        truncation=True,
        padding="max_length",
        max_length=128
    )

#  appliquer le tokenizer
train_dataset = train_dataset.map(tokenize_function, batched=True)
test_dataset = test_dataset.map(tokenize_function, batched=True)

train_dataset = train_dataset.remove_columns(["text"])
test_dataset = test_dataset.remove_columns(["text"])

train_dataset = train_dataset.rename_column("label", "labels")
test_dataset = test_dataset.rename_column("label", "labels")

train_dataset.set_format("torch")
test_dataset.set_format("torch")
```

### Modèle

```python
# Charger le modèle DistilBERT pré-entraîné pour la classification de séquences
# num_labels=2 spécifie que nous avons deux classes (sentiments positif et négatif).

from transformers import DistilBertForSequenceClassification

model = DistilBertForSequenceClassification.from_pretrained(
        'distilbert-base-uncased',
        num_labels=2
    )
```

On peut voir la structure du modele avec : `print(model)`

```python
DistilBertForSequenceClassification(
  (distilbert): DistilBertModel(
    (embeddings): Embeddings(
      (word_embeddings): Embedding(30522, 768, padding_idx=0)
      (position_embeddings): Embedding(512, 768)
      (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
      (dropout): Dropout(p=0.1, inplace=False)
    )
    (transformer): Transformer(
      (layer): ModuleList(
        (0-5): 6 x TransformerBlock(
          (attention): DistilBertSdpaAttention(
            (dropout): Dropout(p=0.1, inplace=False)
            (q_lin): Linear(in_features=768, out_features=768, bias=True)
            (k_lin): Linear(in_features=768, out_features=768, bias=True)
            (v_lin): Linear(in_features=768, out_features=768, bias=True)
            (out_lin): Linear(in_features=768, out_features=768, bias=True)
          )
          (sa_layer_norm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
          (ffn): FFN(
            (dropout): Dropout(p=0.1, inplace=False)
            (lin1): Linear(in_features=768, out_features=3072, bias=True)
            (lin2): Linear(in_features=3072, out_features=768, bias=True)
            (activation): GELUActivation()
          )
          (output_layer_norm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
        )
      )
    )
  )
  (pre_classifier): Linear(in_features=768, out_features=768, bias=True)
  (classifier): Linear(in_features=768, out_features=2, bias=True)
  (dropout): Dropout(p=0.2, inplace=False)
)
```

Le modele est entierement defini dans la repo de huggingface

[https://github.com/huggingface/transformers/blob/main/src/transformers/models/distilbert/modeling_distilbert.py](https://github.com/huggingface/transformers/blob/main/src/transformers/models/distilbert/modeling_distilbert.py)



### Métriques d'évaluation

```python
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
# Définir les métriques d'évaluation
def compute_metrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)
    precision, recall, f1, _ = precision_recall_fscore_support(labels, preds, average='binary')
    acc = accuracy_score(labels, preds)
    return {
        'accuracy': acc,
        'f1': f1,
        'precision': precision,
        'recall': recall
    }
```


### Entraînement

[Trainer](https://huggingface.co/docs/transformers/main_classes/trainer)


```python
# Définir les arguments d'entraînement
# configure le processus d'entraînement, incluant : répertoire de sortie, le nombre d'epochs, bacth size, learning rate.

from transformers import Trainer, TrainingArguments

training_args = TrainingArguments(
    output_dir='./results',
    num_train_epochs=2,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=64,
    warmup_steps=500,
    weight_decay=0.01,

    logging_dir='./logs',
    logging_strategy="steps",   # log based on steps
    logging_steps=1,            # log every step
    log_level="info",           # increase verbosity
    report_to="none",           # disable WandB etc. if enabled by default

    evaluation_strategy="steps",  # optional: evaluate more often
    eval_steps=50,                # evaluate every 50 steps
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset,
    compute_metrics=compute_metrics,
)

trainer.train()
```

### Évaluation

```python
# Évaluer le modèle
trainer.evaluate()
```

### TrainingArguments


Une classe dans la librairie `transformers` qui encapsule une large gamme de paramètres et configurations pour le processus d'entraînement.

Mais les parametres dépendents
- de la version de trasnformer
- du format / plateforme : pytorch, tensorflow, jax

Au final, plus compliqué de génerer du code qui tourne et qui soit utilisable en regard des contraintes des ressources que de travailler avec scikit-learn.



`TrainingArguments` inclut des paramètres contrôlant :

*   **Sortie et Logging :**
    *   `output_dir` : Le répertoire où le modèle entraîné, les checkpoints et les logs seront sauvegardés.
    *   `logging_dir` : Le répertoire pour stocker les logs d'entraînement.
    *   `logging_steps` : La fréquence à laquelle enregistrer les informations d'entraînement.
    *   `save_steps` : La fréquence à laquelle sauvegarder les checkpoints du modèle.
    *   `report_to` : Intégrations à utiliser pour le tracking des expériences et le logging (par ex., "wandb", "tensorboard").

*   **Hyperparamètres d'entraînement :**
    *   `num_train_epochs` : Le nombre total d'epochs d'entraînement.
    *   `per_device_train_batch_size` : La taille du batch par GPU/TPU core pendant l'entraînement.
    *   `per_device_eval_batch_size` : La taille du batch pour l'évaluation.
    *   `learning_rate` : Le taux d'apprentissage pour l'optimizer.
    *   `weight_decay` : La décroissance des poids pour la régularisation.
    *   `warmup_steps` : Le nombre d'étapes pour le warmup du taux d'apprentissage.
    *   `gradient_accumulation_steps` : Le nombre d'étapes de mise à jour à accumuler avant de faire une passe backward/update.

*   **Évaluation :**
    *   `evaluation_strategy` : La stratégie d'évaluation à utiliser ("no", "steps" ou "epoch").
    *   `eval_steps` : La fréquence à laquelle évaluer le modèle (si `evaluation_strategy` est "steps").

*   **Optimisation :**
    *   `optim` : L'optimizer à utiliser (par ex., "adamw", "adamw_torch").
    *   `lr_scheduler_type` : Le learning rate scheduler à utiliser (par ex., "linear", "cosine").

*   **Autres :**
    *   `seed` : Graine aléatoire pour la reproductibilité.
    *   `fp16` : Utiliser ou non l'entraînement en mixed-precision.
    *   `push_to_hub` : Pousser ou non le modèle vers le Hugging Face Model Hub après l'entraînement.



`TrainingArguments` est *typiquement* utilisé quand vous utilisez la classe `Trainer` dans `transformers`. La classe `Trainer` est une abstraction de haut niveau qui simplifie la boucle d'entraînement, et elle dépend de `TrainingArguments` pour configurer le processus d'entraînement.


---

Implementation sur Google Colab avec T4 free tier

[Notebook](https://colab.research.google.com/drive/143lmW5fO3Auze8i8zt5-kWKvbjo0JkJ_#scrollTo=NUpFARa0DqdI)


---

# Tuning des hyperparamètres


**1. Commencer avec les valeurs par défaut**

*   **Utiliser des valeurs par défaut sensées :** Commencer avec les valeurs par défaut fournies dans `TrainingArguments`
*   **Se concentrer sur les hyperparamètres clés :** incluent généralement :
    *   `learning_rate` : Crucial pour la vitesse et la convergence de l'entraînement.
    *   `per_device_train_batch_size` : Affecte la vitesse d'entraînement et l'utilisation de la mémoire.
    *   `num_train_epochs` : Détermine combien de fois le modèle voit l'ensemble du dataset.
    *   `weight_decay` : Contrôle la régularisation et prévient le surapprentissage.

**Ajuster un à la fois (ou quelques uns) :** Changer un ou un petit groupe d'hyperparamètres en gardant les autres constants. Cela aide à isoler l'effet de chaque paramètre sur la performance du modèle.

**2. Tuning du learning rate**

*   **Test de plage du learning rate :** Lancer un court entraînement en augmentant graduellement le learning rate. Tracer `loss` vs  `learning rate`. Le learning rate optimal est autour du point où la loss commence à augmenter rapidement.
*   **Learning rate schedulers :** Expérimenter avec différents learning rate schedulers (par ex., `linear`, `cosine`, `polynomial`). Ces schedulers ajustent dynamiquement le learning rate pendant l'entraînement.

**3. Tuning de la taille du batch**

*   **Maximiser la taille du batch :** Essayer d'utiliser la plus grande taille de batch que votre hardware (GPU/TPU) peut accommoder sans manquer de mémoire. Des batch sizes plus larges conduisent souvent à un entraînement plus stable et une convergence plus rapide.
*   **Trade-offs :** Mais des batch sizes très grands peuvent nuire à la performance de généralisation. convergence trop rapide et lissage trop grand qui empeche de trouver es minima locaux plus profonds.

**4. Régularisation (Weight Decay, Dropout)**

*   **Expérimenter avec le weight decay :** Ajuster le paramètre `weight_decay` pour contrôler la régularisation L2.
*   **Dropout :** si le modèles offre des couches dropout.

**5. Optimisation automatique des hyperparamètres**

*   **Optuna, Ray Tune ou similaire :**
*   **Intégration Hugging Face Trainer :**

**6. Monitoring et évaluation**

*   **Suivre les métriques :** Soigneusement monitorer les métriques pertinentes pendant l'entraînement et la validation (par ex., loss, accuracy, F1-score).
*   **Visualisation :** Utiliser des outils comme TensorBoard ou Weights & Biases pour visualiser la progression de l'entraînement .
*   **Early stopping :** Implémenter l'early stopping pour prévenir le surapprentissage.

**7. Considérer la taille du dataset**

*   **Petits datasets :** Pour les petits datasets, une régularisation agressive (weight decay élevé, dropout) et des modèles plus petits pourraient être bénéfiques pour prévenir l'overfit.
*   **Grands datasets :** Pour les grands datasets, utiliser des modèles plus larges, moins de régularisation.

**En résumé**

1.  Commencer avec les valeurs par défaut.
2.  Se concentrer d'abord sur le learning rate, la taille du batch et la régularisation.
3.  Tuner un ou quelques hyperparamètres à la fois.
4.  Utiliser l'optimisation automatique pour un tuning plus avancé.
5.  Monitorer les métriques et utiliser l'early stopping.
6.  Considérer la taille de votre dataset.


# Comment accelerer l'entraînement ?


1.  **Data Optimization:**
    *   **Dataset Size Reduction:** If possible, reduce the size of your dataset. Experiment with using a smaller subset of the data for initial training and hyperparameter tuning. Once you have a good configuration, you can train on the full dataset.
    *   **Data Type Optimization:** Ensure that your dataset uses the most efficient data types. For example, if your labels are 0 and 1, use an `int8` or `bool` data type instead of `int64`.
2.  **Model Selection:**
    *   **Smaller Model:** Use a smaller, faster pre-trained model like DistilBERT or MobileBERT instead of larger models like BERT or RoBERTa. Smaller models have fewer parameters, which translates to faster training and inference.
3.  **Batch Size Optimization:**
    *   **Maximize Batch Size:** Increase the `per_device_train_batch_size` and `per_device_eval_batch_size` as much as your Colab's TP4 memory allows. Experiment to find the largest batch size that doesn't cause out-of-memory errors. Larger batch sizes can significantly speed up training.
    *   **Gradient Accumulation:** If you can't fit a large batch size into memory, use `gradient_accumulation_steps`. This simulates a larger batch size by accumulating gradients over multiple smaller batches before performing a weight update.
4.  **Training Optimization:**
    *   **Mixed Precision Training (FP16):** Enable mixed-precision training by setting `fp16=True` in your `TrainingArguments`. This uses lower-precision floating-point numbers, which can significantly speed up training on TPUs.
    *   **Gradient Checkpointing:** If memory is still a bottleneck, try using gradient checkpointing. This trades off some computation for memory savings by recomputing activations during the backward pass. Look for a `gradient_checkpointing` option in your model's configuration or Trainer.
    *   **Reduce Epochs:** Start with a smaller number of training epochs and monitor the validation loss. Stop training early if the model starts to overfit.
    *   **Learning Rate Tuning:** Optimize your learning rate. Use a learning rate finder or experiment with different learning rate schedules. A well-tuned learning rate can lead to faster convergence.
5.  **TPU Utilization:**
    *   **Ensure TPU Utilization:** Monitor TPU utilization during training. If the TPU is not being fully utilized, it indicates a bottleneck elsewhere in your pipeline (e.g., data loading).
6.  **Data Loading Optimization:**
    *   **`datasets` Caching:** The `datasets` library automatically caches datasets to disk. Make sure you have enough disk space on your Colab instance to store the cached dataset.
    *   **Efficient Data Loading:** Ensure that your data loading pipeline is efficient. Avoid unnecessary data conversions or transformations.
    *   **Parallel Data Loading:** Use the `num_workers` argument in the `DataLoader` to load data in parallel.
7.  **Code Optimization:**
    *   **Profile Your Code:** Use profiling tools to identify any bottlenecks in your code.
    *   **Optimize Loops:** If you have any custom loops in your code, make sure they are optimized for performance.
8.  **Regularly Restart Colab:**
    *   **Memory Leaks:** Google Colab can sometimes experience memory leaks. Regularly restarting the Colab runtime can help free up memory and improve performance.
9.  **Use a Faster Tier (If Possible):**
    *   **Colab Pro/Pro+:** If you need even faster training, consider subscribing to Colab Pro or Pro+. These tiers offer access to more powerful GPUs and TPUs, as well as more memory.

**In Summary:** Focus on reducing model size, maximizing batch size (with gradient accumulation if needed), enabling mixed-precision training, optimizing data loading, and tuning the learning rate.
