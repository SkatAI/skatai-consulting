---
title: "Mimesis: training field interviews with personas"
date: 2026-01-18
description: "Mimesis is a web-based interview training platform. It allows master-level students and researchers to conduct realistic interviews with adaptive AI personas grounded in real interview data. The project combines two strong axes: rapid delivery using agentic AI coding practices, and deep conceptual work on persona design as a proxy for human social behavior."
link: [Mimesis(]https://sociomimesis.com)
author: Alexis Perrier
tags: [AI, Personnas, Google ADK, Agentic coding, Sociology, Field research]
image: /public/images/blog/mimesis_illustration.png
---


# Mimesis: training field interviews with personas

I built Mimesis because sending students into the field too early doesn’t work.

They hesitate or freeze and often don’t listen as well as they think they do.

Interviewing is not a checklist. It’s a craft. A physical one, almost. You only get better by doing it again, and again, and again, until questions stop sounding rehearsed and silence stops feeling uncomfortable.

With Université Gustave Eiffel and the DIGIS program, the ambition is simple and demanding at the same time: create an online patform where sociology students and researchers can train seriously on conduting field interviews.

On Mimesis, you can conduct interviews with personas. Not toy chatbots. Not generic assistants. Personas who are grounded in real interviews and shaped by actual field data. They are constrained via their system prompts by a specific topic,. For instance Ai use by students in academia (vey meta). They are also responsive to time and get tired and impatient after awhile because real people don’t stay sharp forever either.

This project lives exactly where I operate best. Conceptual depth, technical execution, and constant translation between the two. Talking with sociologists about what an interview truly captures, what it distorts, what it misses, and then turning those discussions into a system that behaves coherently under real usage.

I worked solo on the product and the code, with support from [pleias.fr](https://pleias.fr) on the persona system prompts. Persona design is not prompt tweaking. It’s modeling attention, resistance, coherence, and limits. Sociology informs the AI. The AI, in return, exposes assumptions in sociology. This feedback loop is where things get interesting.

On the technical side, Mimesis is also a clear stance. Although I've been decvelopping for over 30 years. sometimes in languages you;ve never heard of (tcl tk anyine ?), I am not a seasoned React developer. Yet thanks to my good pals Claude code and OpenAI codex, I shipped a production-ready platform in a matter of days. Authentication, exports, responsive design, real users.  I don’t code alone anymore. I drive coding agents. Claude Code. OpenAI Codex. With discipline!

Vibe coding is cool but often not reliable for production. Driving agents to write production ready code boils down to applying coding best practices: Good task breakdown, strict reviews, constant questioning of complexity, security checks, and tests, loads of tests. It’s experience and judgment on one side, speed on the other, and together they create a level of focus I had never known in all these years writing software.

In short, I won’t go back to manual coding. Not because I can’t. Because it no longer makes sense.

The stack is deliberately pragmatic. Next.js, Supabase, Chakra UI, Python on the backend. Google ADK to orchestrate things cleanly. Continuous comparison between Gemini, Mistral, and open-source models. European sovereignty matters, so Mistral matters.

As often, the challenge in these projects is not technical. Specs are fuzzy by nature. Academic rigor meets product constraints, and neither wants to give in easily. Researchers want nuance and openness. A product needs boundaries, decisions and speed. Navigating that tension is a constant.

From the exisiting beta whoch we launched only a few days ago, the scope widens naturally. Sociology is only one entry point. Any domain that relies on field interviews can use this approach: healthcare, public policy, UX research, journalism. Anywhere humans collect information from other humans.

We are also exploring voice-only interviews using [Kyutai.org](https://kyutai.org) speech-to-speech models. Removing text changes the dynamic completely. Silence becomes meaningful. Hesitation carries weight. The interview starts to feel embodied again.


Talking to personnas is fascinating and ... quite fun (they don't vex easily). This project is just a start in my work on personnas.  So If you’re interested in using personas in your own field, let’s talk.