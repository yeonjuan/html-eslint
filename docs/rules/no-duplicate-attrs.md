---
id: no-duplicate-attrs
title: "no-duplicate-attrs"
---

# no-duplicate-attrs

## Disallow duplicate attributes.

### Rule Details

This rule disallow the use of duplicate attributes.

Examples of **incorrect** code for this rule:

```html
<div foo="foo1" foo="foo2"></div>
<div foo foo></div>
```

Examples of **correct** code for this rule:

```html
<div foo="foo"></div>
<div bar></div>
```
