---
title: no-heading-inside-button
description: >-
  Disallow heading elements inside button elements to maintain proper semantic
  structure.
---
# no-heading-inside-button

This rule disallows the use of heading elements inside `<button>`.

## Why?

Assistive technologies, such as screen readers, interpret headings as navigational landmarks. Including headings inside buttons may cause unexpected behavior, making it harder for users to understand and navigate the interface.

## How to use

```js,.eslintrc.js
module.exports = {
    rules: {
        "@html-eslint/no-heading-inside-button": "error",
    }
}
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<button><h1>Click Me</h1></button>
```

Examples of **correct** code for this rule:

```html,correct
<button><span>Click Me</span></button>
```
