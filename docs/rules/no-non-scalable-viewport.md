# no-non-scalable-viewport

This rule disallows use of `user-scalable=no` in `<meta name="viewport">`.

The `user-scalable=no` disables zooming on a page. It makes users with partial vision or low vision hard to read web content.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-non-scalable-viewport": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<html>
  <head>
    <meta name="viewport" content="width=device-width, user-scalable=no" />
  </head>
  <body></body>
</html>
```

Examples of **correct** code for this rule:

```html,correct
<html>
  <head>
    <meta name="viewport" content="width=device-width" />
  </head>
  <body></body>
</html>
```

## Further Reading

- [MDN: Viewport meta tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag)
