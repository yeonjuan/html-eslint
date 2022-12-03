---
id: no-restricted-attrs
title: "no-restricted-attrs"
---

# no-restricted-attrs

## Disallow specified attributes

### Rule Details

This rule allows you to specify attributes that you don't want to use in your application.

### Options

This rule takes an array of option objects, where the `tagPatterns` and `attrPatterns` are specified.

- `tagPatterns`: an array of strings representing regular expression pattern, disallows tag name that match any of the patterns.
- `attrPatterns`: an array of strings representing regular expression pattern, disallows attribute name that match any of the patterns.
- `message` (optional): a string for custom message.


```
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
  }]
}
```

Examples of **incorrect** code for this rule with the option below:

```json
{
  "tagPatterns": ["^img$", "^div$"],
  "attrPatterns": ["^data-.*"],
  "message": "Do not use data-* attr"
}
```

```html
<div data-name="foo"></div>
<img data-name="foo"></div>
```
