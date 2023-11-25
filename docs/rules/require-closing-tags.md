# require-closing-tags

This rule enforces closing tag.

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

Examples of **incorrect** code for this rule:

<!-- prettier-ignore -->
```html
<div>
```

Examples of **correct** code for this rule:

<!-- prettier-ignore -->
```html
<div></div>
```

### Options

This rule has an object option for [Void Elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements).

- `"selfClosing": "never"`: (default) disallow using self closing tag on [Void Elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements).

- `"selfClosing": "always"`: enforce using self closing tag on [Void Elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements).

- `"allowSelfClosingCustom": false`: (default) disallow self-closing for the custom tags.

- `"allowSelfClosingCustom": true`: allow self-closing for the custom tags.

#### selfClosing : "never"

Examples of **incorrect** code for the `{ "selfClosing": "never"}` option:

<!-- prettier-ignore -->
```html
<img />
<base />
```

Examples of **correct** code for the `{ "selfClosing": "never"}` option:

<!-- prettier-ignore -->
```html
<img>
<base>
```

#### selfClosing : "always"

Examples of **incorrect** code for the `{ "selfClosing": "always" }` option:

<!-- prettier-ignore -->
```html
<img>
<base>
```

Examples of **correct** code for the `{ "selfClosing": "always" }` option:

<!-- prettier-ignore -->
```html
<img />
<base />
```

#### "allowSelfClosingCustom": false

Examples of **incorrect** code for the `{ "allowSelfClosingCustom": false }` option:

<!-- prettier-ignore -->
```html
<custom-tag />
```

Examples of **correct** code for the `{ "allowSelfClosingCustom": false }` option:

<!-- prettier-ignore -->
```html
<custom-tag> </custom-tag>
```

#### "allowSelfClosingCustom": true

Examples of **correct** code for the `{ "allowSelfClosingCustom": true }` option:

<!-- prettier-ignore -->
```html
<!-- both allowed -->

<custom-tag> </custom-tag>
<custom-tag />
```

## Further Reading

- [Void Elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements)
