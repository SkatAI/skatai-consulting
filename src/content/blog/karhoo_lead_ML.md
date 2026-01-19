---
title: "Scaling Real-Time Global Taxi Pricing with AutoML at Karhoo"
date: 2023-08-01
author: Alexis Perrier
tags: [AutoML, Vertex AI, MLOps, Big Query, Google Cloud]
description: "At Karhoo, I led pricing and forecasting for a global taxi marketplace operating in real time across multiple continents. Facing accuracy ceilings and scaling limits with bespoke scikit-learn random forest models, we benchmarked and migrated to Vertex AI AutoML on GKE, with feature pipelines in BigQuery and automated model promotion. The transition delivered significantly higher prediction performance, lower infrastructure and operational costs, built-in drift handling, and greater flexibility for global rollout under strict latency constraints."
---
### Scaling real-time taxi pricing with AutoML at global marketplace scale

I led pricing, coverage optimization, and cancellation forecasting for a global taxi marketplace operating across Asia, Europe, South America, and the US. The platform was white-labelled and embedded in larger travel flows (e.g. train booking → last-mile ride), which meant pricing predictions were the **very first value shown to users**. Accuracy and latency were therefore critical: pricing was computed in real time, under strict API latency constraints, to avoid saturating downstream taxi fleet systems.

I joined as Lead Data Scientist, managing a team of three data scientists, working fully remote across multiple countries, and took ownership of technical direction and delivery. I inherited a production system based on bespoke scikit-learn random forest models running on GKE, with features computed in BigQuery.

### Initial state and limitations

The existing models were struggling on multiple fronts. Accuracy had reached a clear ceiling, partly due to poor hyperparameterization and limited feature interactions, but also because the system did not scale well as coverage expanded globally. Retraining, monitoring, and iteration were costly in both time and infrastructure. While the stack was functional, it was brittle, and improvements were incremental at best.

Given the scale of the data (multi-region, high-volume BigQuery tables, real-time inference), it became clear that continuing to fine-tune bespoke models would not unlock the next performance step.

### Migration to Vertex AI AutoML

We benchmarked our existing random forests against Vertex AI AutoML. The result was unambiguous: **AutoML significantly outperformed our bespoke models**, almost immediately, without complex manual tuning.

We migrated pricing models to Vertex AI AutoML, keeping feature computation fully in BigQuery and integrating the models into an MLOps pipeline with automated training, promotion, and deployment. Models were promoted automatically after validation, with drift handled natively through Vertex AI monitoring. MLflow was retained for experiment tracking and lineage.

### Results

The gains came from multiple dimensions at once:
– Better feature handling and interaction discovery
– Systematic hyperparameter optimization
– Infrastructure-level efficiency at training and inference time

The outcome was **higher prediction accuracy, lower operational costs, and much greater flexibility** in retraining and rollout. Latency remained compatible with real-time pricing requirements.

### Real-world edge cases

Operating globally surfaced non-obvious pricing behaviors that no generic model handles “for free”. In New York City, prices jumped sharply when routes included toll highways at specific times, because toll pricing itself is time-dependent. In Italy, pricing depended on the taxi’s garage base, which is unknown at booking time, introducing irreducible uncertainty. These cases required pragmatic acceptance of model limits rather than over-engineering brittle heuristics.

### Lessons for CTOs

AutoML works at scale. In hindsight, we should have adopted it earlier. The key is not replacing engineering discipline with automation, but **pairing AutoML with strong MLOps, clean data pipelines, and clear latency constraints**. When those foundations are in place, AutoML can outperform hand-rolled models while reducing cost and cognitive load on teams.

Dense systems still need good engineers. AutoML simply lets them focus on the problems that actually matter.

