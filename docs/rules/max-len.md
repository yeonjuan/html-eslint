---
title: max-len
description: Enforce a maximum line length in HTML files.
---

# max-len

This rule enforces a maximum line length to keep HTML readable and consistent across editors and code review tools.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/max-len": ["error", { "max": 80 }],
  },
};
```

## Rule Details

This rule reports lines that exceed the configured maximum length.

### Options

- `max` (required): Specifies the maximum line length allowed (number of characters).

Examples of **incorrect** code for this rule with the `{ "max": 80 }` option:

<!-- prettier-ignore -->
```html,incorrect
<script crossorigin="anonymous" integrity="sha256-abc123" src="https://cdn.example.com/lib.min.js"></script>
```

Examples of **correct** code for this rule with the `{ "max": 80 }` option:

<!-- prettier-ignore -->
```html,correct
<script
  crossorigin="anonymous"
  integrity="sha256-abc123"
  src="https://cdn.example.com/lib.min.js"
></script>
```
