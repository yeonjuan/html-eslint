---
id: require-meta-viewport
title: "require-meta-viewport"
---

# require-meta-viewport

Enforce to use `<meta name="viewport" ...>` in the `<head></head>`.

## How to use

.eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/require-meta-viewport": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
</html>
```

Examples of **correct** code for this rule:

```html
<html>
  <head>
    <meta name="description" content="ESLint plugin for HTML" />
  </head>
</html>
```
