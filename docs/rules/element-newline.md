---
id: element-newline
title: "element-newline"
---

# element-newline

> Require newline between elements

## How to use

- .eslintrc.js

    ```js
    module.exports = {
      rules: {
        '@html-eslint/element-newline': "error"
      }
    };
    ```

## Rule Details

This rule enforces newline between elements.

Examples of **incorrect** code for this rule:

```html
<html>
  <head><title>newline</title></head>
</html>
```

Examples of **correct** code for this rule:

```html
<html>
  <head>
    <title>newline</title>
  </head>
</html>
```
