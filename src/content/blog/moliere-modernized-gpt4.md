---
title: "Rewriting Moliere plays with chatGPT"
date: 2023-10-04
author: Alexis Perrier
tags: [NLP, Molière, LLM]
image: /images/blog/moliere_steampunk_cyborg.png
---

# Rewriting Moliere plays with chatGPT

tldr: _I used GPT4 to generate modernized versions of Molière's works. The goal is to facilitate access to these works which are omnipresent in the French school curriculum while vernacular French is evolving rapidly. By simplifying the structure of sentences, reducing the length of lines, and modernizing the vocabulary, we obtain simplified versions while maintaining the integrity of the original works._

LLMs (Language Models) like chatGPT have disrupted learning and teaching in just a few months.

It's a known fact that LLMs hallucinate. An LLM does not know the subject it handles. The model can write a recipe but has never tasted chicken.

For example, when you ask chatGPT to summarize "[Les Fourberies de Scapin](https://moliere.love/les-fourberies-de-scapin/acte-1-scene-1/)" (Scapin the Schemer), you get a text that is certainly inventive but fundamentally false, seemingly containing pieces from "[Le Médecin Malgré Lui.](https://moliere.love/le-medecin-malgre-lui/acte-1-scene-1/)" (the Doctor despite himself):

"_Scapin stands in the middle of the courtyard, in front of a large wooden crate, pretending to be a 'doctor' or a 'sorcerer' capable of curing the lovers' woes._"

This will surely get you a zero, or F, from the French teacher.

Therefore, the relevant question is not the accuracy of the produced text but its plausibility. The strength of LLMs lies in their ability to generate text, not in aligning facts. Among the many use cases, these models can facilitate the understanding of classical texts by offering a simplified version of potentially challenging-to-understand texts.

![](/images/blog/moliere_steampunk_cyborg.png)


## Why Tackle Molière?

Molière's plays are ubiquitous in the French school curriculum. Molière is hailed as the embodiment of French genius in terms of theater, comedy, and also as a social critic whose modernity can never be questioned. His characters, Harpagon, Scapin, Sganarelle, are known to all French. His best lines are ingrained in the French psyche.

"One must eat to live, not live to eat," "But what was he doing in that galley," and many others.

The texts of these 17th-century works have already been adapted into French at some point. The raw texts from the 1660s would be quite challenging to understand today. However, this version is aging rapidly. It has become difficult for young (and not-so-young) generations to grasp. Comments on social media abound about the difficulty of understanding the texts and therefore the story.

_I'm in 9th grade, and my French teacher asked me to read this book, but I didn't understand anything._

Hence the idea of using chatGPT to translate and adapt Molière's plays into modern French.

Our goal is to make these works easier to read and understand for a population that is increasingly less accustomed to reading books, and whose everyday French is rapidly diverging from the dusty standards of the French Academy.

## Betrayal, stupefaction and stupidification !

Daring to mention the modernization or simplification of Molière's texts instantly provokes a visceral and indignant rejection. The central accusation being the dumbing down and its corollary, the inexorable decline in educational standards. These arguments reek of "it was better in the past," the anti-screen brigade, the agony of French in the face of English, and other fallacies about the education of yesteryears.

Simplifying the text would supposedly hasten a decline in students' standards.

However, correlation (assumed) does not imply causation.

The Bible has been translated, Shakespeare has been adapted into contemporary English, so why can't Molière be as well? The texts are not sacred. The approach is democratic. And the goal is clear: to facilitate access to classical theater plays.


## To translate, adapt, modernize, certainly, but what are we talking about? What results can we expect?

Let's clarify right away. This is not about summarizing the play, nor excessively simplifying the texts, and certainly not about making them sound _youthful_ with supposed _youth_ language.

Our goal, therefore, will be to:

- Simplify the sentence structure.
- Shorten overly long lines of dialogue.
- Use contemporary vocabulary.
- Refresh the phrases and styles.
- Transition from formal to informal language (tu <-> vous) when it makes sense, such as between parents and children.

We will preserve:

- The meaning, the message, the story.
- The dialogue structure between the characters.
- A one-to-one equivalence of lines between the original and the modernized version. Each line, each verse, should have an equivalent in modern French.
- Iconic lines: "Mais qu'allait-il faire dans cette galère," "Au voleur! au voleur! à l'assassin! au meurtrier! ..."

And, of course, we won't hesitate to keep the original text when it holds no particular difficulty.

## An Example

