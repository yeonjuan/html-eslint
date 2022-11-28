---
id: no-accesskey-attrs
title: "no-accesskey-attrs"
---

## Disallow accesskey attributes.

### Rule Details

This rule disallow the use of `accesskey` attributes. Access keys are HTML attributes that allow web developers to assign keyboard shortcuts to elements. Inconsistencies between keyboard shortcuts and keyboard commands used by screenreader and keyboard only users create accessibility complications so to avoid complications, access keys should not be used.

Examples of **incorrect** code for this rule:

```html
<div accesskey="h"></div>
```

Examples of **correct** code for this rule:

```html
<div></div>
```
