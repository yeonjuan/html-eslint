---
title: class-spacing
description: >-
  Disallow extra spacing in class attribute values to maintain consistent
  formatting.
---
# class-spacing

Disallow extra spacing in class attribute values.

This rule aims to maintain consistent spacing in class attribute values by removing unnecessary leading, trailing, and extra spaces between class names.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/class-spacing": "error",
  },
};
```

## Rule Details

This rule disallows the following:

- Leading spaces at the start of class attribute values
- Trailing spaces at the end of class attribute values
- Multiple consecutive spaces between class names

Examples of **incorrect** code for this rule:

```html
<div class=" foo"></div>
<div class="foo "></div>
<div class=" foo "></div>
<div class="foo  bar"></div>
<div class="foo   bar"></div>
```

Examples of **correct** code for this rule:

```html
<div class="foo"></div>
<div class="foo bar"></div>
<div class="foo bar baz"></div>
```
