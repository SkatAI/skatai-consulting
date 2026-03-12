---
title: "Large Data with Scikit-learn - Boston Meetup"
date: 2016-03-16
author: Alexis Perrier
description: "Slides for the Boston Data Science Meetup on batch processing with scikit-learn"
tags: [Meetup, Large Data]
image: /images/blog/ooc-boston/accuracy_100_samples.png
layout: slides
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/vMlhynqoQFg?ecver=1" frameborder="0" allowfullscreen></iframe>

<section data-markdown style="text-align: left;">

### Large Data with Scikit-learn

* Alexis Perrier - [@alexip](https://twitter.com/alexip)

* Data & Software - [@BerkleeOnline](https://twitter.com/berkleeonline) - Day

* Data Science contributor - [@ODSC](https://twitter.com/odsc) - Night

</section>

<section data-markdown style="text-align: left;">

### Plan

1) What is large data?

out-of-core, streaming, online, batch?

2) Algorithms

3) Implementation

4) Examples

<!-- 5) Dask -->

</section>

<section data-markdown style="text-align: left;">
    <script type="text/template">
    <!-- .slide: data-background="#FFFFFF" -->

### What is Large Data?

Cannot fit in the main memory (RAM)

> 2-10Gb makes the computer swap too much. Slow!

**From in-memory to on-disk**

* Being able to work with data that fits on disk on a single machine with no cluster


</script>

</section>

<section data-markdown style="text-align: left;">
### Many great alternatives

