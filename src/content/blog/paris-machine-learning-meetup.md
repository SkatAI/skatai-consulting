---
title: "Paris Meetup slides Topic Modeling of Twitter Followers"
date: 2016-02-08
author: Alexis Perrier
description: "Topic Modeling of Twitter Followers"
tags: [Meetup, Topic Modeling, Twitter]
image: /images/blog/meetup_paris/LSA_15_topics_terminal_screenshot.png
layout: slides
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/xhmKMK3pJxk?ecver=1&t=1450" frameborder="0" allowfullscreen></iframe>

<section data-markdown style="text-align: left;">

### Topic Modeling
#####appliqué aux fils twitters.

* Alexis Perrier [@alexip](https://twitter.com/alexip)

* Data & Software, Berklee College of Music, Boston [@BerkleeOnline](https://twitter.com/berkleeonline)

* Data Science contributor [@ODSC](https://twitter.com/odsc)

</section>

<section data-markdown style="text-align: left;">

**Part I: Topic Modeling**

* Nature et application
* Algos et Librairies

**Part II: Projet: followers sur twitter**

* Methodes
* Problemes
* Viz

</section>

<section data-markdown >
    Sôrry pour les accents et anglicismes
</section>

<section data-markdown style="text-align: left;">
    <script type="text/template">
    <!-- .slide: data-background="#FFFFFF" -->

Vue générale et rapide sur un large ensemble de documents

Technique non-supervisée

<img src="/images/blog/meetup_paris/tm_observed_latent.png" style="border: none;  ">

* 1 document <span>\\(\Leftrightarrow\\)</span> plusieurs topics
* 1 topic <span>\\(\Leftrightarrow\\)</span> un ensemble de mots
* La proportion des topics varie entre les documents

    </script>

</section>

<section style="text-align: left;">
<h4>Analyse sémantique de collections de documents</h4>


<img src="/images/blog/meetup_paris/Newspapers.png" style="border: none;  ">

<ul>
    <li >Divers Corpus
        <ul>
            <li>Littérature</li>
            <li>Journaux</li>
            <li>Documents officiels</li>
            <li>Contenu en ligne</li>
            <li>Réseaux sociaux, forums, ....</li>
        </ul>
    </li>
    <br/>
    <li class="fragment">
        Couplé a des variables externes
        <ul>
            <li>Evolution dans le temps</li>
            <li>Auteurs, locuteurs</li>
        </ul>
    </li>
</ul>

</section>

<section data-markdown>
# Algorithmes
</section>


<section data-markdown style="text-align: left;">

#### Principaux Algorithmes



* Approche vectorielle
    * Latent Semantic Analysis (LSA)

* Approche probabiliste, Bayésienne
    * Latent Dirichlet Allocation (LDA)
    * **Structural Topic Modeling (STM)**, pLSA, hLDA, ...

* Approche Neural Networks
    * convnets, ...

</section>


<section data-markdown style="text-align: left;">
    <script type="text/template">
    <!-- .slide: data-background="#FFFFFF" -->

#### Latent Semantic Analysis  - LSA

* TF-IDF: Fréquence relative des mots => Vectorisation
* Matrice document / fréquence des mots
* Réduction de dimension
* Décomposition en Valeur Singulière (SVD)

![Latent Observed](/images/blog/meetup_paris/LSA_topic_SVD.png)


<sub>aka Latent Semantic Indexing (LSI)</sub>

</script>

</section>

<section data-markdown style="text-align: left;">
        <script type="text/template">
    <!-- .slide: data-background="#EEEEFF" -->

#### Latent Dirichlet Allocation
Un topic est une liste des probabilités des mots dans un vocabulaire donné.

LDA: La distribution des topics suit une loi de Dirichlet.

* K: Nombre de topics
* \\(\alpha\\): Nombre de topics par document
* \\(\beta\\): Nombre de mots par topic

Details: https://en.wikipedia.org/wiki/Latent_Dirichlet_allocation

Inférence bayésienne, Gibbs sampling, Chinese restaurant process

</script>
</section>


<section data-markdown>
# Librairies
</section>

<section data-markdown style="text-align: left;">
###### Librairies

* Python libraries
    * **[Gensim](https://radimrehurek.com/gensim/)** - Topic Modelling for Humans
    * LDA Python library

* R packages
    * a. lsa package
    * b. lda package
    * c. topicmodels package
    * d. **[stm package](https://structuraltopicmodel.com/)**

* Java libraries: S-Space Package, MALLET

* C/C++ libraries: lda-c, hlda c, ctm-c d, hdp

</section>

<section data-markdown>
#### Le Projet

3 articles

* [Topic Modeling of twitter followers](/blog/topic-modeling-of-twitter-followers)
* [Segmentation of Twitter Timelines via Topic Modeling](/blog/segmentation-twitter-timelines-lda-vs-lsa)
* [NLP Analysis of the 2015 presidential candidate debates](/blog/nlp-analysis-presidential-debates)

</section>


<section data-markdown>

#### Etapes:

1. Construire le corpus
2. Appliquer les modeles
3. Interpreter => Perplexité!

<!-- pourquoi ce projet: devenir data scientist -->
</section>

<section data-markdown style="text-align: left;">

#### Construire le corpus

1. Obtenir les timelines des 700 followers de [@alexip](https://twitter.com/alexip): [Twython](https://twython.readthedocs.org/en/latest/)

    Un document correspond a une timeline

2. Vectoriser le document

    * bag-of-words
    * Timeline en anglais:  lang = 'en' + [langid](https://github.com/saffsd/langid.py)
    * [NLTK](https://www.nltk.org/): tokenize, stopwords, stemming, POS

3. TF-IDF

    * Creer un dictionnaire de mots
    * Vectoriser les documents TF-IDF
    * Gensim, NLTK, Scikit, ....

</section>

<section data-markdown>
#### 1) Appliquer LSA


![Latent Observed](/images/blog/meetup_paris/LSA_15_topics_terminal_screenshot.png)

Résultats pour le moins difficiles a interpreter

![Latent Observed](/images/blog/meetup_paris/LSA_5_topics_terminal_screenshot.png)


</section>



<section data-markdown>
#### 2) Appliquer LDA

Franchement mieux


    u'0.055*app + 0.045*team + 0.043*contact + 0.043*idea + 0.029*quote + 0.022*free + 0.020*development + 0.019*looking + 0.017*startup + 0.017*build',
    u'0.033*socialmedia + 0.022*python + 0.015*collaborative + 0.014*economy + 0.010*apple + 0.007*conda + 0.007*pydata + 0.007*talk + 0.007*check + 0.006*anaconda',
    u'0.053*week + 0.041*followers + 0.033*community + 0.030*insight + 0.010*follow + 0.007*world + 0.007*stats + 0.007*sharing + 0.006*unfollowers + 0.006*blog',
    u'0.014*thx + 0.010*event + 0.008*app + 0.007*travel + 0.006*social + 0.006*check + 0.006*marketing + 0.005*follow + 0.005*also + 0.005*time',
    u'0.044*docker + 0.036*prodmgmt + 0.029*product + 0.018*productmanagement + 0.017*programming + 0.012*tipoftheday + 0.010*security + 0.009*javascript + 0.009*manager + 0.009*containers',
    u'0.089*love + 0.035*john + 0.026*update + 0.022*heart + 0.015*peace + 0.014*beautiful + 0.012*beauty + 0.010*life + 0.010*shanti + 0.009*stories',
    u'0.033*geek + 0.009*architecture + 0.007*code + 0.007*products + 0.007*parts + 0.007*charts + 0.007*software + 0.006*cryptrader + 0.006*moombo + 0.006*book',
    u'0.049*stories + 0.046*network + 0.044*virginia + 0.044*entrepreneur + 0.039*etmchat + 0.025*etmooc + 0.021*etm + 0.015*join + 0.014*deis + 0.010*today',
    u'0.056*slots + 0.053*bonus + 0.052*fsiug + 0.039*casino + 0.031*slot + 0.024*online + 0.014*free + 0.013*hootchat + 0.010*win + 0.009*bonuses',
    u'0.056*video + 0.043*add + 0.042*message + 0.032*blog + 0.027*posts + 0.027*media + 0.025*training + 0.017*check + 0.013*gotta + 0.010*insider'

* Quels sont les topics?
* Combien de topics?

</section>

<section data-markdown style="text-align: left;">

#### Back to the corpus

* Nettoyage des documents
* Completer la liste des stopwords a la main
* Identifier les anomalies: Robots, retweets, hastag, ...
* Ne garder que les fils qui ont twitté récemment.

245 timelines

[Visualization - LDAvis](https://nbviewer.jupyter.org/github/alexisperrier/datatalks/blob/master/twitter/LDAvis_V2.ipynb#topic=4&lambda=0.57&term=)

</section>


<section data-markdown style="text-align: left;">
#### 3) Structural Topic Modeling

* NLP: Tokenization, stemming, stop-words, ...
* Nommer les topics: plusieurs groupes de mots par topic exclusivité, fréquence
* Nombre de topic optimum: grid search + scoring
* Influence des variables externes

</section>

<section data-markdown style="text-align: left;">
            <script type="text/template">
    <!-- .slide: data-background="#FFFFFF" -->

![Latent Observed](https://www.opendatascience.com/wp-content/uploads/2015/11/debate_stm_process.png)
</script>
</section>

<section data-markdown style="text-align: left;">
#### STM: Presidential debates

* Primaires US
* 6 debats: 2 democrates, 4 republicains
* 1 document = un intervenant pendant un debat

[Visualization - stmBrowser](https://alexisperrier.com/stm-visualization/index.html)

</section>

<section data-markdown >
#### Merci

[@alexip](https://twitter.com/alexip)

Slides:  [alexisperrier.com](https://alexisperrier.com)

[alexis.perrier@gmail.com](mailto:alexis.perrier@gmail.com)



</section>

<section data-markdown  style="text-align: left;">
Code & Data & Viz:

    - https://github.com/alexisperrier/datatalks/tree/master/twitter
    - https://github.com/alexisperrier/datatalks/tree/master/debates
    - https://nbviewer.jupyter.org/github/alexisperrier/datatalks/blob/master/twitter/LDAvis_V2.ipynb
    - https://alexisperrier.com/stm-visualization/index.html

Ref:

    - topic modeling https://thesai.org/Downloads/Volume6No1/Paper_21-A_Survey_of_Topic_Modeling_in_Text_Mining.pdf
    - lda: https://ai.stanford.edu/~ang/papers/nips01-lda.pdf
    - pyLDAvis: https://github.com/bmabey/pyLDAvis
    - stm: https://scholar.princeton.edu/files/bstewart/files/stmnips2013.pdf
    - stm R: https://structuraltopicmodel.com/
    - stmBrowser: https://github.com/mroberts/stmBrowser

</section>
