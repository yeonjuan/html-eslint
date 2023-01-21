---
id: no-extra-spacing-attrs
title: "no-extra-spacing-attrs"
---

# no-extra-spacing-attrs

Disallow extra spaces around attributes.

## How to use

.eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/no-extra-spacing-attrs": "error",
  },
};
```

## Rule Details

This rule disallows the use of extra spaces around attributes.

Examples of **incorrect** code for this rule:

```html
<!-- an extra space between attributes -->
<div foo="foo" bar="bar"></div>

<!-- an extra space between tag start and attribute -->
<div foo="foo"></div>

<!-- an extra space between tag end and attribute -->
<div foo="foo"></div>
```

Examples of **correct** code for this rule:

```html
<div foo="foo" bar="bar"></div>
<div foo="foo"></div>
```

## Options

- `enforceBeforeSelfClose` (default: false): enforce one space before self closing (`/>`)

Examples of **incorrect** code for this rule with the default `{ "enforceBeforeSelfClose": true }` option:

<!-- prettier-ignore-start -->

```html
<img src="foo.png"  />

<img src="foo.png"/>
```

<!-- prettier-ignore-end -->

Examples of **correct** code for this rule with the default `{ "enforceBeforeSelfClose": true }` option:

<!-- prettier-ignore-start -->

```html
<img src="foo.png" />
```

<!-- prettier-ignore-end -->

- `disallowMissing` (default: false): Enforce at least one space between attributes

Example(s) of **incorrect** code for this rule with the `{ "disallowMissing": true }` option:

<!-- prettier-ignore-start -->

```html
<div id="foo"class="bar">
</div>
```

<!-- prettier-ignore-end -->

Example(s) of **correct** code for this rule with the default `{ "disallowMissing": true }` option:

<!-- prettier-ignore-start -->

```html
<div id="foo" class="bar">
</div>
```

<!-- prettier-ignore-end -->
