---
layout: slides
title: "Python classes"
slides_project_home: /ipsa_python/oop/
footer: 'Alexis Perrier - AnIn211 - Pratical Programming in Python - IPSA'
---

# https://alexisperrier.com/ipsa_python/oop/

---

## Object-Oriented Programming (OOP), why ?

A programming paradigm that organizes code into "_objects_"

- bundles of data (**attributes**) and functions (**methods**)
- that represent real-world entities or concepts,
- emphasizing concepts like encapsulation, inheritance, and polymorphism.

---

## **Main alternative**:

**Procedural programming** - where code is organized as a sequence of functions or procedures that operate on data, focusing on "_what needs to be done_" step-by-step rather than modeling entities (common in scripts, system programming, and simpler programs).

**Other alternatives**: **Functional programming** (treats computation as evaluation of mathematical functions, avoiding state changes) and **declarative programming** (describes what the program should accomplish rather than how) (see SQL).

---
# Why OOP?

Python's OOP features enable code reusability through **inheritance**, better **organization** for large projects, natural modeling of real-world problems, and easier _maintenance_ since related data and functions are grouped together in classes.

---

# **Key OOP advantages**:

**Modularity** makes debugging easier, code reusability saves development time, encapsulation protects data integrity, abstraction hides complex implementation details, and it scales well.

- **encapsulation** protects data integrity,
- **inheritance** promotes code reuse and hierarchy,
- **polymorphism** allows flexible, interchangeable components .

---
# Core OOP Concepts

**Encapsulation**: Bundling data and methods that operate on that data within a single unit (class), while hiding internal implementation details. Like a car - you use the steering wheel and pedals without needing to know how the engine works internally.

**Inheritance**: Creating new classes based on existing ones, inheriting their attributes and methods. A `Dog` class can inherit from `Animal` class, automatically getting methods like `eat()` and `sleep()` while adding its own like `bark()`.

**Polymorphism**: Different classes can be used interchangeably if they share the same interface. Both `Movie` and `Song` classes can have a `play()` method - you can call the same method name on different object types and get appropriate behavior for each.


---

# example

Image an app with a class `Movie` and a class `Songs` which both define a `play` method.
but since there's 2 different classes, the `play` method is different.

And you can call a play method on different Movies and Songs instances

```python
movie = Movie("Inception", 148, "Christopher Nolan")
movie.play()

song = Song("Bohemian Rhapsody", 5, "Queen")
song.play()
```

Without classes you'd have to define 2 functions `movie_play` and `song_play`  write:

```python
movie_play(movie)
song_play(song)
```

=> **#namespace**


---

# Attributes and methods

for a `Movie` class:

- **attributes** : duration, title, director, actors, genre, rating
- **public methods** : play, rate, like, share, stream, review

Public methods are accessible from outside the class.

- **private methods** : _update_rating, _add_actor, _validate_review, generate_subtitles(), etc

Private methods are not accessible from outside the class.


---

# Object and instances

<div class="columns">
<div markdown=1 >
You define a class

```python
def Movie():
    def __init__(self, title, duration, director):
        self.title = title
        self.duration = duration
        self.director = director
```

You can then create instances of this class:

```python
movie = Movie(
    "Inception",
    148,
    "Christopher Nolan"
)
```

```python
movie2 = Movie(
    "The Dark Knight",
    152,
    "Christopher Nolan"
)
```

</div>
<div markdown=1 >


You can access the attributes of an instance:

```python
movie.title
movie.duration
movie.director
```

and apply methods:

```python
movie.play()
movie.rate(5)
movie.like()
movie.share()
movie.stream()
movie.review()
```

<div class="boom">
Class names start with a capital letter.
Instance names start with a lowercase letter.
</div>
</div>
</div>

---

# Functions vs methods

<div class="columns">
<div markdown=1 >


**Functions** are standalone blocks of code that perform a specific task.

**Methods** are functions that are associated with an object and can access and modify the object's state.

</div>
<div markdown=1 >

## Example:  the String class

```python
str = "Hello"
str.upper()
```

here `str` is an **instance** of the String class and `upper()` is a **method** of the string class

```python
str = "Hello"
len(str)
```

here `len` is a **function** that takes a string as an argument

</div>
</div>

---

# Class methods vs Instance methods


**Instance methods**: The default type - operate on individual object instances. First parameter is always self, which refers to the specific instance. Can access and modify both instance attributes and class attributes through self.

**Class methods**: Operate on the class itself rather than instances. Use @classmethod decorator, first parameter is cls (the class). Often used for alternative constructors or factory methods that create instances.

**Key difference**: Instance methods need an object to work with (`obj.method()`), while class methods can be called on the class directly (`MyClass.method()`).

---

# Class methods vs Instance methods


Use **instance methods** for behavior specific to individual objects - like a `movie.list_actors()` or `movie.add_rating()` methods.

Use **class methods** for alternative ways to create objects (`User.from_email()`) or operations affecting all instances (like counting total objects created) `Movie.average_rating()` , ....

---

# the `__init__()` method

called the **constructor**


It is a special method that automatically runs when you create a new instance of a class, initializing the object's attributes.

## An object

An instance of a class, possessing its own attributes and methods.

## Self ?

self is a reference to the current instance of the class : the specific object that's calling the method.