---
id: no-restricted-attr-values
title: "no-restricted-attr-values"
---

# no-restricted-attrs

Disallow specified attribute values

## How to use

.eslintrc.js

```js
module.exports = {
  rules: {
    '@html-eslint/no-restricted-attr-values': ["error",  {
    attrPatterns: ["class"],
    attrValues: ["data-.*"]
    message: "\'data-x\' is restricted."
  }]
  }
};
```

## Rule Details

This rule allows you to specify attribute values that you don't want to use in your application.

### Options

This rule takes an array of option objects, where the `attrPatterns` and `attrValues` are specified.

- `attrPatterns`: an array of strings representing regular expression pattern, disallows atrribute names that match any of the patterns.
- `attrValues`: an array of strings representing regular expression pattern, disallows attribute values that match any of the patterns.
- `message` (optional): a string for custom message.

```js
module.exports = {
  "rules": {
    "@html-eslint/no-restricted-attrs": [
      "error",
      {
        attrPatterns: ["class", "alt"],
        attrValues: ["data-.*"]
        message: "\'data-x\' is restricted."
      },
      {
        attrPatterns: [".*"],
        attrValues: ["^foo$"]
        message: "\'foo\' is restricted."
      }
    ],
  }
};
```

Examples of **incorrect** code for this rule with the option below:

```json
{
  "attrPatterns": ["data-.*"],
  "attrValues": ["foo"],
  "message": "Do not use foo attr value"
}
```

```html
<div data-name="foo"></div>
<img data-name="foo"></div>
```
