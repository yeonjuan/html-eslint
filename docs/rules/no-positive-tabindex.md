---
id: no-positive-tabindex
title: "@html-eslint/no-positive-tabindex"
---

## Disallow use of positive `tabindex` attribute.

### Rule Details

This rule disallows use of positive `tabindex` attribute.

Examples of **incorrect** code for this rule:

```html
<span tabindex="1">foo</span> <span tabindex="3">bar</span>
```

Examples of **correct** code for this rule:

```html
<span tabindex="0">foo</span> <span tabindex="-1">bar</span>
```
