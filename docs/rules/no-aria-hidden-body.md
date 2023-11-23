# no-aria-hidden-body

This rule disallows the use of `aria-hidden` attribute on the `body`.

## Why?

The `aria-hidden` attribute is typically used to hide elements from assistive technologies (such as screen readers) when they are not intended to be perceived by users.

When `aria-hidden`="true" is applied to the `<body>` element, it removes the entire content of the document from the accessibility tree.
This means that assistive technologies will not perceive any of the content within the `<body>`, making the entire page inaccessible to users who rely on screen readers or other assistive technologies.

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

```html
<body aria-hidden>
  <body aria-hidden="true"></body>
</body>
```

Examples of **correct** code for this rule:

```html
<body></body>
```

## Further Reading

- [MDN: Using the aria-hidden attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-hidden_attribute)
