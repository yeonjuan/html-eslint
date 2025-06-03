# no-aria-hidden-on-focusable

This rule disallows the use of `aria-hidden="true"` on focusable elements.

## Why?

The `aria-hidden="true"` attribute is used to hide purely decorative content from screen reader users. When this attribute is applied to focusable elements (elements that can receive keyboard focus), it creates a confusing experience for screen reader users because:

1. The element is still reachable via keyboard navigation
2. But the screen reader won't announce it when focused
3. This can lead to a situation where users can focus on an element but don't know what it is

This creates an inconsistent and potentially confusing user experience for people relying on screen readers.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-aria-hidden-on-focusable": "error",
  },
};
```

## Rule Details

This rule considers an element focusable if any of these conditions are met:

- It has a `tabindex` attribute with a value other than `-1`
- It has a `contenteditable` attribute that is empty, `"true"`, or `"plaintext-only"`
- It is one of the inherently focusable elements (like `button`, `input`, etc.)
- It is an `<a>` element with an `href` attribute
- It is an `<audio>` or `<video>` element with a `controls` attribute

Examples of **incorrect** code for this rule:

```html,incorrect
<div aria-hidden="true" tabindex="0"></div>
<input aria-hidden="true">
<a href="/" aria-hidden="true"></a>
<button aria-hidden="true"></button>
<textarea aria-hidden="true"></textarea>
<div aria-hidden="true" contenteditable></div>
<div aria-hidden="true" contenteditable="true"></div>
<summary aria-hidden="true"></summary>
```

Examples of **correct** code for this rule:

```html,correct
<div aria-hidden="true"></div>
<img aria-hidden="true">
<a aria-hidden="false" href="#"></a>
<button aria-hidden="true" tabindex="-1"></button>
<a href="/"></a>
<div aria-hidden="true"><a href="#"></a></div>
<div aria-hidden="true" contenteditable="false"></div>
```

## Resources

- [aria-hidden elements do not contain focusable elements](https://dequeuniversity.com/rules/axe/html/4.4/aria-hidden-focus)
- [Element with aria-hidden has no content in sequential focus navigation](https://www.w3.org/WAI/standards-guidelines/act/rules/6cfa84/proposed/)
- [MDN aria-hidden](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden)
