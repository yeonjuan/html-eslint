# Disallow extra spaces arround attributes.

## Rule Details

This rule disallows the usage of extra spaces around attributes.

Examples of **incorrect** code for this rule:

<!-- prettier-ignore-start -->
```html
<!-- an extra space between attributes -->
<div foo="foo"  bar="bar"></div>

<!-- an extra space between tag start and attribute -->
<div foo="foo" ></div>

<!-- an extra space between tag end and attribute -->
<div  foo="foo"></div>
```
<!-- prettier-ignore-end -->

Examples of **correct** code for this rule:

```html
<div foo="foo" bar="bar"></div>
<div foo="foo"></div>
```