* Dato: [GraphLab create](https://dato.com/products/create/)
* [H20.ai](https://www.h2o.ai/)
* memory optimized [AWS instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html)
* [pySpark MLlib](https://spark.apache.org/docs/1.6.0/api/python/pyspark.mllib.html)
* Text: [Gensim](https://radimrehurek.com/gensim/tutorial.html) [py]
* R: [SGD streaming package](https://github.com/airoldilab/sgd)

</section>

<section data-markdown style="text-align: left;">
### Terminology


* **Out-of-core / External memory**

Data does not fit in main memory => access data stored in slow data store (disk, ...), slower (10x, 100x)

* **Offline**: all the data is available from the start


* **Online**: Serialized. Same results as **offline**. Act on new data right away

* **Streaming** Serialized. limited number of passes over the data, can postpone processing. "old" data is of less importance.

* **Minibatch**, Serialized in blocks

* **Incremental** = online + minibatch

https://stats.stackexchange.com/questions/22439/incremental-or-online-or-single-pass-or-data-stream-clustering-refers-to-the-sam

</section>

<section data-markdown style="text-align: left;">

clf = Some Model or Transformation

- Train on training data X_train, y_train
> clf.**fit**(X_train,y_train)

- Predict on test data: X_test => y_test
> y_test = clf.**predict**(X_test)

- Assess model performance on test: y_truth, vs y_test
> clf.**score**(y_truth, y_test, metric = ...)

- Predict on new data: \\( \hat{y}  = clf.predict(X_{new}) \\)


</section>

<section data-markdown style="text-align: left;">
### Scikit-learn: out-of-core

* Split the training data in blocks: mini-batch (sequential, random, ...)

* Load each block in sequence

* Train the model adaptively on each block

* Convergence!

</section>

<section data-markdown style="text-align: left;">
### Scikit-learn minibatch learning

* Batch size **n**
* split the data in **N** blocks
* **.partial_fit** instead of **.fit**

> clf.**partial_fit**(X_train(i),y(i), all_classes)

* All possible classes given to partial_fit on first call
* i = 1..N number of blocks

</section>

<section data-markdown style="text-align: left;">
### Scikit: Implementation
Implementation with generators

<a href="/images/blog/ooc-boston/generator.py" target=_blank>
    Generator code
</a>


[better example](https://adventuresindatascience.wordpress.com/2014/12/30/minibatch-learning-for-large-scale-data-using-scikit-learn/)

</section>


<section data-markdown style="text-align: left;">

# II Algorithms
</section>



<section data-markdown style="text-align: left;">
    <script type="text/template">
    <!-- .slide: data-background="#FFFFFF" -->


### Algorithms


<table cellpadding=5>
    <tr>
        <td></td>
        <td>Regression</td>
        <td>Classification</td>
    </tr>
    <tr>
        <td>Stochastic Gradient (1)</td>
        <td>X</td>
        <td>X</td>
    </tr>
    <tr>
        <td>Naive Bayes (2)</td>
        <td></td>
        <td>X</td>
    </tr>
</table>



(1) SG + PassiveAggressive + Perceptron (clf only)

(2) NB: MultinomialNB, BernoulliNB

<table cellpadding=5>
    <tr>
        <td></td>
        <td>Clustering</td>
        <td>Decomposition</td>
    </tr>
    <tr>
        <td>MiniBatchKMeans</td>
        <td>X</td>
        <td>X</td>
    </tr>
    <tr>
        <td>DictionaryLearning, PCA</td>
        <td> </td>
        <td>X</td>
    </tr>
</table>

</script>
</section>

<section data-markdown style="text-align: left;">

    <script type="text/template">
    <!-- .slide: data-background="#FFFFFF" -->

**Stochastic Gradient - Wiener filtering**

<p  style="text-align:center;">
    <img src="/images/blog/ooc-boston/weiner-filtering-2.png"  style="border-style: none; text-align: center;" />
</p>

<!-- $$ w_{n+1} = w_n + \mu  E[(w_n^{T} x − y)x] $$ -->

Gradient Descent solves
<div>
$$  w^* = (X^T X)^{-1} X^T Y $$
</div>
with
<div>
$$ w_{n+1} = w_n + \mu  \sum_i[(w_n^{T} x_i − y_i)x_i] $$
</div>

Deterministic!
</script>
</section>

<section data-markdown style="text-align: left;">

    <script type="text/template">
    <!-- .slide: data-background="#FFFFFF" -->

**SGD / LMS**:

Approximate the gradient one sample at a time \\( x_i, y_i \\)

<div>
$$ w_{n+1} = w_n + \mu (w_n^{T} x_i − y_i)x_i $$
</div>

<p></p>


* Slow convergence
* Poor approximation of Gradient => oscillations

**Mini-batch SGD / Block-LMS**

N sample at a time to estimate the gradient

<div>
$$ w_{n+1} = w_n + \frac{\mu}{N} \sum_i^{N}[(w_n^{T} x_i − y_i)x_i] $$
</div>

Less gradient noise, better convergence than SGD, still very optimizable
</script>
</section>

<section data-markdown style="text-align: left;">
#### Other loss functions

* GD: loss = MSE
* Passive Aggressive: Hinge loss
* Perceptron: loss = +/- 1

</section>

<section data-markdown style="text-align: left;">
###### Mini Batch K-Means

D. Sculley @Google, 2010, [Web Scale K-Means Clustering](https://www.eecs.tufts.edu/~dsculley/papers/fastkmeans.pdf)


* Each mini-batch
    * Each sample \\( x \\) in the batch
        * Find closes center \\( C_{x} \\) (min dist)
    * Each sample \\( x \\) in the batch
        * Update \\( C_{x} \\) with

<div>
$$ C_x = (1 - \frac{\mu}{|C_x|}) C_x + \mu x $$
</div>

</section>
<section data-markdown style="text-align: left;">
    <script type="text/template">
    <!-- .slide: data-background="#FFFFFF" -->

Not same partition as K-Means, but much faster

Same convergence level

<p style="text-align:center;">
    <img src="/images/blog/ooc-boston/kmeans-convergence.png"  style="border-style: none;" />
</p>

</script>
</section>

<section data-markdown style="text-align: left;">


* Classification: Mini-batches need to be balanced for classes

* Perceptron, PA and SGD put different emphasis on samples over time.

* Batch size influences?

</section>

<section data-markdown style="text-align: left;">
### Batch size
The bigger the better? until you run out of memory?

* **time efficiency** of training (small batch) VS **noisiness of gradient** estimate (large batch)

Adding some noise (small batch) can be interesting to get out of local minimas

In practice

* small to moderate mini-batch sizes (10-500)
* decaying learning rate

https://www.quora.com/Intuitively-how-does-mini-batch-size-affect-the-performance-of-gradient-descent
</section>

<section data-markdown style="text-align: left;">

# III Examples
</section>


<section data-markdown style="text-align: left;">
<script type="text/template">

##### Reuters-21578 UCI ML repository

Not same partition as K-Means, but much faster

Same convergence level

Batch sizes: 100, 500, 2000

<p style="text-align:left;">
<a href="/images/blog/ooc-boston/accuracy_100_samples.png" target=_blank>
    <img src="/images/blog/ooc-boston/accuracy_100_samples.png"  style="border-style: none;"  width = 300 />
</a>
<a href="/images/blog/ooc-boston/accuracy_500_samples.png" target=_blank>
    <img src="/images/blog/ooc-boston/accuracy_500_samples.png"  style="border-style: none;"  width = 300 />
</a>
<a href="/images/blog/ooc-boston/accuracy_2000_samples.png" target=_blank>
    <img src="/images/blog/ooc-boston/accuracy_2000_samples.png"  style="border-style: none;"  width = 300 />
</a>
</p>


Accuracy results are similar


</script>
</section>
<section data-markdown style="text-align: left;">
<script type="text/template">

##### Training Times
Batch sizes: 100, 500, 2000

<p style="text-align:left;">
<a href="/images/blog/ooc-boston/training_times_100_samples.png" target=_blank>
    <img src="/images/blog/ooc-boston/training_times_100_samples.png"  style="border-style: none;"  width = 300 />
</a>
<a href="/images/blog/ooc-boston/training_times_500_samples.png" target=_blank>
    <img src="/images/blog/ooc-boston/training_times_500_samples.png"  style="border-style: none;"  width = 300 />
</a>
<a href="/images/blog/ooc-boston/training_times_2000_samples.png" target=_blank>
    <img src="/images/blog/ooc-boston/training_times_2000_samples.png"  style="border-style: none;"  width = 300 />
</a>
</p>
Training times decreases for models

Stays basically the same for vectorization

</script>
</section>


<section data-markdown style="text-align: left;">
<script type="text/template">
    <!-- .slide: data-background="#FFFFFF" -->

<p style="text-align:left;">
    <img src="/images/blog/ooc-boston/kaggle_logo.png"  style="border-style: none;"  width = 200 />
    <img src="/images/blog/ooc-boston/kaggle-dato-truly-native.png"  style="border-style: none;"  width = 300 />
</p>

* Large training dataset, 30k HTML pages, 36Gb

* feature extraction, vectorization: TfIdf / Hashing Trick

* 10k training 4k test


<p style="text-align:center;">
<a href="/images/blog/out_of_core_vs_in_memory_RAM.png" target=_blank>
    <img src="/images/blog/out_of_core_vs_in_memory_RAM.png"  style="border-style: none;"  width = 400 />
</a>
</p>

</script>
</section>


<section data-markdown style="text-align: left;">
<script type="text/template">
    <!-- .slide: data-background="#FFFFFF" -->

##### Model Comparison

10k pages, 500 batch size, 100 iterations

<p style="text-align:center;">
<a href="/images/blog/out_of_core_model_comparison_500_samples.png" target=_blank>
    <img src="/images/blog/out_of_core_model_comparison_500_samples.png"  style="border-style: none;"  width = 400 />
</a>
</p>

NB steadily converges,

SGD, PA, Perceptron: unstable

</script>
</section>


<section data-markdown style="text-align: left;">
<script type="text/template">
    <!-- .slide: data-background="#FFFFFF" -->

##### Batch size

Naive Bayes, Batch size: 10, 100 and 500


<p style="text-align:center;">
<a href="/images/blog/out_of_core_multinomialNB_batch_size.png" target=_blank>
    <img src="/images/blog/out_of_core_multinomialNB_batch_size.png"  style="border-style: none;"  width = 600 />
</a>
</p>


</script>
</section>

<section data-markdown style="text-align: left;">
### Part II Data Munging (next time)

* Loading csv files
* Parsing, segmenting,
* word counts, TfIdF, hashing vectorizer

=> time consuming

</section>

<section data-markdown style="text-align: left;">
### Dask
* Continuum IO (same people who brought you Conda)
* Easy install pip or conda (no JVM like spark)
* Blocked algorithm
* Copies the numpy interface
* Very little code changes
* [Matthew Rocklin - PyData 2015](https://www.youtube.com/watch?v=ieW3G7ZzRZ0)
</section>


<section data-markdown style="text-align: left;">
# Thank you

@alexip

alexis.perrier@gmail.com

https://alexisperrier.com

</section>



<section data-markdown style="text-align: left;">
##### Links

* https://scikit-learn.org/stable/modules/scaling_strategies.html
* https://scikit-learn.org/stable/auto_examples/applications/plot_out_of_core_classification.html#example-applications-plot-out-of-core-classification-py
* Memory imprint of Python Dict https://blog.scrapinghub.com/2014/03/26/optimizing-memory-usage-of-scikit-learn-models-using-succinct-tries/
* Dask https://github.com/dask/dask-examples/blob/master/nyctaxi-2013.ipynb
* scikit learn https://fa.bianp.net/talks/sheffield_april_2014/#/step-19

* https://scikit-learn.org/stable/auto_examples/applications/plot_out_of_core_classification.html#example-applications-plot-out-of-core-classification-py

* https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.SGDClassifier.html
* https://github.com/scikit-learn/scikit-learn/issues/4834
* https://github.com/szilard/benchm-ml/blob/master/0-init/1-install.txt
* https://cs229.stanford.edu/materials.html
* https://stackoverflow.com/questions/15036630/batch-gradient-descent-with-scikit-learn-sklearn
* https://sebastianruder.com/optimizing-gradient-descent/
* [Passive Aggresssive](https://www.youtube.com/watch?v=TJU8NfDdqNQ)
</section>
