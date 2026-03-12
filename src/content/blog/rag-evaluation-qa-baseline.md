---
title: "Fast scoring of a RAG pipeline over Q&A baseline"
date: 2023-12-10
author: Alexis Perrier
description: "Score a RAG pipeline with a generated Q&A baseline. Evaluate the performance RAG components:  chunking,  embedding and generative models as well as prompts. "
tags: [NLP, Molière, LLM, RAG, Weaviate, Vector Database]
---

# Fast scoring of a RAG pipeline over Q&A baseline

### tldr;


RAG is a simple technique to explore a large corpus of documents that the LLM does not know about.
But RAG makes a bold assumption: the answer to the query is present in the matching chunks of text. This is not always the case when answers are spread out across the entire text.

Another issue with RAG is the difficulty in evaluating its performance. Multiple elements of the pipeline have a significant impact on the relevance of the answers to our queries. Similarly to standard experiment loop in machine learning,  we need to be able to evaluate a RAG with a simple unique score.

In this post, we add some steps to the RAG pipeline to tackle both the problem of close perimeter contained answer assumption and the evaluation method. We use Langchain and Weaviate.

## RAG

[todo:what is RAG and what is it used for]


Given a large corpus composed of 100s, 1000s of textual files we want to explore the corpus in natural language. We have a question Q.

A standard RAG process goes as follows:

The **embedding** / preparation part:

1. Chunk the text
2. Vectorize each chunk => embeddings

The **retrieval** part, given a query:

3. vectorize the query => query embedding
4. find the chunk(s) closest to the query embedding

And finally the **generative** part:

5. insert the matching set of chunk(s) into a prompt
6. use that prompt and a generative model to answer the initial question.

Note that the process requires 2 LLM models: an embedding one and a generative one.

In short we use a short extract of the one of the document in the corpus as context within the generative prompt to help the generative model answer the queston.

[short exemple]

We therefore make the assumption that the answer to the query is  contained in the set of matching chunks given to the generative prompt as context of information. However that is not always the case.

Coherence assumption: The information is coherent or cohesive.


## Coherence assumption: The information is coherent or cohesive.

Consider for instance, a report on a public debate from some institution. The debate happened very recently and the generative model cannot know its content. The available report comes down to a 50 page pdf file. Too long to be given as a whole to the generative prompt.

Nopw, consider the question: who are the contributors to the debate ?

A simple query that can be solved with a simple python script. If the document is properly structured finding the answer does not even require any NER (named entity recognition) task. A simpl regex could work.

The RAG system will find a set of matching chunks or paragraphs from the pdf report. And assumming the prompt is efficient, the outpuanswert will consists of the contributors mentionned in the set of chunks. Obviously missing some contributors that happen to be mentionned in other parts of the report.

Now consider more abstract queries related to ideas, arguments or opinions that can be spread out over multiple chunks. The problem becomes more critical.

## RAG scoring and evaluation

The power of machine learning comes from improving the model by using a tight, fast, try - score loop. The data scientist establishes a baseline, then experiments with different settings, models or data and scores each experiment. Iterativity is central to the process. Having a unique score to evaluate the performance of the model is key for this iterative process of fast iterations and improvements to take place.

In the context of LLMs with RAG or other applications, evaluating the relevance of the output, the answer is not so straightforward. A manual evaluation is time consuming and possibly biaised.

To remedy this problem and to be able to implement concise experiment loops, we need to add an extra step to the RAG pipeline:

# Benchmarking a RAG with Q&A generation

1. Consider chunks from the original corpus.
2. build a Q&A set: on each chunk, we can ask the LLM to come up with a list of Questions and Answers.
3. For each pair of Q&A, we can derive a proximity score from their respective embeddings.

This gives us a testing set on which we can evaluate any RAG setup and experiment.

We can expand on this benchmarking step with:

- a manual review of the questions the LLM came up with to weed out irrelevant questions
- asking the LLM for Q&A of different level of abstractions: from simple facts, information extractions or stylistic analysis to more abstract questions on ideas, intent or arguments.

The assumption made here is that the distance, the score between the Q and A embeddings is a good proxy for the relavance of the RAG-generated answer from that corpus given a question. This is after all the main feature of embeddings, their ability to integrate meaning.

## Let's go

### The corpus

Consider a  corpus composed of text on Moliere, his life and some of his plays. The texts are in French and related to the play l'Avare, or the Miser iin English.

The corpus is composed of 5 documents obtained from these urls

