---
title: "Stopwords in Weaviate"
date: 2023-12-07
author: Alexis Perrier
description: "Specify Non-English, French stopwords in a weaviate collection with the Python V4 API"
tags: [NLP, Python, Weaviate, Vector Database, Text Processing]
---

# Set stopwords in a weaviate collection



_tl;dr: Here's the solution: update the collection configuration with_

```python
collection.config.update(
    # Note, use Reconfigure here (not Configure)
    inverted_index_config=wvc.Reconfigure.inverted_index(
        stopwords_additions=["le", "la", "il", "elle"]
    )
)
```

and check with
```python
client.collection.get()
```

## Specify stopwords in a weaviate collection with the Python V4 API


I work on a French corpus composed of [Moliere's plays](https://moliere.love) and use [weaviate]() as a vector database to store the embeddings. Weaviate also does the vectorization of the text provided you specify a vectorizer. 

An important element when embedding text is of course the presence of stopwords. This is particulalry important when dealing with long chunk of text where stopwords tend to obsfucate the meaning, the signal contained in that text.

Weaviate has recently released a V4 of its [python API](https://weaviate.io/developers/weaviate/client-libraries/python). And the documenttation is not yet finished (as of 12/2023).

In terms of stopwords the default set is predefined to the English language. There is no set available for French, Spanish or any other non-English language.

The way to define a specfic list of stopwords is to set it explicitly with the  ```stopwords_additions``` parameter when creating the collection for the Python V4 API. The Python V3 API documentation  on [collection / class creation](https://weaviate.io/developers/weaviate/config-refs/schema) is quite exhaustive .

So the other day I find myself stuck trying to add that list of French stopwords but not finding the related documentation.

I found the solution after a good night's sleep.

Creating a collection in Weaviate goes as follows

```python
collection = client.collections.create(
    name= <collection_name>,
    vectorizer_config=vectorizer,
    generative_config=wvc.Configure.Generative.openai(),
    properties=[
        < list of properties>
    ]    
)
```

where [vectorizer](https://weaviate.io/developers/weaviate/modules/retriever-vectorizer-modules) can be the OpenAI's ada-02 model

```python
import weaviate.classes as wvc
vectorizer  = wvc.Configure.Vectorizer.text2vec_openai(vectorize_class_name = False)
```

I'm using a local install of weaviate so the client is instantiated with
```python
import weaviate
client = weaviate.connect_to_local(port=8080, grpc_port=50051,
            headers={ <specify your keys to OpenAI, Huggingface etc > }
)

```

## Specify French Stopwords

To specify stopwords you need to use the ```wvc.Configure.inverted_index(**params)``` function with the right parameters.

All the values below are the default ones except for the ```stopwords_additions``` key

```python
params = {
    "bm25_b": 0.75,
    "bm25_k1": 1.2,
    "cleanup_interval_seconds": 60,
    "index_timestamps":  False,
    "index_property_length":  False,
    "index_null_state":  False,
    "stopwords_preset": None,
    "stopwords_additions":  list_stopwords,
    "stopwords_removals": None,
}
```
 
Then create your collection setting  ```inverted_index_config = wvc.Configure.inverted_index(**params),```

```python
collection = client.collections.create(
    name= <collection_name>,
    vectorizer_config=vectorizer,
    generative_config=wvc.Configure.Generative.openai(),
    inverted_index_config = wvc.Configure.inverted_index(**params),
    properties=[
        < list of properties>
    ]
)
```

You can also not specify the ```inverted_index_config``` parameter when crearing the collection, to update later the config with

```python
collection.config.update(
    # Note, use Reconfigure here (not Configure)
    inverted_index_config=wvc.Reconfigure.inverted_index(
        stopwords_additions=["le", "la", "il", "elle"]
    )
)
```

To check that the config has been updated, you can list and check the collection config with 
```python
client.collection.get()
```

In my case, with a small list of French stopwords  this returns


```python
_CollectionConfig(name='Test', ...,
inverted_index_config=_InvertedIndexConfig(
    bm25=_BM25Config(b=0.75, k1=1.2),
    ...
    stopwords=_StopwordsConfig(
        preset=<StopwordsPreset.EN: 'en'>,
        additions=['il', 'elle', 'je', 'tu', 'nous', 'vous', 'ils', 'elles'],
        removals=None
    )),
    <some other info>
)
```

Notice that although I specified ```"stopwords_preset": None,``` in the params, the preset stopwords has still been set to ```<StopwordsPreset.EN: 'en'>```. I could not find a way to set the preset to None. Although this is a valid value as specified in the [documentation](https://weaviate.io/developers/weaviate/config-refs/schema#invertedindexconfig--stopwords-stopword-lists).
So it's expected that both the predefined set of English stopwords and the added list of French stopwords will be removed from the teext to embed.
