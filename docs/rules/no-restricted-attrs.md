---
id: no-restricted-attrs
title: "@html-eslint/no-restricted-attrs"
---

## Disallow specified attributes

### Rule Details

This rule allows you to specify attributes that you don't want to use in your application.

### Options

```
"rules": {
  "@html-eslint/no-restricted-attrs": ["error", {
    tagPatterns: [".*"],
    attrPatterns: ["data-*", "alt"]
    message: "\'data-x\' is restricted."
  }]
}
```

Examples of **incorrect** code for this rule:

```html
```

Examples of **correct** code for this rule:

```html
```
