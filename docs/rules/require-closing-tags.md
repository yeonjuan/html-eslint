---
id: require-closing-tags
title: "@html-eslint/require-closing-tags"
---

## Require use of closing tag.

### Rule Details

This rule checks whether the tag has closing tag or not.

👎 Examples of **incorrect** code for this rule:

<!-- prettier-ignore-start -->

```html
<div>
```

<!-- prettier-ignore-end -->


👍 Examples of **correct** code for this rule:

<!-- prettier-ignore-start -->

```html
<div></div>
```

<!-- prettier-ignore-end -->


### Options

This rule has an  object option for [Void Elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements).

- `"selfClosing": "never"`: (default) disallow using self closing tag on [Void Elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements).

- `"selfClosing": "always"`: enforce using self closing tag on [Void Elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements).


#### selfClosing : "never"

👎 Examples of **incorrect** code for the `{ "selfClosing": "never"}` option:

<!-- prettier-ignore-start -->

```html
<img />
<base />
```

<!-- prettier-ignore-end -->

👍 Examples of **correct** code for the `{ "selfClosing": "never"}` option:

<!-- prettier-ignore-start -->

```html
<img>
<base>
```

<!-- prettier-ignore-end -->

#### selfClosing : "always"

👎 Examples of **incorrect** code for the `{ "selfClosing": "always" }` option:

<!-- prettier-ignore-start -->

```html
<img>
<base>
```

<!-- prettier-ignore-end -->

👍 Examples of **correct** code for the `{ "selfClosing": "always" }` option:

<!-- prettier-ignore-start -->

```html
<img />
<base />
```

<!-- prettier-ignore-end -->

### Further reading

- [Void Elements](https://html.spec.whatwg.org/multipage/syntax.html#void-elements)
