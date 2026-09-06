---
title: svelte/no-restricted-attr-values
description: Disallow specified attribute values in Svelte components based on custom configuration.
---

# no-restricted-attr-values

This rule disallows the use of specified attribute values in Svelte components.

## How to use

```js
// eslint.config.js (flat config)
import htmlSvelte from "@html-eslint/eslint-plugin-svelte";

export default [
  {
    files: ["**/*.svelte"],
    plugins: {
      "@html-eslint/svelte": htmlSvelte,
    },
    rules: {
      "@html-eslint/svelte/no-restricted-attr-values": [
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
