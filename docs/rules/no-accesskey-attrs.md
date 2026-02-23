---
title: no-accesskey-attrs
description: >-
  Disallow use of accesskey attribute due to accessibility and usability
  concerns.
---

# no-accesskey-attrs

This rule disallows the use of the `accesskey` attributes.

## Why?

The `accesskey` attribute allows developers to assign keyboard shortcuts to elements.
However, these shortcuts can conflict with screen readers or keyboard-only navigation, leading to accessibility issues.
To prevent such problems, the use of `accesskey` is discouraged.

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
