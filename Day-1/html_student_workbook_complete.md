# HTML Student Workbook
## Beginner to Builder Edition

---

# How to Use This Workbook

This workbook is designed for:

- Absolute beginners
- Fast practical learning
- Hands-on building
- Repetition and retention

## Rules for Students

### 1. Type Everything Yourself
Do NOT copy-paste.

Typing improves memory.

---

### 2. Experiment Constantly
Break things.

Modify:
- text
- tags
- images
- layouts

Learning happens through experimentation.

---

### 3. Build While Learning
Do NOT only read.

Every topic should involve:
- typing
- building
- testing

---

### 4. Learn Structure First
HTML is NOT styling.

HTML gives:
- structure
- meaning
- organization

CSS handles appearance.

---

# HTML Deep Dive Reference Guide
## Complete Beginner to Intermediate HTML Handbook

---

# HTML Philosophy

HTML is not programming.

HTML is:
- structure
- meaning
- organization
- semantic representation of content

Frontend developers use HTML to:
- divide webpages into sections
- represent information
- build accessible interfaces
- create SEO-friendly pages

---

# The Browser Rendering Pipeline

When you open a webpage:

1. Browser requests HTML
2. Server sends HTML
3. Browser parses HTML
4. DOM Tree is created
5. CSS is applied
6. JavaScript executes
7. Final UI renders

---

# DOM (Document Object Model)

Every HTML page becomes a tree structure.

Example:

```html
<body>
    <section>
        <h1>Hello</h1>
    </section>
</body>
```

DOM Representation:

```text
body
 └── section
      └── h1
```

This is critical for understanding frontend engineering.

---

# HTML Boilerplate Explained in Depth

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Document</title>
</head>

<body>

</body>

</html>
```

---

# <!DOCTYPE html>

Purpose:

Tells browser:

```text
Use modern HTML5 standards.
```

Without it:
- browser may enter quirks mode
- layouts may behave inconsistently

---

# <html>

Root element.

Everything inside webpage exists within html tag.

---

# lang Attribute

```html
<html lang="en">
```

Helps:
- search engines
- accessibility tools
- screen readers

---

# <head>

Contains invisible webpage metadata.

Examples:
- title
- stylesheets
- fonts
- meta tags
- SEO tags

---

# Meta Charset

```html
<meta charset="UTF-8">
```

Supports:
- emojis
- special characters
- multiple languages

---

# Viewport Meta Tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Critical for responsive design.

Without this:
- mobile layouts break
- scaling issues occur

---

# Title Tag

```html
<title>My Website</title>
```

Appears:
- browser tab
- search engine results

---

# Body Tag

Contains all visible webpage content.

---

# Chapter 1 — Introduction to HTML

# What is HTML?

HTML stands for:

> HyperText Markup Language

HTML is used to create the structure of webpages.

Think of HTML as:

- skeleton of a webpage
- building blocks of websites
- structure of web applications

---

# Real-World Analogy

| Technology | Purpose |
|---|---|
| HTML | Structure |
| CSS | Styling |
| JavaScript | Interactivity |

---

# How Websites Work

1. User opens browser
2. Browser requests webpage
3. Server sends HTML
4. Browser renders webpage

---

# Your First HTML Page

```html
<!DOCTYPE html>
<html>

<head>
    <title>My First Page</title>
</head>

<body>

    <h1>Hello World</h1>

</body>

</html>
```

---

# Understanding the Boilerplate

## <!DOCTYPE html>
Tells browser this is an HTML5 document.

---

## <html>
Root element of webpage.

---

## <head>
Contains:
- title
- metadata
- links

---

## <body>
Contains visible webpage content.

---

# Student Activity

Create a webpage with:

- Your name
- Your college
- Your hobbies
- Your career goals

---

# Chapter 2 — Headings and Paragraphs

# Headings

HTML provides 6 heading tags.

```html
<h1>Main Heading</h1>
<h2>Sub Heading</h2>
<h3>Section Heading</h3>
<h4>Smaller Heading</h4>
<h5>Small Heading</h5>
<h6>Tiny Heading</h6>
```

---

# Important Rule

`h1` should usually be the main heading of page.

---

# Paragraph Tag

```html
<p>
This is a paragraph.
</p>
```

Paragraphs are used for:
- descriptions
- explanations
- article content

---

# Line Break

```html
<br>
```

Moves content to next line.

---

# Horizontal Rule

```html
<hr>
```

Creates horizontal separator.

---

# Practice Task

Create:

- Newspaper article
- Blog section
- Personal introduction

using:
- headings
- paragraphs
- line breaks
- horizontal rules

---

# Chapter 3 — Text Formatting Tags

# Bold Text

```html
<strong>Important Text</strong>
```

---

# Italic Text

```html
<em>Emphasized Text</em>
```

---

# Underline

```html
<u>Underlined Text</u>
```

---

# Small Text

```html
<small>Small text</small>
```

---

# Marked Text

```html
<mark>Highlighted Text</mark>
```

---

# Practice Activity

Create a movie review using:
- bold text
- italic text
- highlighted text

---

# Chapter 4 — Links and Navigation

# Anchor Tag

```html
<a href="https://google.com">
    Visit Google
</a>
```

---

# Open in New Tab

```html
<a href="https://google.com" target="_blank">
    Open Google
