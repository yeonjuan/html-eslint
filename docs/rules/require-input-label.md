# require-input-label

This rule enforces the presence of accessible labels for input elements such as `<input type="text">`, `<select>` and `<textarea>`.

## Why?

- Labels improve accessibility for users of assistive technologies by ensuring that form controls are properly described.

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
<input type="hidden">
<textarea></textarea>
<select></select>
```

Examples of **correct** code for this rule:

```html,correct
<input id="fo">
<label>name: <input></label>
<textarea aria-labelledby="foo"></textarea>
```
