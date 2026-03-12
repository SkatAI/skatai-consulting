---
title: "Best practices when sharing your data analysis - Jupyter Notebooks"
date: 2020-02-15
author: Alexis Perrier
description: "Here are a few tips to make things easier and just a little bit pro when sharing your data analysis Jupyter notebook"
tags: [Data Science, Notebooks, Jupyter]
---

# Tips to make you data analysis easier to share

### Context:

You work on a large dataset let's say over 1Gb. You do an analysis. And you want to share

* the data
* the script / jupyter notebook

so that other people can work / reproduce / tweak your results.

Here are a few personal tips to make things easier for the poor schmuck / schmuckette who has to read your code.

### Compressed data in a bucket

Host your data on S3, google storage, Azure, dropbox etc .... whatever fits your mood as long as it can provide a unique URI.

Sharing datasets in an email, or in google drive is flaky and confusing.
Drive is not the right place to host datasets. Space is limited, and access control can be hazy.

By hosting the dataset on the cloud:

* your data has a unique URI. It is centralized, and you can easily enforce versions of the data.
* You control who has access.
* You are not limited in space.

When you share your notebook, the data is downloaded using this unique URI instead of

    <this is my local path, don't forget to change it to your own local path>.


However, managing access permissions on specific items in the cloud can be a [real pain](https://www.trek10.com/blog/aws-s3-permissions/).

By the way ```pd.read_csv``` natively reads gzipped files :). Just add the ```compression='gzip'``` parameter:

    df = pd.read_csv('S3_bucket/sample.tar.gz', compression='gzip')

### host your notebook on google colab or on a similar executable platform

Your script may be efficient, bug free, superbly commented out etc ... but still end up only working only on your platform.
I've had the case recently of a friend, not particularly python savvy, trying to open a 1.9 Gb text file on a windows machine and being faced with abstruse unicode errors. He was stuck. However, the same script worked like a charm on my mac.

So hosting the notebook on Google Colab will go a long way to make it reproducible without undue efforts.

### Demo and Prod mode

If the data is large and running the whole notebook takes forever, it's always a good idea to implement 2 modes: a sanbox and a production one with a simple test.
Something as simple as:
    MODE = "demo"
    MODE = "prod"


    if MODE == 'demo':
        # subsample the large initial dataset
    else:
        # basically do nothing

    # then the rest of the code and results etc ...

This way the recipient of your analysis can run the whole script quickly and start playing with the parameters and results right away instead of having to wait for loops or apply lambdas to finish.

You can choose whichever mode as the default one depending on your audience.

### One operation per cell

Following the single responsibility principle, is an excellent practice when working with jupyter noteboooks.


The single responsibility principle states that _every module, class, function should have responsibility over a single part of the functionality provided by the script._ [wikipedia single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)

This allow the user to insert other cells to explore the resulting objects and data. Very useful.

The [ruby](https://thoughtbot.com/blog/back-to-basics-solid) community is very strong on that single responsibility principle with excellent results in terms of bug reduction, readability and maintainability of the code.

### Structure your code
The more structure the better. By default

1. I always import all the libraries,
2. then define all the functions,
3. load the data (from AWS S3). (subset the datsaet in DEMO mode.)
4. make sure it's as expected,
5. explore it (df.head(), df.describe())
6. and finally dive into the problem at hand

### From start to finish, is your notebook really running?

The main default of Jupyter notebooks is the lost state problem where a cell depends on previous runs of other cells which may have already been modified. So just making sure everything works as intended from importing the libraries to the end results is adamant before sharing.

### Add a requirements file

I find this optional but that's just my ingrained laziness. See this post for more on the subject by [JakevanderPlas](https://twitter.com/jakevdp?lang=en) on [Installing Python Packages from a Jupyter Notebook](https://jakevdp.github.io/blog/2017/12/05/installing-python-packages-from-jupyter/)

### super meaningful variables names.
Can't emphasize this one enough. I often spend significant amounts of time looking for synonyms that will convey precisely the true nature of an important variable to a reader, myself included.
The time gained by abbreviating any variable will be lost a thousand fold later on when trying to figure out what the variable stands for.


### And do follow coding best practice such as:

* Alternate code with comments specific markdown cells and data exploration cells
* Keep the code [DRY](https://en.wikipedia.org/wiki/Don't_repeat_yourself)
* comment and exploration cells
* avoid loops and prefer array operations
* comment and exploration cells
* insert test cells dedicated to [asserting](https://dbader.org/blog/python-assert-tutorial) that what you have is what you expect
* comment and exploration cells
* etc ...

Comments should focus on explaining the choices made in terms of methods and parameters. Not simply rephrasing the code.

### Elsewhere:

Google has a longer, more precise list of excellent [best practices when working on Google Colab](https://cloud.google.com/blog/products/ai-machine-learning/best-practices-that-can-improve-the-life-of-any-developer-using-jupyter-notebooks).

A good paper on [Ten simple rules for writing and sharing computational analyses in Jupyter Notebooks](https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1007007)

Please drop me a line on [twitter @alexip](https://twitter.com/alexip) if you'd like to add something or comment an item.

Cheers!
