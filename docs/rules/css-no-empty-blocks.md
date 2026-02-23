---
title: css-no-empty-blocks
description: >-
  Disallow empty CSS blocks in style tags to keep stylesheets clean and
  meaningful.
---
# css-no-empty-blocks

This rule disallows empty CSS blocks in `<style>` tags.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/css-no-empty-blocks": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<style>
  a { }
</style>
```

```html,incorrect
<style>
  a { /* comment */ }
</style>
```

```html,incorrect
<style>
  @media print { }
</style>
```

```html,incorrect
<style>
  a {
  }
</style>
```

Examples of **correct** code for this rule:

```html,correct
<style>
  a { color: red; }
</style>
```

```html,correct
<style>
  @media print {
    a { color: black; }
  }
</style>
```
