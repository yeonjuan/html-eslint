---
title: no-restricted-attrs
description: Disallow specified attributes based on custom configuration.
---
# no-restricted-attrs

This rule disallows the use of specified attributes.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-restricted-attrs": [
      "error",
      {
        tagPatterns: ["^div$", "^img$"],
        attrPatterns: ["data-.*"],
        message: "'data-x' is restricted.",
      },
    ],
  },
};
```

## Rule Details

This rule allows you to specify attributes that you don't want to use in your application.

### Options

This rule takes an array of option objects, where the `tagPatterns` and `attrPatterns` are specified.

- `tagPatterns`: An array of strings representing regular expression pattern. It disallows tag name that match any of the patterns.
- `attrPatterns`: An array of strings representing regular expression pattern. It disallows attribute names that match any of the patterns.
- `message` (optional): A custom error message to be shown when the rule is triggered.

```js
module.exports = {
  "rules": {
    "@html-eslint/no-restricted-attrs": [
      "error",
      {
        tagPatterns: ["^div$", "^img$"],
        attrPatterns: ["data-.*"]
        message: "\'data-x\' is restricted."
      },
      {
        tagPatterns: ["^img$"],
        attrPatterns: ["^alt$"]
        message: "\'alt\' is restricted."
      }
    ],
  }
};
```

Examples of **incorrect** code for this rule with the option below:

```json
{
  "tagPatterns": ["^img$", "^div$"],
  "attrPatterns": ["^data-.*"],
  "message": "Do not use data-* attr"
}
```

```html,incorrect
<div data-name="foo"></div>
<img data-name="foo"></div>
```
