---
title: no-non-scalable-viewport
description: Disallow user-scalable=no in viewport meta tag for better accessibility.
---

# no-non-scalable-viewport

This rule disallows the use of `user-scalable=no` in the `<meta name="viewport">`.

The `user-scalable=no` setting disables zooming on a page, which can make it difficult for users with partial or low vision to read the content.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-non-scalable-viewport": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<html>
  <head>
    <meta name="viewport" content="width=device-width, user-scalable=no" />
  </head>
  <body></body>
</html>
```

Examples of **correct** code for this rule:

```html,correct
<html>
  <head>
    <meta name="viewport" content="width=device-width" />
  </head>
  <body></body>
</html>
```

## Further Reading

- [MDN: Viewport meta tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag)
