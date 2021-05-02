---
id: quotes
title: "@html-eslint/quotes"
---

## Enforce consistent quoting attributes with double(`"`) or single(`'`)

### Rule Details

This rule enforces the consistent use of double(`"`) or single(`'`) qoutes for element attributes.

### Options

This rule has two options

- `"double"` (default): requires the use of double quotes(`"`).
- `"single"`: requires the use of single quotes(`'`)

#### "double"

Examples of **incorrect** code for this rule with the default `"double"` option:

<!-- prettier-ignore-start -->

```html
<div id='foo'> </div>
<div id=foo> </div>
```

<!-- prettier-ignore-end -->

Examples of **correct** code for this rule with the default `"double"` option:

<!-- prettier-ignore-start -->

```html
<div id="foo"> </div>
```

<!-- prettier-ignore-end -->

#### "single"

Examples of **incorrect** code for this rule with the `"single"` option:

```html
<div id="foo"></div>
<div id="foo"></div>
```

Examples of **correct** code for this rule with the default `"single"` option:

```html
<div id="foo"></div>
```

### Further reading

[MDN - Quoting attributes](https://developer.mozilla.org/en-US/docs/MDN/Guidelines/Code_guidelines/HTML#Quoting_attributes)
