---
title: "Amazon Machine Learning: Nice and Easy or Overly Simple?"
date: 2016-02-05
author: Alexis Perrier
description: "Amazon Machine Learning is a predictive analytics service with binary/multiclass classification and linear regression features. The service offers a simple workflow but lacks model selection features and has slow execution times. Predictive performances are satisfying."
tags: [AWS, Machine Learning, MLaaS, Scikit-learn, SGD, Predictive Analytics]
image: /images/blog/effective_amazon_machine_learning_cover.png
---

Machine Learning as a Service (MLaaS) promises to put data science within the reach of companies. In that context, Amazon Machine Learning is a predictive analytics service with binary/multiclass classification and linear regression features. The service offers a simple workflow but lacks model selection features and has slow execution times. Predictive performances are satisfying.

Data science is hot and sexy, but it is complex. Building and maintaining a data science infrastructure can be expensive. Experienced data scientists are scarce and in-house development of algorithms, building predictive analytics applications, and creating production-ready APIs, requires specific know-how and resources. Even though companies may anticipate the benefits of a data science service, they may not be ready to make the necessary investments without testing the waters first.

This is where Machine Learning-as-a-Service comes in with a promise to simplify and democratize Machine Learning: reap the benefits of Machine Learning within a short timeframe while keeping costs low.

Several key players have entered that field: Google Predictive Analytics, Microsoft Azure Machine Learning, IBM Watson, Big ML and many others. Some offer a simplified Prediction Analytics service while others offer a more specialized interface and data science services beyond prediction.

One relatively new entrant is AWS with its Amazon Machine Learning service. Launched in April 2015, less than a year ago, at the AWS 2015 summit, Amazon Machine Learning aims at simplifying predictive analytics by focusing on the data workflow and keeping the more involved and challenging technical details under the hood. By removing an important part of the technical details from the sight of the user, Amazon Machine Learning brings data science to a much broader audience. It significantly lowers the barrier of entry for companies wishing to experiment with predictive analytics by making powerful Machine Learning tools available and operational in a very short timeframe.

A large portion of the Internet already runs on AWS many services. AWS move to add a Machine Learning offering to the mix will allow engineers to include predictive analytics capabilities into their existing applications.

Amazon Machine Learning enables companies to experiment with data science and assess its business value without committing significant resources and investments. In that regard, Amazon Machine Learning is Predictive Analytics 101 for companies wishing to board the data science train.

## Pistons, Carburetors and Filters: What's Under the Hood?

One important trait of Amazon Machine Learning is its simplified approach to Machine Learning. It "dumbs down machine learning for the rest of us [InfoWorld]"; it "puts Machine Learning In Reach Of Any Developer [Techcrunch]."

But predictive analytics is a complex field. Tasks such as data munging, feature engineering, parameter tuning, and model selection take time and follow a well established set of protocols, methods and techniques. Can Amazon Machine Learning's simplified service still deliver performance at the expense of this complexity? Can you still reap the benefits of predictive analytics with a simplified Machine Learning pipeline?

### 1 Model, 1 Algorithm, 3 Different Tasks, Easy Pipeline Setup, Wizards, and Smart Defaults

According to the documentation, Amazon Machine Learning is based on linear models trained via Stochastic Gradient Descent (SGD for short). That's it. No Random Forests or Boosted trees, no Kernel SVM, Bayes classifiers or Clustering. This may appear to be a drastic limitation. However the Stochastic Gradient Descent algorithm developed by Leon Bottou is a very stable and resilient algorithm. This algorithm has been around for a long time with many improved versions over the years.

This simple predictive setup will most probably be sufficient to address a large portion of real world business prediction problems. As we will see it also presents decent performances.

### Tasks

The Amazon Machine Learning platform gives you a choice of three supervised learning tasks, each with their associated models and loss functions:

- **binary classification** with logistic regression (logistic loss function + SGD)
- **multiclass classification** with multinomial logistic regression (multinomial logistic loss + SGD)
- and **regression** with linear regression (squared loss function + SGD)

