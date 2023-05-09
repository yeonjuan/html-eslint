---
id: require-img-alt
title: "require-img-alt"
---

# require-img-alt

Require `alt` attribute at `img` tag

## How to use

.eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/require-img-alt": "error",
  },
};
```

The screen reader uses `alt` attributes in `img` tag for describing the image.
And the `alt` value is displayed if fails to load the image.
So the `img` tag should contain the `alt` attribute for those who cannot see images.

## Rule Details

This rule enforces the `alt` attribute at `img` tag.

Examples of **incorrect** code for this rule:

```html
<img src="image.png" />

<img src="image.png" alt="" />
<!-- empty value -->
```

Examples of **correct** code for this rule:

```html
<img src="image.png" alt="some description" />
```

### Options

This rule takes an object option.

- `substitute`: Specifies an array of attribute keys that can replace the alt attribute.

Examples of **correct** code for the `{ substitute: ["[alt]", "[attr.alt]"] }` option:

```html
<img src="image.png" [alt]="..." />

<img src="image.png" [attr.alt]="..." />
```

## Further reading

- [MDN - img](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)
