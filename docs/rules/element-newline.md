---
id: element-newline
title: "element-newline"
---

# element-newline

Enforce newline between elements

## How to use

.eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/element-newline": "error",
  },
};
```

## Rule Details

This rule enforces newline between elements.

Examples of **incorrect** code for this rule:

<!-- prettier-ignore-start -->

```html
<html>
  <head><title>newline</title></head>
</html>
```

<!-- prettier-ignore-end -->

Examples of **correct** code for this rule:

```html
<html>
  <head>
    <title>newline</title>
  </head>
</html>
```

### Options

This rule has an object option.

- `skipTags`: Specifies an array of tag names. Newlines are not checked for children elements of the specified tags.

Examples of **correct** code for the `{ "skipTags": ["pre", "code"] }` option:

<!-- prettier-ignore-start -->

```html
<pre>
    <div></div><div></div>
</pre>

<code>
  <span></span><div></div>
</code>
```

<!-- prettier-ignore-end -->