</a>
```

---

# Navigation Example

```html
<nav>
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
</nav>
```

---

# Student Challenge

Build:
- website navigation menu
- portfolio navigation bar

---

# Chapter 5 — Images

# Adding Images

```html
<img src="image.jpg" alt="Sample Image">
```

---

# Important Attributes

| Attribute | Purpose |
|---|---|
| src | image location |
| alt | alternative text |
| width | image width |
| height | image height |

---

# Example

```html
<img
    src="nature.jpg"
    alt="Nature Image"
    width="300">
```

---

# Practice Task

Create:
- travel gallery
- product gallery
- photography page

---

# Chapter 6 — Lists

# Ordered List

```html
<ol>
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
</ol>
```

---

# Unordered List

```html
<ul>
    <li>Frontend</li>
    <li>Backend</li>
    <li>Database</li>
</ul>
```

---

# Nested List

```html
<ul>
    <li>Frontend
        <ul>
            <li>HTML</li>
            <li>CSS</li>
        </ul>
    </li>
</ul>
```

---

# Practice Task

Create:
- shopping list
- syllabus list
- restaurant menu

---

# Chapter 7 — Tables

# Basic Table Structure

```html
<table border="1">

    <tr>
        <th>Name</th>
        <th>Age</th>
    </tr>

    <tr>
        <td>Karun</td>
        <td>25</td>
    </tr>

</table>
```

---

# Table Tags

| Tag | Purpose |
|---|---|
| table | table container |
| tr | table row |
| th | table heading |
| td | table data |

---

# Practice Activity

Build:
- student marks table
- employee table
- cricket scorecard

---

# Chapter 8 — Forms

# Why Forms Matter

Forms collect user data.

Examples:
- login page
- signup page
- feedback form
- checkout page

---

# Form Structure

```html
<form>

</form>
```

---

# Text Input

```html
<input type="text">
```

---

# Email Input

```html
<input type="email">
```

---

# Password Input

```html
<input type="password">
```

---

# Number Input

```html
<input type="number">
```

---

# Date Input

```html
<input type="date">
```

---

# File Upload

```html
<input type="file">
```

---

# Radio Buttons

```html
<input type="radio" name="gender"> Male
<input type="radio" name="gender"> Female
```

---

# Checkboxes

```html
<input type="checkbox"> HTML
<input type="checkbox"> CSS
```

---

# Select Dropdown

```html
<select>
    <option>Frontend</option>
    <option>Backend</option>
</select>
```

---

# Textarea

```html
<textarea></textarea>
```

---

# Submit Button

```html
<button type="submit">
    Submit
</button>
```

---

# Mini Project

Build:
- student registration form
- login form
- feedback form

---

# Chapter 9 — Semantic HTML

# What is Semantic HTML?

Semantic tags describe meaning.

Examples:
- header
- footer
- article
- nav

---

# Common Semantic Tags

```html
<header></header>
<nav></nav>
<main></main>
<section></section>
<article></article>
<footer></footer>
```

---

# Why Semantic HTML Matters

- Better SEO
- Better accessibility
- Easier readability
- Better organization

---

# Practice Activity

Create:
- blog webpage
- news article webpage

using semantic tags.

---

# Chapter 10 — Multimedia Tags

# Audio

```html
<audio controls>
    <source src="song.mp3" type="audio/mp3">
</audio>
```

---

# Video

```html
<video controls width="500">
    <source src="video.mp4" type="video/mp4">
</video>
```

---

# YouTube Embed

```html
<iframe
    width="560"
    height="315"
    src="https://www.youtube.com/embed/videoid">
</iframe>
```

---

# Practice Task

Build:
- music page
- movie trailer section

---

# Chapter 11 — HTML Mental Models

# HTML is Structure

Think:

```text
Building structure
NOT styling
```

---

# HTML Organizes Content

Frontend developers think in sections:

- navbar
- sidebar
- hero section
- footer

This is called:

> UI decomposition

---

# Chapter 12 — Mini Projects

# Project 1 — Resume Page

Requirements:
- headings
- lists
- links
- image

---

# Project 2 — Restaurant Menu

Requirements:
- tables
- lists
- images

---

# Project 3 — Student Registration Form

Requirements:
- all input types
- labels
- buttons

---

# Project 4 — Blog Page

Requirements:
- semantic HTML
- article
- images
- navigation

---

# Chapter 13 — Best Practices

# Use Proper Indentation

Good code is readable.

---

# Use Semantic Tags

Avoid excessive div usage.

---

# Add alt Text to Images

Improves accessibility.

---

# Organize Code Properly

Frontend development requires clean structure.

---

# Chapter 14 — Common Beginner Mistakes

# Mistake 1

Forgetting closing tags.

---

# Mistake 2

Improper nesting.

WRONG:

```html
<p>
    <h1>Hello</h1>
</p>
```

---

# Mistake 3

Using too many line breaks.

---

# Mistake 4

Confusing HTML with CSS.

---

# Final Revision Checklist

Students should know:

- HTML structure
- Headings
- Paragraphs
- Links
- Images
- Lists
- Tables
- Forms
- Semantic tags
- Multimedia tags
- Navigation

---

# Final Challenge

Build a complete webpage using:

- semantic HTML
- forms
- tables
- images
- navigation
- multimedia

WITHOUT looking at notes.

That is the true test of learning.

---

# Final Advice for Students

The best HTML learners:

- type consistently
- experiment constantly
- build repeatedly
- observe websites carefully

Learning HTML is not about memorizing tags.

It is about:

> understanding webpage structure.

