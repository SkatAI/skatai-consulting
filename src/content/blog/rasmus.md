---
title: "I built my own Danish tutor"
date: 2026-08-23
description: "From a friendly telegram bot to a full voice based AI tutor."
author: Alexis Perrier
tags: [AI, Language, Voice, Danish]
image: /images/blog/rasmus.png
---

# Summer is nearly over. I've been building my own Danish tutor. 

Why Danish? Well I'm married to a Dane and I should have learned the language many years ago. 
But it's never too late right?

Anyway, after many sessions stressed by the Duolingo owl, I decided to build my own learn Danish app.

The first version was a text based telegram bot called Rasmus. Creating a telegram bot is very easy, easier than a discord bot. The great thing is that the telegram bot can reside on your local. As long as your laptop is running, the bot answers. Perfect for a local learning app.

The way it works is that instead of telegram reaching to the app, it uses outbound HTTPS with long polling so there's always an outbound connection parked and waiting. For an excellent explanation of Long Polling see https://singhajit.com/long-polling-explained/

I never took the time to actually host the docker image on a server, but running on my laptop was enough to test the system.

On the language learning side, I focused on vocabulary acquisition through repetition.  A simple sqlite database stores the words and the user's progress. The actual content is generated on the fly by an LLM (google/gemini-2.5-flash-lite via OpenRouter). I used it to generate simple exercises based on random  sentences from a set of predefined topics.

But I quickly ran into multiple problems 
- the grading required my response to be exact. So even when my answer was correct, the bot would sometimes reject it as incorrect. Easily fixed with regex and a more flexible system prompt.
- the vocabulary was all over the place. Rare words, synonyms, uncertain meanings and grammatically correct sentences but not ones a native speaker would naturally say.

After tinkering with the app for a while and developing new features with Claude code, I lost track of the actual evolution of the code and the embedded rules. And my Rasmus telegram bot teacher fell asleep for a long time.

# Then came voice! 

Imagine having your own language teacher, available 24/7, never judging, and almost for free?

So I started from scratch and built a new Danish teacher with my usual voice AI stack (pipecat) and providers (deepgram, cartesia, gradium, speechmatics, elevenlabs etc ). I cloned my voice AI codebase https://github.com/SkatAI/sceance, updated a few libraries and added a text mode, learner level, and focus on grammar, vocabulary and pronunciation.

The first few minutes were exhilarating. I was talking Danish and the teacher was responding in Danish. 
Or as I said to my wife, "Hej skat, kom ny, jeg kan tale dansk!"

I tested a few voices and SST / ASR models and settled on Cartesia for the best voice quality and speechmatics for the ASR model.

I also tested other STTT and TTS providers but the voice quality was not as good as the Cartesia voice for [Søren](https://play.cartesia.ai/voices/a466f9e2-28eb-4bb7-925c-8e8984950700).

After the first few minutes, however, I noticed that the STT model struggled with my less than perfect pronunciation of Danish.
Which in fact is to be expected for a non-native speaker. Danish is known for being insanely difficult to pronounce. 
The grammar is quite simple with few conjugation and no case system like the ones found in Russian (6 cases: Творительный, ...) or Finish (15 cases: Komitatiivi, ...). So grammatically simple.

But 

Depending on how you count (long vs short vowels, diphthongs, stød ), Danish is credited with anywhere from about 20 to 40 distinct vowel sounds. It's one of the largest vowel inventories in the world by any of those counts (Grønnum 2005; Basbøll 2005). French has roughly 14-16 and English between 14 to 20 depending on the variety.
To make things even more interesting, some of the Danish consonants turn into semivowels (Consonant lenition). The net effect is that syllable boundaries dissolve and words melt into each other.

No wonder the model from speechmatics struggled with my pronunciation. Even Danish kids take longer than their neighbors to acquire vocabulary ([When too many vowels impede language processing: The case of Danish](https://portal.findresearcher.sdu.dk/da/publications/when-too-many-vowels-impede-language-processing-the-case-of-danis/) )  .

Coming back to the Voice AI architecture, it involves a pipeline of components: The user speech is transcribed by the STT model (Speech To Text aka ASR: Automatic Speech Recognition), then passed to the LLM to generate the textual answer, and finally voiced out by the TTS model (Text To Speech). So if the first step fails, the entire pipeline fails and the AI teacher has no way to provide helpful and relevant feedback. 

[Gladia](https://www.gladia.io/) recently posted about the importance of [getting STT right](https://www.gladia.io/blog/stt-api-benchmarks) in the first place.
> "Every product that depends on voice input ultimately depends on how well its speech-to-text (STT) layer performs in production"

So far I have 
- a working voice pipeline 
- experience in language learning and how to shape the content and the lessons. 

My problem now is to find a way to have a proper transcription of my own accented version of Danish. 

All I need now is to find a STT model either impervious to my accented Danish so that the tutor can understand what I'm saying 
or a speech to phonetics model that can highlight my weaknesses in my Danish pronunciation for the tutor to focus on.

There are quite a few resources on Danish, such as the [Danish Language Institute](https://www.danishlanguageinstitute.dk/), or the [Danish language technology platform](https://sprogteknologi.dk/) and ASR / TTS models from the [Coral](https://alexandra.dk/coral/coral-modeller/) project from the Alexandra Institute on [Huggingface](https://huggingface.co/CoRal-project). And that's next on my todo.

In the meantime,, I still have the excellent videos from Mic's language on the particularities of the [Danish Stød](https://www.youtube.com/watch?v=6_ZPmiwN4T4).

Vi ses!
