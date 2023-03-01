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
        attr: "viewBox",
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
        tag: "img",
        attr: "alt", // Enforce to use img with alt attribute.
      },
      {
        tag: "svg",
        attr: "viewBox" // Enforce to use svg and viewBox attributes with "0 0 100 100" value.
        value: "0 0 100 100"
      },
    ],
  },
};
```

Examples of **incorrect** code for this rule with the option below:

```json
{
  "tag": "img",
  "attr": "alt"
},
{
  "tag": "svg",
  "attr": "viewBox",
  "value": "0 0 100 100"
}
```

```html
<img /> <svg></svg>
```

Examples of **correct** code for this rule with the option above:

```html
<img alt="" /><svg viewBox="0 0 100 100"></svg>
```
