---
title: no-aria-hidden-body
description: >-
  Disallow aria-hidden attribute on the body element to ensure page content is
  accessible.
---

# no-aria-hidden-body

This rule disallows the use of the `aria-hidden` attribute on the `body`.

## Why?

The `aria-hidden` attribute is used to hide elements from assistive technologies, such as screen readers, when the content should not be exposed to users.

Applying `aria-hidden="true"` to the `<body>` element removes the entire page content from the accessibility tree, effectively making the page inaccessible to users who rely on assistive technologies.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-aria-hidden-body": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<body aria-hidden="true">
  <div>Main content</div>
</body>
```

Examples of **correct** code for this rule:

```html,correct
<body></body>
```

## Further Reading

- [MDN: Using the aria-hidden attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-hidden_attribute)
