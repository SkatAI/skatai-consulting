---
title: "NLP Analysis of the 2015 presidential candidate debates"
date: 2015-11-12
author: Alexis Perrier
description: "Summarization, sentiment analysis, topic modeling, all relevant NLP methods to analyze political debates."
tags: [NLP, Politics]
image: /images/blog/debate_sentiment_candidate.png
---
I've been fascinated by the recent presidential nomination debates. Their format, the number of participants, the post debates media frenzy all make for a good show. In the following 2 articles I've applied several powerful Text Mining and Natural Language Processing techniques to the transcripts.

In this first article: [Dissecting the Presidential Debates with an NLP Scalpel](https://www.opendatascience.com/blog/dissecting-the-presidential-debates-with-an-nlp-scalpel/) I bundled up topic modeling, sentiment analysis and Automatic summarization to show that NLP methods are relevant to understand not only the candidates and their messages but also the debates topics and how they are addressed accross party lines and candidates.

![Sentiment analysis per candidate](/images/blog/debate_sentiment_candidate.png)

You can read the full article on the [Open Data Science blog](https://www.opendatascience.com/blog).

In a followup article, I apply timemaps methods to visualize the [dynamics of the presidential debates](https://alexisperrier.com/dataviz/2015/11/19/timemaps-presidential-debates-dynamics/). Timemaps are a nifty way to quickly visualize and detect patterns in time series. In the case of the presidential nomination debates, they outline the relative intensity of the debates and the candidates presence or lack of.

The debates transcripts are available as python lists and csv files in this [github repository](https://github.com/alexisperrier/datatalks/tree/master/debates/transcripts)
