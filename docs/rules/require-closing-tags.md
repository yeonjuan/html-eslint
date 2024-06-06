# require-closing-tags

This rule enforces closing tag.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/require-closing-tags": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

<!-- prettier-ignore -->
```html,incorrect
<div>
```

Examples of **correct** code for this rule:

<!-- prettier-ignore -->
```html,correct
<div></div>
```

### Options

This rule has an object option for [Void Elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements) and custom element patterns.

- `"selfClosing": "never"`: (default) disallow using self closing tag on [Void Elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements).

- `"selfClosing": "always"`: enforce using self closing tag on [Void Elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements).

- `"selfClosingCustomPatterns": ["-"]`: (default) an array of strings representing regular expression pattern, enforce self-closing for tags including `-` in the name.

- `"selfClosingCustomPatterns": []`: disallow self-closing for custom tags.

#### selfClosing : "never"

Examples of **incorrect** code for the `{ "selfClosing": "never"}` option:

<!-- prettier-ignore -->
```html,incorrect
<img />
<base />
```

Examples of **correct** code for the `{ "selfClosing": "never"}` option:

<!-- prettier-ignore -->
```html,correct
<img>
<base>
```

#### selfClosing : "always"

Examples of **incorrect** code for the `{ "selfClosing": "always" }` option:

<!-- prettier-ignore -->
```html,incorrect
<img>
<base>
```

Examples of **correct** code for the `{ "selfClosing": "always" }` option:

<!-- prettier-ignore -->
```html,correct
<img />
<base />
```

#### selfClosingCustomPatterns: ["-"]

Examples of **incorrect** code for the `{ "selfClosingCustomPatterns": ["-"] }` option:

<!-- prettier-ignore -->
```html,incorrect
<custom-tag> </custom-tag>
```

Examples of **correct** code for the `{ "selfClosingCustomPatterns": ["-"] }` option:

<!-- prettier-ignore -->
```html,correct
<custom-tag>children</custom-tag>
<custom-tag />
```

#### selfClosingCustomPatterns: []

Examples of **incorrect** code for the `{ "allowSelfClosingCustom": [] }` option:

<!-- prettier-ignore -->
```html,incorrect
<custom-tag />
```

Examples of **correct** code for the `{ "allowSelfClosingCustom": [] }` option:

<!-- prettier-ignore -->
```html,correct
<custom-tag> </custom-tag>
```

## Further Reading

- [Void Elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements)