Let's take an example. In [Act 1, Scene 1 of L'Avare](https://moliere.love/l-avare/acte-1-scene-1/) (The Miser), Valère opens the play with these words:

&laquo; _Hé quoi ! charmante Élise, vous devenez mélancolique, après les obligeantes assurances que vous avez eu la bonté de me donner de votre foi ? Je vous vois soupirer, hélas ! au milieu de ma joie ! Est-ce du regret, dites-moi, de m'avoir fait heureux ? et vous repentez-vous de cet engagement où mes feux ont pu vous contraindre ?_ &raquo; 

"_What! Lovely Élise, you are becoming melancholic, after the obliging assurances you had the kindness to give me of your faith? I see you sigh, alas! in the midst of my joy! Is it regret, tell me, for having made me happy? And do you repent of this commitment where my passions may have compelled you?_"

It's beautiful, flowery, and delightfully romantic!

The modern version reads:

&laquo; _Pourquoi cette tristesse, Élise, après m'avoir assuré de ton amour ? Je te vois soupirer, est-ce du regret de m'avoir rendu heureux ? Regrettes-tu notre engagement ?_ &raquo; 

or in English:

"_Why this sadness, Élise, after assuring me of your love? I see you sigh, is it regret for making me happy? Do you regret our commitment?_"

It's less beautiful but way more straightforward.

In this example, we touch upon one of the main challenges of the exercise. The beauty of the original text, its style, rhythm, and tensions, all fall into the realm of flavor and music. There is poetry in these lines, even though the text is in prose. The modern version is much more plain in comparison, but it offers conciseness and clarity. What is lost in beauty is gained in efficiency.


## The Quest for the Prompt

With GPTs and LLMs, the prompt is everything. Without a prompt, there is no salvation. The prompt will dictate the quality of the result: form, format, style, and, most importantly, the preservation of meaning. We have worked with two models: GPT 3.5 and GPT 4 via the openAI API and tested numerous configurations and prompts.

### Automating Prompt Engineering

The classic process of optimizing a machine learning model involves defining a metric to maximize by selecting the best model's meta-parameters. This model must also be robust, meaning it performs consistently in the face of slight variations in input data. This iterative process allows testing multiple configurations and achieving the best possible results based on context, approach, and available data.

Such a process would give us a systematic approach to finding the best prompt. However, it remains challenging to implement in our text transformation context (Automatic Text Simplification (ATS)). This is for two reasons.

Firstly, the inherently random nature of LLMs makes the results inconsistent. The nature or quality of generated text varies depending on API request parameters, the prompt, and the input text to be modified. Even when setting the model's temperature to zero and using an identical prompt, we cannot control the model's response to incoming original text.

Secondly, complexity measures of a text are not suitable for our context of simplifying 16th-century text corpora.

We have used the [LyngX](https://github.com/ContentSide/LingX) library, which offers several psycholinguistic complexity metrics (DNT, IDT, ...). Unfortunately, there appears to be no correlation between simplified lines and complexity scores obtained with these methods.

At this stage, building an automation for prompt selection for automatic text simplification seems to require more effort than we can afford. Our primary goal remains to quickly have publicly available modernized versions of Moliere's plays.

For that reason we opted for a manual selection of prompts, models, and query parameters. In the end, after many trials, our prompts follow the format:

For example:

```
Rewrite the text in modern French:
- Basic vocabulary;
- Clear and short sentences;
- Reduce the paragraph length;
{text}
```

or

```
Write this text in simple and concise French style:

text:
{text}
```

where ```{text}``` is replaced by a line of dialogue, an entire scene, or an excerpt consisting of a series of lines of dialogue.


## Key Challenges

Translating line by line often results in loss of meaning since the model lacks awareness of context,
or in a result in a narrative form: ```Géronte speaks to his son and says this``` instead of the dialogue. ```Géronte: <the line>```

On the contrary, submitting each scene in its entirety leads to a reduction in the number of lines in the translated version. 

This is one of the peculiarities of Molière's texts. The _ping-pong_ dialogues, consisting of a rapid exchange between 2 characters who repeat very similar same lines. For example, in [Act II, Scene 4 of Le Médecin Malgré Lui](https://moliere.love/le-medecin-malgre-lui/acte-2-scene-4/):

```
GÉRONTE: Vous donner de l'argent, Monsieur.
SGANARELLE: Je n'en prendrai pas, Monsieur.
GÉRONTE: Monsieur...
SGANARELLE: Point du tout.
GÉRONTE: Un petit moment.
SGANARELLE: En aucune façon.
GÉRONTE: De grâce!
SGANARELLE: Vous vous moquez.
GÉRONTE: Voilà qui est fait.
SGANARELLE: Je n'en ferai rien.
GÉRONTE: Hé!
```

which reads as:

```
GÉRONTE: To give you money, Sir.
SGANARELLE: I won't take any, Sir.
GÉRONTE: Sir...
SGANARELLE: Not at all.
GÉRONTE: Just a moment.
SGANARELLE: In no way.
GÉRONTE: Please!
SGANARELLE: You're joking.
GÉRONTE: There you go.
SGANARELLE: I won't do it.
GÉRONTE: Hey!
```

As the content varies little from one line to the next, the model, which has just been instructed to simplify the text, will reduce the number of lines. This leads to the loss of the valuable one-to-one equivalence between the original and modern versions.

We eventually opted for a middle ground between translating line by line and translating entire scenes, using a sliding window of 5, 10, 15 lines with an overlap of 2, 5, or 7 lines between queries. This provides the model with enough context to avoid the problems mentioned earlier.

However, this entails reviewing the different versions obtained to select the best one for each line in terms of the meaning discussed earlier. There is a degree of subjectivity in this selection process, which then becomes a traditional review and editing task.

In the end, for the play "[Les Fourberies de Scapin](https://moliere.love/les-fourberies-de-scapin/)" (771 lines), we kept ⅓ (232 lines) in their original version, manually rewrote 47 lines (6%). The remaining two-thirds were equally contributed by GPT 3.5 (224) and GPT 4 (268).

## Results

We achieve a modern version of the texts that fulfills all the previously stated objectives: simplification and shortening of sentences, refreshing vocabulary, phrases, and styles, switching from formal to informal language (tu/vous), all while preserving the meaning and maintaining a 1-1 equivalence.

The available plays currently include:

- Scapin the Schemer: [Les Fourberies de Scapin](https://moliere.love/les-fourberies-de-scapin/acte-1-scene-1/)
- The doctor despite himself: [Le Médecin Malgré Lui](https://moliere.love/le-medecin-malgre-lui/acte-1-scene-1/)
- The Miser: [L'Avare](https://moliere.love/l-avare/acte-1-scene-1/)

The texts are displayed in bilingual mode, with the revised text side by side with the original, allowing for comparison and reading of the modern version without losing the original version's rhythmic and humorous qualities.

![](/images/blog/textes_cote_a_cote.png)
