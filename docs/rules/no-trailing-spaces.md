# @html-eslint/no-trailing-spaces

Disallow trailing white spaces at the end of lines.

## How to use

- .eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/no-trailing-spaces": "error",
  },
};
```

## Rule Details

This rule disallows trailing white spaces (spaces, tabs) at the end of lines.

Examples of **incorrect** code for this rule:

```html
<div>••</div>
```

Examples of **correct** code for this rule:

```html
<div></div>
```
