---
title: "Early-Stage AI feasibility validation"
date: 2024-08-01
author: Alexis Perrier
tags: [AI experimentation, product–market fit, startup strategy, rapid prototyping, founder mindset]
description: "Building something that works is no longer the hard part. Knowing whether it should exist is. This piece looks at two AI-heavy projects that never shipped, not because the technology failed, but because business reality intervened. From toxic content detection on TikTok to a PMF validation platform for solo founders, both experiments used AI to compress time-to-insight, test assumptions early, and expose strategic constraints fast. The focus is on how AI reshapes early-stage decision-making by making it cheaper to be wrong — and clearer when it’s time to move on."
image: "/images/blog/PMF_AI_validaton.png"
---



# Two AI projects that didn’t ship — and what they were actually useful for

Not all projects are meant to reach production. Some exist to answer questions quickly. Over the past period, I worked on two AI-heavy projects that never shipped. Both were technically successful. Both failed on strategy, data access, or funding. And both did exactly what they were supposed to do: reduce uncertainty early.

What made them different from similar experiments a few years ago is simple: **AI radically compressed time-to-insight**.

### Project 1: detecting toxic TikTok content for minors

The first project was a technical proof of concept aimed at protecting minors and teenagers from toxic content on TikTok. The target users were parents. The goal was to evaluate whether it was technically feasible to detect problematic content at scale.

I built a Python-based POC that downloaded TikTok videos, extracted content, and applied toxicity detection models. From a purely technical standpoint, the result was clear: **detecting toxic content was feasible**, and the accuracy was reasonably good for a first iteration.

The project stopped for two non-technical reasons.

First, data access. Accurately reconstructing or monitoring the feed of a specific user is extremely difficult without deep platform-level permissions. Second, business reality: **you cannot build a sustainable company on scraped data**. Even with a working model, the foundation was strategically unsound.

AI mattered here not because it enabled something impossible, but because it made it fast. Without AI-assisted development and modern ML tooling, reaching that conclusion would have taken significantly longer.

### Project 2: validating product–market fit through external signals

The second project targeted solo inventors working on early-stage product ideas, often in hardware, connected objects, or biotech-adjacent domains. The idea was to help them validate product–market fit through **external engagement signals** rather than internal conviction.

I built a POC platform where innovators could describe a product, generate visuals using AI image generation, produce copy automatically, and publish a lightweight landing experience. The platform integrated newsletters, engagement tracking, and pre-payment mechanisms to capture early signals: interest, intent, and willingness to pay.

This project leaned heavily on AI:
– AI-assisted frontend and backend development
– Automated copy generation
– AI-generated product visuals via a dedicated API layer

The platform never launched publicly. It remained in beta and was ultimately stopped due to lack of funding. No users were onboarded, so PMF remained unproven.

Again, the technical stack worked. The question wasn’t “can this be built?”, but “is this the right problem, at the right time, with the right resources?”.

### What these projects were really about

In both cases, AI didn’t just speed up execution. It **changed what was possible to test**. Wider scopes, faster iterations, and earlier answers to hard questions.

The core lessons are simple and unsurprising:
– Technical feasibility does not imply business feasibility
– Data access and distribution matter more than model quality
– AI dramatically lowers the cost of being wrong early

These projects didn’t fail in an interesting way. They ended for ordinary startup reasons. And that’s precisely the point.

With modern AI tooling, it is now possible for a single developer to explore complex problem spaces, validate assumptions, and abandon paths early — not because the technology failed, but because reality intervened.

That shift, more than any specific model or framework, is the real strategic advantage.

