---
title: require-li-container
description: 'Require li elements to be inside ul, ol, or menu elements.'
---
# require-li-container

This rule enforces that `<li>` elements must be children of `<ul>`, `<ol>` or `<menu>`.

## Why?

The `<li>` tag should be contained in a parent element: `<ol>`, `<ul>` or `<menu>`.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/require-li-container": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<div>
  <li>item 1</li>
  <li>item 2</li>
</div>
```

Examples of **correct** code for this rule:

```html,correct
<ol>
  <li>item 1</li>
  <li>item 2</li>
</ol>

<ul>
  <li>item 1</li>
  <li>item 2</li>
</ul>
```

## Further Reading

- [MDN - li](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li)
