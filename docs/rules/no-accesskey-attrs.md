# no-accesskey-attrs

This rule disallows use of `accesskey` attributes.

## Why?

`accesskey` attributes allow web developers to assign keyboard shortcuts to elements.
Inconsistencies between keyboard shortcuts and keyboard commands used by screenreader and keyboard only users create accessibility complications so to avoid complications, access keys should not be used.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-accesskey-attrs": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<div accesskey="h"></div>
```

Examples of **correct** code for this rule:

```html,correct
<div></div>
```

## Further Reading

- [MDN: accesskey](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey)
