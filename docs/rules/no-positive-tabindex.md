---
title: no-positive-tabindex
description: >-
  Disallow positive tabindex values to maintain natural tab order for
  accessibility.
---

# no-positive-tabindex

This rule disallows the use of positive `tabindex` attribute values.

## Why?

In HTML, the `tabindex` attribute is used to specify the tab order of elements when navigating through a page using the "Tab" key.
By default, elements are included in the tab order based on their position in the HTML source code. The `tabindex` attribute allows you to modify this order.

It's generally a good practice to let the natural flow of elements in the HTML dictate the tab order whenever possible.
Setting explicit `tabindex` values should be used sparingly and only when there's a specific reason to deviate from the default order.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-positive-tabindex": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<span tabindex="1">foo</span> <span tabindex="3">bar</span>
```

Examples of **correct** code for this rule:

```html,correct
<span tabindex="0">foo</span> <span tabindex="-1">bar</span>
```