For binary classifier, the scoring function is the F1-measure; for multiclass classifier, scoring is the macro average F1-measure which averages the F1-measure of each class; and for regression the RMSE metric is used. Commonly used in information retrieval, the F1-measure is the harmonic mean of precision and recall. It is a robust classification measure somewhat insensitive to multiclass imbalance.

### Feature Engineering with Recipes

Within the Amazon Machine Learning pipeline is the possibility to transform your variables with Recipes. Several transformations are available through JSON formatted instructions: replacing missing values, Cartesian products, binning categorical variables into numerical ones, or forming n-grams for text data.

For instance here is one of the recipe that was automatically generated to transform categorical values into numeric ones when working on the iris dataset.

```json
{
  "groups" : {
    "NUMERIC_VARS_QB_50" : "group('sepal_width')",
    "NUMERIC_VARS_QB_20" : "group('petal_width')",
    "NUMERIC_VARS_QB_10" : "group('petal_length','sepal_length')"
  },
  "assignments" : { },
  "outputs" : [
    "ALL_CATEGORICAL",
    "quantile_bin(NUMERIC_VARS_QB_50,50)",
    "quantile_bin(NUMERIC_VARS_QB_20,20)",
    "quantile_bin(NUMERIC_VARS_QB_10,10)"
  ]
}
```

### Training vs Validation Sets

By default, Amazon Machine Learning splits your training dataset into 70/30 chunks. Here again Amazon Machine Learning simplifies rich techniques into very simple and limited choices. Splitting your data into training and validation could be done in a myriad ways which Amazon Machine Learning boils down to randomizing the samples or not. You can of course still split your data as you wish outside of Amazon Machine Learning, create a new datasource for a held-out set, and evaluate the performance of your model on this held-out dataset.

### SGD Parameter Tuning

A reduced number of parameters are available for tuning your model: the number of passes, the regularization type (None, L1, L2), and the regularization parameter. It is not possible to set up the learning rate of the algorithm and no information is given on how this important parameter is set.

### But Where Do You Start?

With over 50 different services with cool names like Elastic Beanstalk, Kinesis, RedShift, or Route 53, the AWS console home page can definitely be intimidating. However, thanks to good documentation and a set of well conceived wizards, creating your first project is a fast and pleasant experience.

Once you have your data set in a properly formatted csv file on S3, the whole process is composed of four steps:

- Creating a **datasource**: Telling Amazon Machine Learning where your data is and what schema it follows
- Creating a **model**: The task is inferred from the data type of your target (numeric => regression, binary => classification or categorical for multinomial classification) and you can set some custom parameters to the model
- **Training** and evaluating the model
- Performing batch **predictions**

The best strategy to get started is to follow the well written and detailed Amazon Machine Learning's tutorial.

## And in Practice?

### Cross Validation

There is no cross-validation methods, per se, in Amazon Machine Learning. The suggested way is to create your data files following a K-fold cross validation scheme, create the data sources for each fold, and train models on each datasource. For instance, in order to perform a four-fold cross-validation you would need to create four datasources, four models and four evaluations. You can then average the four evaluation scores to obtain the final cross-validated score of your model.

### Overfitting

Overfitting happens when your model adheres so closely to the training data that it loses its ability to predict new data. Detecting overfitting is important to make sure your model has any predictive power. It can be done via a Learning Curve, by comparing error curves between training sets and validation sets for different sample sizes.

Amazon Machine Learning offers two classic regularization methods (L1 Lasso and L2 Ridge) to reduce overfitting but no overfitting detection methods. To check if your model is overfitting your training data, you would need to create different datasets and models and evaluate each of them.

### Costs

Feature engineering and feature selection is a rinse-and-repeat process that requires creating and evaluating many of datasets. Each time a new data source is created, Amazon Machine Learning carries out a statistical analysis of the data which can add significantly to the overall cost of a project. While researching for this article, 95% of the costs were due to creating data statistics for each new datasources I tried. And it took Amazon Machine Learning around 15 hours to process approximately 400,000 samples.

### Alternative to the Console

Building a fast test/fail loop is primordial to any data science project. Back and forth processes between data files, models and validations need to happen in order to build a resilient model with strong predictive powers.

