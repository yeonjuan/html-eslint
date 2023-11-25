# no-duplicate-attrs

Disallow duplicate attributes.

## Why?

The HTML specification mandates that attribute names must be unique within a single HTML element.
Violating this rule results in non-compliance with the standard.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-duplicate-attrs": "error",
  },
};
```

## Rule Details

This rule disallows the use of duplicate attributes.

Examples of **incorrect** code for this rule:

```html,incorrect
<div foo="foo1" foo="foo2"></div>
<div foo foo></div>
```

Examples of **correct** code for this rule:

```html,correct
<div foo="foo"></div>
<div bar></div>
```
