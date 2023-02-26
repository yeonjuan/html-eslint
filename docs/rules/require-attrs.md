---
id: require-attrs
title: "require-attrs"
---

# require-attrs

Enforces the use of tag with specified attributes.

## How to use

.eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/require-attrs": [
      "error",
      {
        tag: "svg",
        attrs: ["viewBox"],
      },
    ],
  },
};
```

## Rule Details

This rule enforces use of tag with specified attributes.

### Options

This rule takes a array of object which has tag name with attribute name.

```js
module.exports = {
  rules: {
    "@html-eslint/require-attrs": [
      "error",
      {
        tag: "svg",
        attrs: ["viewBox"], // Enforce to use svg with viewBox attribute.
      },
      {
        tag: "img",
        attrs: ["alt", "src"], // Enforce multiple attributes
      },
    ],
  },
};
```

Examples of **incorrect** code for this rule with the option below:

```json
{
  "tag": "svg",
  "attrs": ["viewBox"]
}
```

```html
<svg></svg>
```

Examples of **correct** code for this rule with the option above:

```html
<svg viewBox="0 0 100 100"></svg>
```
