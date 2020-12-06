---
id: require-meta-description
title: "@html-eslint/require-meta-description"
---

## Enforce to use `<meta name="description" ...>` in the `<head></head>`.

### Rule Details

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
