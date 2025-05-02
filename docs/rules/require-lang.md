# require-lang

This rule enforces the presence of the `lang` attribute on the `<html>` tag.

## Why?

The `lang` attribute in the HTML tag (`<html>`) is used to declare the language of the document.
This attribute is important for accessibility and helps browsers, search engines, and other software understand the language of the content.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/require-lang": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<html>
  ...
</html>

<html lang="">
  ...
</html>
```

Examples of **correct** code for this rule:

```html,correct
<html lang="ko">
  ...
</html>
```

## Further Reading

- [MDN: lang](https://developer.mozilla.org/ko/docs/Web/HTML/Global_attributes/lang)
