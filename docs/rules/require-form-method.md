# require-form-method

## Why?

The absence of the method attribute means the form will use the default `GET` method.
With `GET`, form data is included in the URL (e.g., `?username=john&password=secret`), which can expose sensitive information in browser history, logs, or the network request.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/require-form-method": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<form></form>
<form method="foo"></form>
```

Excamples of **correct** code for this rule:

```html,correct
<form method="post"></form>
<form method="get"></form>
<form method="dialog"></form>
```
