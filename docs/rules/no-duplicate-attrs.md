# @html-eslint/no-duplicate-attrs

Disallow duplicate attributes.

## How to use

- .eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/no-duplicate-attrs": "error",
  },
};
```

## Rule Details

This rule disallows the use of duplicate attributes.

Examples of **incorrect** code for this rule:

```html
<div foo="foo1" foo="foo2"></div>
<div foo foo></div>
```

Examples of **correct** code for this rule:

```html
<div foo="foo"></div>
<div bar></div>
```
