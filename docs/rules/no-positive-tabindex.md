# @html-eslint/no-positive-tabindex

Disallow use of positive `tabindex` attribute.

## How to use

- .eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/no-positive-tabindex": "error",
  },
};
```

## Rule Details

This rule disallows use of positive `tabindex` attribute.

Examples of **incorrect** code for this rule:

```html
<span tabindex="1">foo</span> <span tabindex="3">bar</span>
```

Examples of **correct** code for this rule:

```html
<span tabindex="0">foo</span> <span tabindex="-1">bar</span>
```
