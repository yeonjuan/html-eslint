---
title: prefer-https
description: Prefer HTTPS over HTTP for embedded resources to ensure secure connections.
---

# prefer-https

This rule enforces the use of `HTTPS` for embedded resources (image, media, style sheet and script).

## Why?

Using `HTTPS` instead of `HTTP` provides several advantages:

- Security: `HTTPS` encrypts data, protecting it from being intercepted or tampered with during transmission.
- SEO: Search engines prefer `HTTPS` websites, which can improve your site's ranking.
- User Trust: Visitors feel safer browsing a website that uses `HTTPS`.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/prefer-https": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<script src="http://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
<img src="http://html-eslint.org/logo.svg">
<link rel="stylesheet" href="http://style.css">
```

Examples of **correct** code for this rule:

```html,correct
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
<img src="https://html-eslint.org/logo.svg">
<img src="/logo.svg">
<link rel="stylesheet" href="https://style.css">
<link rel="stylesheet" href="./style.css">
```
