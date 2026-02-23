---
title: no-multiple-empty-lines
description: Disallow multiple consecutive empty lines for cleaner and more readable HTML.
---
# no-multiple-empty-lines

This rule disallows the use of multiple consecutive empty lines.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-multiple-empty-lines": "error",
  },
};
```

## Rule Details

This rule disallows consecutive empty lines that exceed the allowed maximum.

### Options

- `max` (default 2): Specifies the maximum number of consecutive empty lines allowed.

Examples of **incorrect** code for this rule with the default `{ "max": 2 }` option:

<!-- prettier-ignore -->
```html,incorrect
<div id="foo"></div>



<div id="bar"></div>
```

Examples of **correct** code for this rule with the default `{ "max": 2 }` option:

<!-- prettier-ignore -->
```html,correct
<div id="foo"></div>


<div id="bar"></div>
```
