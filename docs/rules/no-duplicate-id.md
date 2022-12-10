---
id: no-duplicate-id
title: "no-duplicate-id"
---

# no-duplicate-id

Disallow duplicate `id` attributes.

## How to use

.eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/no-duplicate-id": "error",
  },
};
```

## Rule Details

This rule disallow the use of duplicate `id` attributes.

Examples of **incorrect** code for this rule:

```html
<div id="foo"></div>
<div id="foo"></div>
```

Examples of **correct** code for this rule:

```html
<div id="foo"></div>
<div id="bar"></div>
```

## Further reading

- [MDN - id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id)
