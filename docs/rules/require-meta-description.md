---
id: require-meta-description
title: "require-meta-description"
---

# require-meta-description

Enforce to use `<meta name="description" ...>` in the `<head></head>`.

## How to use

.eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/require-meta-description": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html
<html>
  <head>
    <meta name="author" content="YeonJuAn" />
  </head>
</html>
```

Examples of **correct** code for this rule:

```html
<html>
  <head>
    <meta name="description" content="ESLint plugin for HTML" />
    <meta name="author" content="YeonJuAn" />
  </head>
</html>
```
