---
id: require-closing-tags
title: "require-closing-tags"
---

# require-closing-tags

Require use of closing tag.

## How to use

.eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/require-closing-tags": "error",
  },
};
```

## Rule Details

This rule checks whether the tag has closing tag or not.

Examples of **incorrect** code for this rule:

<!-- prettier-ignore-start -->

```html
<div>
```

<!-- prettier-ignore-end -->

Examples of **correct** code for this rule:

<!-- prettier-ignore-start -->

```html
<div></div>
```

<!-- prettier-ignore-end -->

### Options

This rule has an object option for [Void Elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements).

- `"selfClosing": "never"`: (default) disallow using self closing tag on [Void Elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements).

- `"selfClosing": "always"`: enforce using self closing tag on [Void Elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements).

- `"allowSelfClosingCustom": false`: (default) disallow self-closing for the custom tags.

- `"allowSelfClosingCustom": true`: allow self-closing for the custom tags.

#### selfClosing : "never"

Examples of **incorrect** code for the `{ "selfClosing": "never"}` option:

<!-- prettier-ignore-start -->

```html
<img />
<base />
```

<!-- prettier-ignore-end -->

Examples of **correct** code for the `{ "selfClosing": "never"}` option:

<!-- prettier-ignore-start -->

```html
<img>
<base>
```

<!-- prettier-ignore-end -->

#### selfClosing : "always"

Examples of **incorrect** code for the `{ "selfClosing": "always" }` option:

<!-- prettier-ignore-start -->

```html
<img>
<base>
```

<!-- prettier-ignore-end -->

Examples of **correct** code for the `{ "selfClosing": "always" }` option:

<!-- prettier-ignore-start -->

```html
<img />
<base />
```

<!-- prettier-ignore-end -->

#### "allowSelfClosingCustom": false

Examples of **incorrect** code for the `{ "allowSelfClosingCustom": false }` option:

<!-- prettier-ignore-start -->

```html
<custom-tag />
```

<!-- prettier-ignore-end -->

Examples of **correct** code for the `{ "allowSelfClosingCustom": false }` option:

<!-- prettier-ignore-start -->

```html
<custom-tag> </custom-tag>
```

<!-- prettier-ignore-end -->

#### "allowSelfClosingCustom": true

Examples of **correct** code for the `{ "allowSelfClosingCustom": true }` option:

<!-- prettier-ignore-start -->

```html
<!-- both allowed -->

<custom-tag> </custom-tag>
<custom-tag />
```

<!-- prettier-ignore-end -->

## Further reading

- [Void Elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements)
