# @html-eslint/no-accesskey-attrs

Disallow accesskey attributes.

Access keys are HTML attributes that allow web developers to assign keyboard shortcuts to elements. Inconsistencies between keyboard shortcuts and keyboard commands used by screenreader and keyboard only users create accessibility complications so to avoid complications, access keys should not be used.

## How to use

- .eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/no-accesskey-attrs": "error",
  },
};
```

## Rule Details

This rule disallows the use of `accesskey` attributes.

Examples of **incorrect** code for this rule:

```html
<div accesskey="h"></div>
```

Examples of **correct** code for this rule:

```html
<div></div>
```

## Further reading

- [MDN - accesskey](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey)
