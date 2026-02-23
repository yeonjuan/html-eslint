---
title: no-restricted-attr-values
description: Disallow specified attribute values based on custom configuration.
---

# no-restricted-attr-values

This rule disallows the use of specified attribute values.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    '@html-eslint/no-restricted-attr-values': ["error",  {
    attrPatterns: ["class"],
    attrValuePatterns: ["data-.*"],
    message: "\'data-x\' is restricted."
  }]
  }
};
```

## Rule Details

This rule allows you to specify attribute values that you don't want to use in your application.

### Options

This rule takes an array of option objects. Each object can contain the following properties:

- `attrPatterns`: An array of strings, each representing a regular expression pattern. It disallows attribute names that match any of the patterns.
- `attrValuePatterns`: An array of strings, each representing a regular expression pattern. It disallows attribute values that match any of the patterns.
- `message` (optional): A custom error message to be shown when the rule is triggered.

```js
module.exports = {
  rules: {
    "@html-eslint/no-restricted-attr-values": [
      "error",
      {
        attrPatterns: ["class", "alt"],
        attrValuePatterns: ["data-.*"],
        message: "'data-x' is restricted.",
      },
      {
        attrPatterns: [".*"],
        attrValuePatterns: ["^foo$"],
        message: "'foo' is restricted.",
      },
    ],
  },
};
```

Examples of **incorrect** code for this rule with the option below:

```json
{
  "attrPatterns": ["data-.*"],
  "attrValuePatterns": ["foo"],
  "message": "Do not use foo attr value"
}
```

```html,incorrect
<div data-name="foo"></div>
<img data-name="foo"></div>
```
