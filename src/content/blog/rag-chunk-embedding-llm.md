---
title: "Chunking will make or break your RAG!"
date: 2023-12-01
author: Alexis Perrier
description: "Retrieval Augmented Generation is a simple technique to explore and question a proprietary corpus based on chunking, embeddings and LLMs. Chunking will make or break your RAG!"
tags: [NLP, RAG, LLM, Weaviate, Vector Database]
---

# Chunking will make or break your RAG!

This short post explains how to explore a large proprietary corpus using a RAG strategy and emphasizes the importance of the chunking step of the pipeline.


## RAG time

(no, not the [Scott Joplin Ragtime](https://www.youtube.com/watch?v=nDkd9bVhmek), sorry jazz lovers)

**RAG** stands for **Retrieval Augmented Generation**. It is a technique used to question and explore large collections of documents. RAG is a simple way to leverage LLMs on a proprietary corpus without resorting to more expensive and complex tuning strategies.

The initial preparation step consists in splitting the documents from your corpus into smaller parts called chunks. Chunking breaks down large text into smaller segments to optimize content relevance.

Chunking is followed by the embedding phase: computing a vector representation aka embedding of each chunk . Each text chunk becomes a vector.

There are multiple ways to chunk a document and compute embeddings.

These embeddings are then stored in a vector database such as [weaviate](https://weaviate.io/). A vector database has 2 main roles: 1) storing the text and related vectors 2) enabling a super fast matching between 2 embeddings.

In short:
- text is split into chunks
- each chunk is vectorized and stored

Now we can start querying your corpus.

As the name indicates, the RAG pipeline then consists in 2 steps: retrieval and generation.

## Retrieval

Given your query or question.

* Your query is also embedded.
* The vector database finds the chunks of text within the corpus that most closely matches your query.

## Generation

The resulting chunks are  used as the information that can help answer your question using an LLM and a properly structured prompt.

The prompt has the following structure: role, context and query:

    Acting as
    {insert specific role: teacher, analyst, nerd, author, ...}

    Use the following information:
    {insert resulting text chunks}

    to answer this question:
    {insert your initial question}


This is the overall RAG strategy. Whether it works or not will depend on multiple factors.

* The embedding model : the choice of models is huge. For instance, [Camembert](https://huggingface.co/dangvantuan/sentence-camembert-large) via huggingface is supposedly more adapted to French, [text-embedding-ada-002](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings) is OpenAI's embedding model, [Voyage](https://www.voyageai.com/) is another embedding model that shows potential.
* The generative LLM: open source vs OpenAI GPT4, Cohere, Anthropic
* And the chunking strategy

Chunking can be done at the sentence level, paragraph or be fixed size (see [langChain TextSplitters](https://js.langchain.com/docs/modules/data_connection/document_transformers/) for instance). Some overlap between chunks is usually considered to liaise consecutive chunks. Although the other steps (embedding, LLM) are worthy of attention, finding a good chunking strategy is  where the challenge lies in order to get relevant answers.

A good chunking strategy must capture both meaning and context. Short chunks will preserve meaning but lack context while long chunks will tend to smooth out nuances of each sentence.

_"Embedding a sentence focuses on its specific meaning, while embedding a paragraph or document considers overall context and relationships between sentences, potentially resulting in a more comprehensive vector representation but with the caveat of potential noise or dilution in larger input sizes."_ Thx, chatGPT!

So when defining a good chunking strategy, keep in mind:

- The length of the initial documents: books or short sentences and the expected length and complexity of user queries.
- Different models may perform optimally on specific chunk sizes: sentence-transformer models for individual sentences, [text-embedding-ada-002](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings) for chunks with 256 or 512 tokens

The idea is to align the chunking strategy with the user queries to establish a closer correlation between the embedded query and the embedded chunks.

# Conclusion

Chunking is not a challenge that can be solved with an AI model. A simple python script will do. It's a simple task that boils down to splitting large text in smaller parts. But it is the foundation that will make your RAG system generate quality answers.



# Further reading

- An excellent wrap up of [chunking strategies](https://www.pinecone.io/learn/chunking-strategies/)
- An excellent example of a [RAG pipeline](https://stackoverflow.blog/2023/10/18/retrieval-augmented-generation-keeping-llms-relevant-and-current/) on the Stackoverflow blog
- An excellent Reddit thread on RAG and chunking: [How should I chunk text from a textbook for the best embedding results?](https://www.reddit.com/r/LangChain/comments/15q5jzv/comment/jw1s00t/)
- Version française de ce post: [Dans le RAG, l'important c'est le chunk ](https://medium.com/@alexisperrier/dans-le-rag-limportant-c-est-le-chunk-0d541b4f4bbe)
