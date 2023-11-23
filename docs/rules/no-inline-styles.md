# @html-eslint/no-inline-styles

Disallow inline styles.

## How to use

- .eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/no-inline-styles": "error",
  },
};
```

## Rule Details

This rule disallows the use of inline styles.

Examples of **incorrect** code for this rule:

```html
<div style="color:#ff0a00"></div>
```

Examples of **correct** code for this rule:

```html
<div class="some-color"></div>
```

## Further reading

- [MDN - id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id)
