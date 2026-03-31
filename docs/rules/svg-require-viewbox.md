---
title: svg-require-viewbox
description: Require `viewBox` attribute on `<svg>` elements.
---

# svg-require-viewbox

The `viewBox` attribute defines the coordinate system and aspect ratio of an SVG. Without it, the SVG has no intrinsic size information, which causes inconsistent scaling across browsers and makes it difficult to use the SVG responsively (e.g., with CSS `width: 100%`).

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/svg-require-viewbox": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<svg></svg>

<svg width="100" height="100"></svg>

<svg xmlns="http://www.w3.org/2000/svg">
  <path d="M0 0h24v24H0z"/>
</svg>
```

Examples of **correct** code for this rule:

```html,correct
<svg viewBox="0 0 100 100"></svg>

<svg viewBox="0 0 24 24" width="24" height="24">
  <circle cx="12" cy="12" r="10"/>
</svg>
```

## Further Reading

- [MDN - SVG `viewBox` attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox)
- [CSS Tricks - How to Scale SVG](https://css-tricks.com/scale-svg/)
