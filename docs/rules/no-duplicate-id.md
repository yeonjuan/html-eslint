# no-duplicate-id

This rule disallows duplicate `id` attributes.

## Why?

In HTML, the id attribute must be unique within a document.
Duplicate IDs can break CSS and JavaScript selectors and interfere with accessibility tools.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-duplicate-id": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<div id="foo"></div>
<div id="foo"></div>
```

Examples of **correct** code for this rule:

```html,correct
<div id="foo"></div>
<div id="bar"></div>
```

## Further Reading

- [MDN: id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id)
