# Disallow use of `user-scalable=no` in `<meta name="viewport">`.

## Rule Details

This rule disallow use of `user-scalable-no` in `<meta name="viewport">`.

Examples of **incorrect** code for this rule:

```html
<html>
  <head>
    <meta name="viewport" content="width=device-width, user-scalable=no" />
  </head>
  <body></body>
</html>
```

Examples of **correct** code for this rule:

```html
<html>
  <head>
    <meta name="viewport" content="width=device-width" />
  </head>
  <body></body>
</html>
```
