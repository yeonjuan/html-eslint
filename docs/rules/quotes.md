# quotes

This rule enforces consistent use of quotes for attribute values (`'` or `"`).

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/quotes": "error",
  },
};
```

## Rule Details

### Options

This rule accepts the following options

1. Quote style (string):
   - "double" (default): Enforces the use of double quotes (`"`).
   - "single": Enforces the use of single quotes (`'`).
2. `enforceTemplatedAttrValue` (boolean):
   - false (default): Does not enforce quote style inside template expressions.
   - true: Enforces quote style inside templated attribute values.

#### "double"

Examples of **incorrect** code for this rule with the default `"double"` option:

<!-- prettier-ignore -->
```html,incorrect
<div id='foo'></div>
```

<!-- prettier-ignore-end -->

Examples of **correct** code for this rule with the default `"double"` option:

```html,correct
<div id="foo"></div>
<div id='containing "double" quotes'></div>
```

Examples of **incorrect** code for this rule with the `"double"` and `enforceTemplatedAttrValue: true`:

<!-- prettier-ignore -->
```js,incorrect
html`<div id=${value}></div>`;
html`<div id='${value}'></div>`;
```

<!-- prettier-ignore-end -->

Examples of **correct** code for this rule with the `"double"` and `enforceTemplatedAttrValue: true`:

<!-- prettier-ignore -->
```js,correct
html`<div id="${value}"></div>`;
```

<!-- prettier-ignore-end -->

#### "single"

Examples of **incorrect** code for this rule with the `"single"` option:

```html,incorrect
<div id="foo"></div>
```

Examples of **correct** code for this rule with the default `"single"` option:

<!-- prettier-ignore -->
```html,correct
<div id='foo'></div>
<div id="containing 'single' quotes"></div>
```

<!-- prettier-ignore-end -->

Examples of **incorrect** code for this rule with the `"single"` and `enforceTemplatedAttrValue: true`:

<!-- prettier-ignore -->
```js,incorrect
html`<div id=${value}></div>`;
html`<div id="${value}"></div>`;
```

<!-- prettier-ignore-end -->

Examples of **correct** code for this rule with the `"single"` and `enforceTemplatedAttrValue: true`:

<!-- prettier-ignore -->
```js,correct
html`<div id="${value}"></div>`;
```

<!-- prettier-ignore-end -->

## Further Reading

- [MDN - Quoting attributes](https://developer.mozilla.org/en-US/docs/MDN/Guidelines/Code_guidelines/HTML#Quoting_attributes)
