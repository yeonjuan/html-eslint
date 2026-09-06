---
title: angular-template/no-restricted-attr-values
description: Disallow specified attribute values in Angular templates based on custom configuration.
---

# no-restricted-attr-values

This rule disallows the use of specified attribute values in Angular templates.

## How to use

```js
// eslint.config.js (flat config)
import htmlAngular from "@html-eslint/eslint-plugin-angular-template";

export default [
  {
    files: ["**/*.html"],
    plugins: {
      "@html-eslint/angular-template": htmlAngular,
    },
    rules: {
      "@html-eslint/angular-template/no-restricted-attr-values": [
        "error",
        {
          attrPatterns: ["class"],
          attrValuePatterns: ["foo"],
          message: "'foo' class is restricted.",
        },
      ],
    },
  },
];
```

## Rule Details

This rule allows you to specify attribute values that you don't want to use in your application.

### Options

This rule takes an array of option objects, where the `attrPatterns` and `attrValuePatterns` are specified.

- `attrPatterns`: An array of strings representing regular expression patterns. It matches attribute names.
- `attrValuePatterns`: An array of strings representing regular expression patterns. It disallows attribute values that match any of the patterns.
- `message` (optional): A custom error message to be shown when the rule is triggered.

Examples of **incorrect** code for this rule with the option below:

```json
{
  "attrPatterns": ["class"],
  "attrValuePatterns": ["^foo$"],
  "message": "Do not use foo class"
}
```

```html,incorrect
<div class="foo"></div>
<img class="foo" />
```
