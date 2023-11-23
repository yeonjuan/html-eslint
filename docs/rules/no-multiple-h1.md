# no-multiple-h1

This rule disallows multiple `<h1>`.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-multiple-h1": "error",
  },
};
```

## Rule Details

This rule disallows the use of multiple `<h1>` tags.

Examples of **incorrect** code for this rule:

```html
<html>
  <body>
    <h1>head</h1>
    <h1>head</h1>
  </body>
</html>
```

Examples of **correct** code for this rule:

```html
<html>
  <body>
    <h1>head</h1>
  </body>
</html>
```

## Further Reading

- [MDN - heading elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements)
