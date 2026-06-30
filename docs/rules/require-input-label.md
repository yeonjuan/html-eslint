---
title: require-input-label
description: "Require labels for input, textarea, and select elements for accessibility."
---

# require-input-label

This rule enforces the presence of accessible labels for input elements such as `<input type="text">`, `<select>` and `<textarea>`. Recommended to have them adjacent to the element itself, but the rule will try to find one in the whole avialable DOM tree. Some exclusions apply:
- `input` elements of type `button`, `reset`, `submit` are excluded, if they have a non-empty and non-whitespace `value` attribute.
- `input` elements of type `image`  are excluded, if they have at least one of `alt`, `title` or `value` attribute, which is non-empty and non-whitespace.
- `input` elements of type `hidden` are excluded, since there are not rendered.
- Elements with `aria-labelledby` or `aria-label` are excluded.

## Why?

Labels improve accessibility for users of assistive technologies by ensuring that form controls are properly described.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/require-input-label": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<input type="text">
<textarea></textarea>
<select></select>
<input type="button">
<input type="button" value"    ">
<input type="image">
```

Examples of **correct** code for this rule:

```html,correct
<input id="fo">
<label>name: <input></label>
<textarea aria-labelledby="foo"></textarea>
<input type="hidden">
<input type="button" value="Button">
<input type="image" alt="Click me">
```
