---
layout: slides
title: "Python classes - basics 2"
slides_project_home: /ipsa_python/oop2/
footer: 'Alexis Perrier - AnIn211 - Pratical Programming in Python - IPSA'
---
<TitleSlide>

# OOP in Python: Key Concepts
## [https://alexisperrier.com/ipsa_python/oop2/](/ipsa_python/oop2/)

</TitleSlide>
---

## Class vs Instance Attributes

```python
class Dog:
    species = "Canis familiaris"  # Class attribute

    def __init__(self, name):
        self.name = name  # Instance attribute
```

<div class="columns">
<div markdown=1 >

### Class Attributes
- Shared by **all instances** of a class
- Defined directly in the class body
- Same value across all objects

</div>
<div markdown=1 >

### Instance Attributes
- Unique to **each instance**
- Defined using `self` in `__init__`
- Different values per object

</div>
</div>


---

# When to Use Class Attributes

<div class="columns">
<div markdown=1 >


### Example: Employee ID Generator
```python
class Employee:
    company = "TechCorp"  # Shared constant
    next_id = 1000  # Shared counter

    def __init__(self, name):
        self.name = name
        self.id = Employee.next_id
        Employee.next_id += 1

# Usage
emp1 = Employee("Alice")  # ID: 1000
emp2 = Employee("Bob")    # ID: 1001
```
</div>
<div markdown=1 >

### Use Cases
- **Constants** shared by all instances
- **Default values** for the class
- **Counters** tracking all instances

</div>
</div>

---

# The Destructor `__del__`

<div class="columns">
<div markdown=1 >

### Use Case: Resource Management
```python
class FileHandler:
    def __init__(self, filename):
        self.file = open(filename, 'w')
        print(f"Opened {filename}")

    def __del__(self):
        self.file.close()
        print("File closed safely")

# Automatic cleanup when object is destroyed
handler = FileHandler("data.txt")
# File automatically closed when handler is garbage collected
```

</div>
<div markdown=1 >

### What is `__del__`?
- Called when object is about to be destroyed
- Performs cleanup operations

<div class="boom">
Timing is unpredictable (handled by garbage collector)
</div>
</div>
</div>


Better Alternative: **Context Managers** (`with` statement) are preferred for resource management!

---

# When is `__del__` Called?

### Timing of `__del__`
- When reference count reaches **zero**
- During **garbage collection**
- At **program termination**
- **NOT guaranteed** to be called!

```python
class Example:
    def __init__(self, name):
        print(f"Example instance created")
        self.name = name

    def __del__(self):
        print(f"{self.name} is being destroyed")

# Cases when __del__ is called
obj = Example("Object1")
obj = None  # Reference count = 0, __del__ called
```

`__del__` is called when the function exits

```python
def create_temp():
    temp = Example("TempObject")
    # __del__ called when function ends

create_temp()  # TempObject destroyed here
```

---

# The `with` Statement

👉 "__del__ is not deprecated, but it’s generally considered **bad practice**. Use context managers (with / __enter__, __exit__) or try/finally for resource cleanup instead."

### Context Managers - Better Resource Management - `with` statement
- **Guaranteed** cleanup with `__enter__` and `__exit__`
- Exception-safe
- More predictable than `__del__`

```python
class DatabaseConnection:
    def __enter__(self):
        print("Opening connection")
        # Setup code here
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Closing connection")
        # Cleanup happens even if error occurs

# Usage
with DatabaseConnection() as db:
    # Use the connection
    pass  # Connection auto-closed after this block
```

---

## Common Dunder Methods


**🔑 Dunder methods (a.k.a. magic methods)**
In Python, **dunder methods** are special methods with double underscores (e.g. `__len__`, `__str__`, `__add__`) that let your objects interact with built-in functions and operators.

Dunder methods define how your class behaves in the Python ecosystem (e.g. `len(obj) → obj.__len__()`, `str(obj) → obj.__str__()`).



[https://realpython.com/python-magic-methods/](https://realpython.com/python-magic-methods/)


Using __len__ or any other dunder method is mostly for convenience and interoperability because it is standard across many object types.


---

### Essential Dunder Methods
```python
class Book:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages

    def __str__(self):
        return f"Book: {self.title}"  # Human-readable

    def __repr__(self):
        return f"Book('{self.title}', {self.pages})"  # Debug info

    def __len__(self):
        return self.pages  # len(book)

    def __eq__(self, other):
        return self.title == other.title  # book1 == book2

    def __getitem__(self, page):
        return f"Content of page {page}"  # book[5]

# Usage
book = Book("Python Guide", 300)
print(str(book))      # "Book: Python Guide"
print(len(book))      # 300
print(book[10])       # "Content of page 10"
```

---

# 📏 `def __len__` vs `.len()`

**`__len__` dunder method**

* Enables `len(obj)` ✅
* Standard Python protocol → works like `list`, `str`, `dict`, `array`, ...
* Used for truthiness (`if obj:` calls `__len__` if `__bool__` missing)
* Promotes **interoperability** & readability

```python
class Playlist:
    def __len__(self): return 300

len(Playlist())   # 300
```

**`.len()` regular instance method**

  * Custom API → only works as `obj.len()`
  * Not recognized by built-ins ❌
  * Less idiomatic

```python
class Playlist:
    def len(self): return 300

Playlist().len()  # 300
len(Playlist())   # TypeError
```

👉 **Takeaway:** Use `__len__` to make your class a **first-class Python container**.

