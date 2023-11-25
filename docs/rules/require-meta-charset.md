# require-meta-charset

This rule enforces to use `<meta charset="...">` in the `<head>`.

## Why?

- **Character Encoding Declaration**
  - The primary purpose of the `<meta charset="...">` tag is to declare the character encoding used in the HTML document. Character encoding specifies how characters are represented as binary data. This declaration helps the browser interpret and display the text content correctly.
- **Unicode Support**
  - The most widely used character encoding for web documents is UTF-8, which supports a broad range of characters, including those from different languages and scripts. Declaring UTF-8 using `<meta charset="UTF-8">` ensures proper handling of diverse character sets.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/require-meta-charset": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<html>
  <head> </head>
</html>
```

Examples of **correct** code for this rule:

```html,correct
<html>
  <head>
    <meta charset="UTF-8" />
  </head>
</html>
```