Interacting with Amazon Machine Learning through the UI quickly becomes tedious especially if you're already comfortable with the command line. A brand new Data-Model-Evaluation process involves about eight to ten pages, fields, and clicks. All this UI goodness takes time. Furthermore each new entity can take a few minutes to be available. You end up with a very slow process compared to a scripting based flow (command line, R studio, Jupyter notebooks, ...).

Using recipes, uploading predefined schemas for your data sources, and using AWS CLI to manage S3 will help speed things up.

AWS offers SDKs in many languages including methods for Amazon Machine Learning. You can drive your Amazon Machine Learning projects in Python, Java or Scala.

Interacting with Amazon Machine Learning through scripting is probably the most efficient way to interact with the service. But if you're going to be writing scripts in Python anyway, the advantage of using Amazon Machine Learning becomes less obvious. You might as well use a dedicated data science toolkit such as Scikit-learn.

## Case Study

By being limited to linear models and the Stochastic Gradient Descent algorithm, one may wonder about the service's performances. In the rest of this article, I will compare Scikit-learn and Amazon Machine Learning performances for binary and multiclass classification.

### Iris Dataset

Let's start with a simple and very easy multi-class classification dataset, the Iris dataset, and compare performances of Scikit-learn's SGDClassifier with the Amazon Machine Learning multi-class classification.

The SGDClassifier is set up similarly to the Amazon Machine Learning SGD parameters:

- L2 regularization (alpha = 10⁻⁶)
- optimal learning rate
- log loss function
- 10 iterations

The training set is split 70/30 for training and evaluation with random sample selection. The macro-averaged F1-score is used both with Scikit and Amazon Machine Learning.

The final evaluation score on the held-out set is very similar between Scikit-learn and Amazon Machine Learning with:

- Scikit-learn: **0.93**
- Amazon Machine Learning: **0.94**

So far so good. Now for a more complex dataset.

### Kaggle Airbnb Data

The recent Airbnb New User Bookings Kaggle competition consists in predicting the country destination of Airbnb users given a series of datasets (country, age gender info, users and sessions).

We will simplify the dataset and only consider the user training data which is composed of features such as: gender, age, affiliate, browser, date of registration, etc. The data set is freely available on the competition page, and only requires registration to Kaggle.

In this dataset, about 40% of all users have not made any bookings. Instead of trying to predict the country of destination (if any), we will try to predict whether a user has booked a reservation or not, therefore solving a binary classification problem.

Using 100k rows for a training dataset and the AUC score we get the following performance results on the training dataset:

- Amazon Machine Learning SGD: **0.71**
- scikit SGD: **0.61**
- scikit RandomForest: **0.70**
- XGboost: **0.74**

*Note: This is by no means intended to be a benchmark. The results above are only intended as illustration.*

We tried several settings for SGD in scikit and could not get much closer to Amazon Machine Learning score. The scores were averaged over the initial validation 30k samples created by Amazon Machine Learning and another heldout set of 50k samples.

No grid search was used for the Random Forest of the XGBoost classifiers. We used the default settings whenever possible.

What these results illustrate is that Amazon Machine Learning's performances are as good as they can get when using a SGD classifier. The Amazon Machine Learning SGD outperforms Scikit-learn's SGD. It is in the same ballpark as Random forest and is outperformed by XGboost.

## Conclusion

In conclusion Amazon Machine Learning is a great way for companies to quickly start data science projects. The service is performant and easy to use. But it is missing important model selection features, has a very restricted set of algorithms and long execution times.

Amazon Machine Learning's simplified approach enables engineers to quickly implement predictive analytics services. Which in turns allows companies to experiment and assess the business value of Data science.

It is also an excellent platform to learn and practice machine learning concepts without worrying about algorithms and models. A good way for aspiring data scientist to experience a real although simplified, data science project workflow.

The console-based workflow is slow. Using SDKs and AWS CLI quickly becomes necessary.

Tuning the model to address under-fitting and overfitting issues is possible through regularization. However, there is no easy way to detect the presence of overfitting or under-fitting. Adding classic visualization such as learning curves would greatly facilitate model selection.
