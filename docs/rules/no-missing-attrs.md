---
id: no-missing-attrs
title: "@html-eslint/no-missing-attrs"
---


---
id: no-missing-attrs
title: "@html-eslint/no-missing-attrs"
---

## Disallow duplicate attributes.

### Rule Details

This rule search for missing required attributes.

#### Options

- `{exceptString: ["translate", "notranslate"]}` (default): array of posible mandatory terms.


Examples of **incorrect** code for this rule:

```html
<span>text</span>
<div foo>text</div>
<div><span>text</span></div>
```

Examples of **correct** code for this rule:

```html
<div translate="true">text</div>
<div translate>text</div>
<div><span notranslate>text</span></div>
```
