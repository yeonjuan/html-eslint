---
title: no-duplicate-class
description: >-
  Disallow duplicate class names in class attributes to avoid confusion and
  errors.
---

# no-duplicate-class

This rule disallows duplicate class names in `class` attributes.

## How to use

```js,.eslintrc.js
import svelteParser from "svelte-eslint-parser";
export default  [
 {
    files: ["**/*.svelte"],
    plugins: {
      "@html-eslint/svelte": htmlSvelte,
    },
    languageOptions: {
      parser: svelteParser,
    },
    rules: {
         "@html-eslint/svelte/no-duplicate-class": "error",
    },
  },
];
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<div class="btn btn primary btn"></div>
```

Examples of **correct** code for this rule:

```html,correct
<div class="btn primary"></div>
```
