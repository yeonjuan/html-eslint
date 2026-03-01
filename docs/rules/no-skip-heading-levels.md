---
title: no-skip-heading-levels
description: Disallow skipping heading levels to maintain proper document outline.
---

# no-skip-heading-levels

This rule disallows skipping heading levels in HTML documents, such as jumping from `<h1>` to `<h3>`

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-skip-heading-levels": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<html>
  <body>
    <h1>head1</h1>
    <h3>head3</h3>
  </body>
</html>
```

Examples of **correct** code for this rule:

```html,correct
<html>
  <body>
    <h1>head1</h1>
    <h2>head2</h2>
  </body>
</html>
```

## Further Reading

- [MDN - heading elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements)
