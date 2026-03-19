---
layout: prose
title: "Installing HTTP Extension Windows"
page_title: "Installing HTTP Extension Windows"
summary: "PostgreSQL extensions, HTTP client, Windows installation"
footer: 'Alexis Perrier - alexisperrier.com  https://discord.gg/DDbh5AyHYH'
---

# The HTTP extension

[github](https://github.com/pramsey/pgsql-http?tab=readme-ov-file)



# Install http extension on Windows

With grit and hard work you can do it!

![You can do it!](/images/dbsql/meme-974fro.jpg)



choose the right postgresql version

see https://www.postgresonline.com/journal/archives/371-http-extension.html

This will download the files somewhere on your laptop. You will need to copy them to the right place.

Once you are done installing the extension, you can check if it is installed with

```sql
select * from pg_available_extensions where name = 'http';
```

Once you are done installing the extension, help your classmate to install it.

# check if it's already installed

First check of the extension is already installed (you should be so lucky)

```sql
select * from pg_available_extensions where name = 'http';
```

If this returns 0 rows you have to install the http extension.

If this return one rows, you can ddirectly activate the extension with

```sql
CREATE EXTENSION http;
```

And then verify that the extension is listed with `\dx`

```sql
   Name   | Version |   Schema   |                                Description
----------+---------+------------+----------------------------------------------------------------------------
 http     | 1.6     | public     | HTTP client for PostgreSQL, allows web page retrieval inside the database.
```


---

see also

- [stackoverflow   install](https://stackoverflow.com/questions/76031067/how-to-install-http-extension-on-pgadmin)




---

# Instructions from chatgpt


> Double check before applying.  Understand what you do before applying.



---

## 🍎 macOS (All Versions) — How to Install the `http` Extension

### **1) Install PGXN Client**

Open Terminal:

```bash
brew install pgxnclient
```


### **3) Install the Extension Using PGXN**

```bash
pgxn install http
```


## ✅ 4) Enable the Extension in Your Database

Open **psql** **or** the **pgAdmin Query Tool** and run:

```sql
CREATE EXTENSION http;
```

Test it:

```sql
SELECT (http_get('https://httpbin.org/get')).content;
```

If you see JSON → ✅ Success.

---

## 🌟 Important Note for Postgres.app Users

Because Postgres.app installs multiple versions side-by-side, ensure `pgxn install` targeted the correct version.

Check your active server version:

```bash
psql --version
```

Check installed extension files:

```
ls /usr/local/share/postgresql/extension/ | grep http
```

If you used Postgres.app and things did not appear, run:

```bash
export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"
pgxn install http
```

This ensures the extension installs into *your* Postgres instance.


---


# Windows — Install the `http` Extension for PostgreSQL

### **Requirements **

* PostgreSQL (any version, e.g., 14, 15, 16)
* pgAdmin

### **Use PowerShell (Run as Administrator)**

You *must* use **PowerShell as Administrator** because we will copy files into PostgreSQL’s installation folders.

## 1) Determine your PostgreSQL version and install location

### **Open pgAdmin → connect → open Query Tool → run:**

```sql
SELECT version();
```

You will see something like:

```
PostgreSQL 15.4 ...
```

So note: **Your version = 15** (your number may differ).

### **Default install folder (remember this):**

```bash
C:\Program Files\PostgreSQL\<your-version>\
```

Examples:

```
C:\Program Files\PostgreSQL\14\
C:\Program Files\PostgreSQL\15\
C:\Program Files\PostgreSQL\16\
```

## 2) Download the prebuilt HTTP extension files

Go to:

[https://www.postgresonline.com/journal/archives/371-http-extension.html](https://www.postgresonline.com/journal/archives/371-http-extension.html)

Download the **ZIP** for your PostgreSQL version and architecture (most students = 64-bit).

Unzip it — you will see **at least these files**:

```
http.dll
http.control
http--1.5.sql (or similar version number)
```

## 3) Place the files in the correct directories

### **Open PowerShell as Administrator**

* Press `Start`
* Type `powershell`
* Right-click → **Run as Administrator**

### **Navigate to your PostgreSQL install path**

(Replace `15` with *your* version)

```bash
cd "C:\Program Files\PostgreSQL\15\"
```

### **Copy the files:**

| File              | Destination Folder                                |
| ----------------- | ------------------------------------------------- |
| `http.dll`        | `C:\Program Files\PostgreSQL\15\lib\`             |
| `*.control` files | `C:\Program Files\PostgreSQL\15\share\extension\` |
| `*.sql` files     | `C:\Program Files\PostgreSQL\15\share\extension\` |

So run (replace paths to where you unzipped):

```powershell
copy "C:\Users\YOURNAME\Downloads\http.dll" "C:\Program Files\PostgreSQL\15\lib\"
copy "C:\Users\YOURNAME\Downloads\http.control" "C:\Program Files\PostgreSQL\15\share\extension\"
copy "C:\Users\YOURNAME\Downloads\http--*.sql" "C:\Program Files\PostgreSQL\15\share\extension\"
```

> **Tip:** If your ZIP extracted into a folder, reference that folder instead of Downloads.


## 4) Restart the PostgreSQL Service

Still in **PowerShell (Admin)**:

```bash
net stop postgresql-x64-15
net start postgresql-x64-15
```

(Replace **15** with your version.)


## 5) Enable the extension inside your database

Open **pgAdmin → Query Tool**, then run:

```sql
CREATE EXTENSION http;
```

Then test:

```sql
SELECT (http_get('https://httpbin.org/get')).content;
```

If you see JSON → ✅ **Success**

---

# ✅ Summary

| Step | Action                                        |
| ---- | --------------------------------------------- |
| 1    | Check Postgres version in pgAdmin             |
| 2    | Download matching `http` extension ZIP        |
| 3    | Copy `http.dll` → `lib/`                      |
| 4    | Copy `.control` + `.sql` → `share/extension/` |
| 5    | Restart PostgreSQL service                    |
| 6    | Run `CREATE EXTENSION http` in pgAdmin        |
