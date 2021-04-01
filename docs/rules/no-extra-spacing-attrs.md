---
id: no-extra-spacing-attrs
title: "@html-eslint/no-extra-spacing-attrs"
---

## Disallow extra spaces around attributes.

### Rule Details

This rule disallows the use of extra spaces around attributes.

Examples of **incorrect** code for this rule:

```html
<!-- an extra space between attributes -->
<div foo="foo"  bar="bar"></div>

<!-- an extra space between tag start and attribute -->
<div  foo="foo"></div>

<!-- an extra space between tag end and attribute -->
<div foo="foo" ></div>
```

Examples of **correct** code for this rule:

```html
<div foo="foo" bar="bar"></div>
<div foo="foo"></div>
```
