# no-extra-spacing-attrs

This rule disallows extra spaces around attributes and between the start or end of a tag.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-extra-spacing-attrs": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

<!-- prettier-ignore -->
```html,incorrect
<!-- an extra space between attributes -->
<div foo="foo"  bar="bar"></div>

<!-- an extra space between tag start and attribute -->
<div  foo="foo"></div>

<!-- an extra space between tag end and attribute -->
<div foo="foo" ></div>

<!-- an extra space between tag start and end -->
<div ></div>
```

Examples of **correct** code for this rule:

```html,correct
<div foo="foo" bar="bar"></div>
<div foo="foo"></div>
<div></div>
```

## Options

- `enforceBeforeSelfClose` (default: false): Enforce exactly one space before self closing tag (`/>`)

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

- `disallowMissing` (default: false): Requires at least one space between attributes (no missing whitespace).

Example(s) of **incorrect** code for this rule with the `{ "disallowMissing": true }` option:

<!-- prettier-ignore-start -->

```html
<div id="foo"class="bar">
</div>
```

<!-- prettier-ignore-end -->

Example(s) of **correct** code for this rule with the `{ "disallowMissing": true }` option:

<!-- prettier-ignore-start -->

```html
<div id="foo" class="bar">
</div>
```

<!-- prettier-ignore-end -->

- `disallowTabs` (default: false): Disallows tabs between attributes; enforces the use of spaces instead.

Example(s) of **incorrect** code for this rule with the `{ "disallowTabs": true }` option:

<!-- prettier-ignore-start -->

```html
<div	id="foo"	class="bar">
</div>
```

<!-- prettier-ignore-end -->

Example(s) of **correct** code for this rule with the `{ "disallowTabs": true }` option:

<!-- prettier-ignore-start -->

```html
<div id="foo" class="bar">
</div>
```

<!-- prettier-ignore-end -->

- `disallowInAssignment` (default: false): Disallows spaces before or after the `=` in attribute assignments.

Example(s) of **incorrect** code for this rule with the `{ "disallowInAssignment": true }` option:

<!-- prettier-ignore-start -->

```html
<div id = "foo" class = "bar">
</div>
```

<!-- prettier-ignore-end -->

Example(s) of **correct** code for this rule with the `{ "disallowInAssignment": true }` option:

<!-- prettier-ignore-start -->

```html
<div id="foo" class="bar">
</div>
```

<!-- prettier-ignore-end -->
