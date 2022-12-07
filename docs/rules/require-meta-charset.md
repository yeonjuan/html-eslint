---
id: require-meta-charset
title: "require-meta-charset"
---

# require-meta-charset

Enforce to use `<meta charset="...">` in the `<head></head>`.

## How to use

.eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/require-meta-charset": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html
<html>
  <head> </head>
</html>
```

Examples of **correct** code for this rule:

```html
<html>
  <head>
    <meta charset="UTF-8" />
  </head>
</html>
```
