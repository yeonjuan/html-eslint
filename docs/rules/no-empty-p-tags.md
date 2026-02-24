---
title: no-empty-p-tags
description: >-
  Disallow empty `<p>` elements that are used as spacing hacks.
---

# no-empty-p-tags

This rule disallows `<p>` elements that have no meaningful text content.

### Why?

Using empty `<p>` elements to add whitespace between paragraphs is an accessibility anti-pattern. Screen readers announce the presence of a paragraph element but find no content inside it, which can confuse and frustrate users relying on assistive technology.

Use CSS `margin` or `padding` for visual spacing instead of empty markup.

> **MDN:** _"Using empty `<p>` elements to add space between paragraphs is problematic for people who navigate with screen-reading technology. Screen readers may announce the paragraph's presence, but not any content contained within it — because there is none."_

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-empty-p-tags": "error",
  },
};
```

## Rule Details

`<p>` elements that are empty or contain only whitespace (and no text content in any descendant) are not allowed.

### ❌ Incorrect

```html
<p></p>
<p>   </p>
<p><!-- spacing hack --></p>
<p><span></span></p>
```

### ✅ Correct

```html
<p>Some text content</p>
<p><span>Text inside a span</span></p>
<p>Mixed <em>emphasis</em> content</p>
```

### Resources

- [MDN: `<p>` accessibility concerns](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/p#accessibility)