- [Etudes litteraires](https://www.etudes-litteraires.com/moliere-avare.php)
- [Pierre Campion](http://pierre.campion2.free.fr/clavare.htm)
- [Wikipedia](https://fr.wikipedia.org/wiki/L%27Avare)
- [À la lettre](https://www.alalettre.com/moliere-oeuvres-avare.php)
- [Interview Podalydes- Libération](https://www.liberation.fr/culture/2009/10/06/le-monologue-coute-physiquement_586000/)

We use [trafilatura](https://trafilatura.readthedocs.io/en/latest/) to download the text versions of these pages. And edited each file so that paragraphs are separated by a double line return "\n\n".

# Chunk, chunk baby chunk!!

Although chunking seems like a simple task, there are many flavors. Langchain implements several [text splitting methods](https://api.python.langchain.com/en/stable/api_reference.html#module-langchain.text_splitter) :
[tiktoken](https://api.python.langchain.com/en/stable/text_splitter/langchain.text_splitter.CharacterTextSplitter.html#langchain.text_splitter.CharacterTextSplitter.from_tiktoken_encoder) via OpenAI, [NLTKTextSplitter](https://api.python.langchain.com/en/stable/text_splitter/langchain.text_splitter.NLTKTextSplitter.html#langchain.text_splitter.NLTKTextSplitter) or a [GPT2TokenizerFast](https://huggingface.co/docs/transformers/model_doc/gpt2#transformers.GPT2TokenizerFast) via Huggingface andd a [Recursive Text Splitter](https://api.python.langchain.com/en/stable/text_splitter/langchain.text_splitter.RecursiveCharacterTextSplitter.html#langchain.text_splitter.RecursiveCharacterTextSplitter).
https://api.python.langchain.com/en/stable/text_splitter/langchain.text_splitter.CharacterTextSplitter.html#langchain.text_splitter.CharacterTextSplitter.from_huggingface_tokenizer


The respective behavior of these text splitters and in particular the impact of the _chunk_size_ and _chunk_overalp_ parameters can be difficult to grasp.

- Here's a good [Stack Overflow explanation](https://stackoverflow.com/a/76747135/213081) on that topic.

- And here is a streamlit based demo app that compares some of the different [chunking methods](https://langchain-text-splitter.streamlit.app/).

In the end, we found that the separator parameter set by default to "\n\n" is what matters most in how the chunks are produced.

# Establish all the baselines !!!

To establish the baseline Q&A, we need chunks with enough information for the LLM to be able to generate questions and associated answers.

We choose the [tiktoken](https://github.com/openai/tiktoken) splitter with chunks of 600 tokens, overlapping by 100 tokens and we set the separator to the default value, a double line return "\n\n".

```python
        from langchain.text_splitter import CharacterTextSplitter
        text_splitter = CharacterTextSplitter.from_tiktoken_encoder(
            chunk_size= 600,
            chunk_overlap = 100,
            separator = "\n\n",
        )
```

This gives us between 5 and 25 chunks for the documents.

### Let's generate the Q&A.

For each chunk we ask the LLM to write a set of question and answer given the text.
We could directly use the langchain [QAGenerationChain](https://api.python.langchain.com/en/stable/chains/langchain.chains.qa_generation.base.QAGenerationChain.html#langchain.chains.qa_generation.base.QAGenerationChain) class. But the langchain prompts are in english and the chain may be unstable when trying to produce valid json. So we'll implement our own chain.

We will take inspiration from the langchain [prompts for QA generation](https://github.com/langchain-ai/langchain/blob/master/libs/langchain/langchain/chains/qa_generation/prompt.py) and use these French ones instead


```python
template = """
    Tu es un professeur de français au lycée.
    Tu dois écrire une paire de question response pour une interrogation écrite afin de tester les connaissances de tes élèves.

    Ta réponse dois suivre le format JSON suivant
    ```
    \{\{
        "question": "$LA_QUESTION_ICI",
        "réponse": "$LA_REPONSE_ICI"
    \}\}
    ```
    Tout ce qui est entre les ``` doit être du JSON valide.

    Propose une paire question/réponse, dans le format JSON spécifié, pour le texte suivant :
    ----------------
    {text}
"""```


The prompt follows the usual format
- role
- task description
- output format
- and actual task


The script generates a pair of question - answer for a given chunk.

``` python
    from langchain.chat_models import ChatOpenAI
    from langchain.prompts import ChatPromptTemplate
    from langchain.chains import LLMChain, SequentialChain

    llm_model = "gpt-4-1106-preview"
    prompt_context = ChatPromptTemplate.from_template(template)

    llm = ChatOpenAI(temperature=0.9, model=llm_model)

    chain   = LLMChain(llm=llm, prompt=prompt,  output_key="response",    verbose=False)

    overall_chain = SequentialChain(
        chains=[chain],
        input_variables=["text"],
        output_variables=["response"],
        verbose=True
    )

    response = overall_chain({ "text": chunk })
    print(response['response'])
```

The output is satisfying.

Here's a chunk (translated into English via Deepl.com):

```text
    In the first place, the moralist dramatist evokes the prodigality of the son, who of course reacts to his father's penny-pinching.
    But in his rejection of his father's excesses, Cléante also indulges in excess.
    Molière pokes fun at young people's propensity to follow expensive fashions and live in style.
    Not without a touch of humor, Molière places in his father's mouth a reproach of precious style:
    "you give furiously in the marquis".
    It's true that wigs and ribbons are overpriced by the merchants who take advantage of the windfall.
```

And the generated Q&A is:
```json
{
    "question": "According to the text, what vice does Molière criticize in the son Cléante in addition to the father's avarice?",
    "answer": "Molière criticizes Cléante's profligacy. He mocks his tendency to follow expensive fashions and lead an expensive lifestyle."
}
```

Good job GPT4 !

We still need to score these pairs.

Since we're working on a French corpus, we have a decision to make. Either use an English centered embedding model such as OpenAI's ada-02 or a French flavored one such as camembert or flaubert.

For the sake of simplicity of implementation we will use the OpenAI's ada-02. Prior manual comparison in the retrieval phase related to Moliere's plays of ada-2 vs camembert did not show a significant advantage from using the French based model. For now anway the important thing is the consistency of the process. We will evaluate the embedding model in a future experiment. However, being able to evaluate the embedding model is what triggered this work in the first place.

Let's use the [weaviate](https://weaviate.io) vector store and database to score the Q&A.


We will:

- store the questions in a Question collection
- store the answers in a Answer collection

along with the original document names as meta information.

### weaviate scoring

When searching the vector db for the proper answer to each question weaviate returns not only the answer from the original pair but also **a matching score**.

Weaviate offers 3 scorings: _score_, _distance_ and _certainty_. see this [page](https://weaviate.io/developers/weaviate/config-refs/distances). By default the distance is the cosine distance.


So next steps is to create Question and Answer collections with the following columns

In the Answer collection, the _answer_ property is vectorized, whereas in the Question collection, the _question_ propertiy is vectorized


Answer collection
- original doc name (not vectorized)
- answer (vectorized)


Question collection
- original doc name (not vectorized)
- question (vectorized)


Note: The question of optimality of the baseline is unknown at this stage. since the questions and answers are derived directly from the same chunk, the distance should be minimal. But since we're daeling with LLMs we may find a way to get better QA matches with a different setup. Also note that the optimal, lower distacne answer to a question is if the answer is the same as the question. pffff mind blown!

Since we took large enough chunks, each chunk may contain more information than the one addressed by the question. So their embeddings should be further away from the question than if the chunk only contained the expected information. So it's possible that the score of the Q,A given c is not optimal (minimal distance between Q and A).


## Math notations

I always feel that putting a problem into equations clears up things. But feel free to skip that paragraph and go to the implementation part.

### Q&A Baseline
Consider
- a set of chunks $$ \{c\}_C $$ extracted from a corpus obtained via a text splitter called $$C$$ .
- an embedding from text to vector called $$E$$
- an LLM model $$M$$ and a prompt $$P_{QA}$$


From the set of chunks $$ \{c\}_C $$, we derive:

- a set of Q&A pairs, $$\{(Q,A)\}$$,
- their respective embeddings $$\{( E(Q), E(A) )\}$$
- and the distance between each embedding pair $$\{ d( E(Q), E(A) ) \} $$

The baseline is the set composed by questions, answers, their embeddings and the distance
- baseline :  $$\{ (c, Q, A, E(Q), E(A), d( E(Q), E(A)  ) \}$$


### RAG Process
Consider now a RAG pipeline that we want to evaluate. The RAG pipeline has a text splitter  $$C'$$, embedding model $$E'$$, LLM $$M'$$ and prompt $$P'$$ for the generative part.

A RAG pipeline is fully defined by the combination of these elements $$C', E', M', P'$$.


The RAG process can be written as the sequence of steps:
- extract set of chunks $${c'}$$ using text splitter $$C'$$
- embed chunks $${c'}$$ using $$E'$$

**Retrieval** step then consists of

For a genuine user query $$Q$$,

- embed the user query  $$Q$$ using $$E'$$
- Given $$Q$$, find the closest chunk $$c'$$

**Generation** step
- using prompt $$P'$$ and LLM $$M'$$ , derive the answer $$A'$$ such that   $$A' = P'_{M'}(Q, c') $$


## Performance evaluation of the RAG pipeline

By applying the RAG process to our set of baseline questions $$\{Q\}$$, we obtain the set of distances between the questions $${Q}$$ and the generated answers according to the Embedding model $$E'$$.

For each $$Q$$  from the set of Baseline question / answer pairs, we have

$${A'}$$ : $$ d(E'(Q), E'(A')) $$.

The experiment results consists of the set $$\{ (c', Q, A', E'(Q), E'(A'), d( E'(Q), E'(A')  ) \}$$

We can therefore evaluate the performance of the RAG pipeline  $$C', E', M', P'$$ by comparing the baseline  and the experiment distances :


$$ S_b =  \{ d( E(Q), E(A) \}$$

 vs

$$ S_e =  \{ d( E'(Q), E'(A') \}$$

where $$S_b$$ and $$S_e$$ are the set of scores obtained for the baseline and the experimental / evaluated RAG


Now 3 things can happen:
- $$S_b ~= S_e$$ The experiment generates answers that are as close to the questions as the answer directly generated from the text. This can be interpreted as a good result.

- $$S_b > S_e $$ The experimental RAG pipeline finds answers to the original questions that are closer than the answers derived directly from the corpus. This also indicates a good result.

- $$S_b < S_e$$ the baseline scores are lower than the experiment RAG scores. The experiment answers are not as close to the baseline answers. More work is required be considered to improve the performance of the RAG pipeline.


# Implementation

Let's take that for a spin

We already have a baseline set of Q&A. Now we need embeddings and distances.

We're going to use weaviate as a vector store. Weaviate provides
- data storage for embeddings and data
- fast retrieval of closest vectors
- the distance between a query and a vectorized text during the retrieval step
- and a simple API for all that

A _collection_ is the equivalent of a _table_ in a standard SQL database.

A collection is composed of properties (columns). You can specify which properties are vectorized or not. Properties that are vectorized are concatenated together before the vector is produced.  See [Configure semantic indexing](https://weaviate.io/developers/weaviate/config-refs/schema#configure-semantic-indexing) for details.

We will create 2 collections, one for the answers from the baseline Q&A and one for the answers from the experiment.

We use a local installation of the datastore. See [How to install Weaviate](https://weaviate.io/developers/weaviate/installation)

Stay tuned for the rest of the implementation of the pipeline. This is a work in progress and some details need to be ironed out before I can publish the code.

# Expectations, assumptions and ... results


Just to recap the main expectation for this evaluation method is to create a baseline of Q&As in order to score a given RAG pipeline composed of the 4 elements: chunkizer, vectorizer, generative model and prompt. This gives us a way to optimize the pipeline by changing these elements and monitoring the pipeline score.

## distance is not always a good measure of meaning and relevance

However, all this rests on another assumption, a huge one in fact. The underlying assumption is that the distance between embeddings of the baseline questions and the different answers produced by the RAG pipelines measures the relevance of the answer with regard to the question.

This works in simple cases where the answer is short and very specific.

- good answer => lower distance:
    - Q: what is the capital of France
    - A: Paris

- wrong answer => higher distance:
    - Q: what is the capital of France
    - A: London

But when the answers are more complex, the distance will be very dependent on the occurences of the words within the question and the answer.

for instance

- absurd answer but low distance score:
    - why is Paris a good tourist destination
    - Paris is a good tourist destination because my uncle is rich

Most of the words in the question are also in the answer and the resulting distance will be lower than for thiis answer

    - why is Paris a good tourist destination
    - The city offers a great selection of restaurants and museums


## The retrieved chunk can be misleading

The RAG method also assumes that the retrieved chunk is pertinent to the question. This is the repsonsibility of the retrieval phase, to find the most relevant chunk of text with regard to the question.

But when the retrieved chunk does brings the wrong information, the generated answer will not be correct.

Since retrieval is highly dependant on the wording of the question, nothing ensures that the retrieved chunk works as expected.

For instance, consider a debate on a hot topic where chunks can either reflect a position P or its contrary N.

depending on the words in the question, the retrieved chunks will lean towards one side P or the other N. And the generated answer will reflect the bias in the chunks.

This happened a few times in my experiment when the chunks were the summary of the different acts of the play and the question was about the reasons behind the nehavior of one of the character of that play in a given act.

"In act I, why does Harpagon quarrel with his son.""

As the plot was evolving between acts, but Harpagon kept quarreling with his son but for different reasons , depending on the  summary of the act that was retrieved the answer ended up different.

Finally, depending on the wording of the wrong answered it ended up with a better score than a more relevant answer.


## Measuring the impact of the chunk

On the positive side, the method allows to estimate the impact of using the extra information as context within the answer generating prompt. All ogher thing sbeing equal, the answer generated by the prompt with the chunk had lower distance to the question than the answer generated without the chunk










