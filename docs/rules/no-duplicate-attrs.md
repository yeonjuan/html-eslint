# no-duplicate-attrs

This rule disallows the use of duplicate attributes.

## Why?

According to the HTML specification, each attribute name must be unique within a single element.
Duplicate attributes are invalid and can lead to unexpected behavior in browsers.

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
