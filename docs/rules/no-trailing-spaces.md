# no-trailing-spaces

This rule disallows trailing white spaces at the end of lines.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-trailing-spaces": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<div>••</div>
```

Examples of **correct** code for this rule:

```html,correct
<div></div>
```
