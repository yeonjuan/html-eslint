---
id: no-multiple-empty-lines
title: "@html-eslint/no-multiple-empty-lines"
---

## Disallow use of `user-scalable=no` in `<meta name="viewport">`.

### Rule Details

This rule disallows the use of empty lines which exceeded the maximum lines allowed.

## Options

- `max` (default 2): enforces a maximum number of consecutive empty lines.

Examples of **incorrect** code for this rule with the default `{ "max": 2 }` option:

<!-- prettier-ignore-start -->

```html
<div id="foo"></div>



<div id="bar"></div>
```

<!-- prettier-ignore-end -->

Examples of **correct** code for this rule with the default `{ "max": 2 }` option:

<!-- prettier-ignore-start -->

```html
<div id="foo"></div>


<div id="bar"></div>
```

<!-- prettier-ignore-end -->
