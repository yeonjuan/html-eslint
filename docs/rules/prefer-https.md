# prefer-https

This rule enforces to use `HTTPS` for embedded resources (image, media, style sheet and script).

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/prefer-https": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for tis rule:

```html,incorrect
<script src="http://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
<img src="http://html-eslint.org/logo.svg">
<link rel="stylesheet" href="http://style.css">
```
