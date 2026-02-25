---
title: no-empty-palpable-content
description: >-
  Disallow empty palpable content elements that are announced by assistive technology but contain no content.
---

# no-empty-palpable-content

This rule disallows [palpable content](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Content_categories#palpable_content) elements that have no meaningful text content.

### Why?

When a palpable content element (such as `<p>`, `<div>`, `<span>`, `<button>`, `<a>`, etc.) is empty, screen readers may still announce the element's presence but find no content to convey — which can be confusing and disorienting for users who rely on assistive technology.

Common examples of this anti-pattern:

- Empty `<p>` tags used as spacing hacks (use CSS `margin`/`padding` instead)
- Empty `<div>` or `<span>` tags left over from incomplete markup
- Empty `<a>` or `<button>` elements with no accessible name

> **Note:** Headings (`<h1>`–`<h6>`) are intentionally excluded because they are already covered by the [`no-empty-headings`](./no-empty-headings.md) rule.

## How to use

```js
// .eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-empty-palpable-content": "error",
  },
};
```

## Rule Details

Elements that are empty or contain only whitespace (and no text content in any descendant) are not allowed.

### ❌ Incorrect

```html
<p></p>
<div>   </div>
<span><!-- comment only --></span>
<a href="/about"></a>
<button></button>
<li></li>
```

### ✅ Correct

```html
<p>Some text content</p>
<div><span>Nested text</span></div>
<a href="/about">About us</a>
<button>Submit</button>
<li>Item text</li>
```

## Options

```ts
type Options = [
  {
    /**
     * Override the list of element names to check.
     * When provided, this list completely replaces the default set.
     * Element names are case-insensitive.
     */
    checkElements?: string[];
  }
];
```

### `checkElements`

By default the rule checks the following elements:

`p`, `div`, `section`, `article`, `aside`, `main`, `nav`, `header`, `footer`, `address`, `blockquote`, `pre`, `figure`, `figcaption`, `a`, `button`, `label`, `details`, `summary`, `span`, `em`, `strong`, `b`, `i`, `s`, `u`, `q`, `cite`, `code`, `kbd`, `samp`, `mark`, `small`, `sub`, `sup`, `var`, `output`, `time`, `data`, `dfn`, `abbr`, `bdi`, `bdo`, `ins`, `del`, `li`, `dt`, `dd`, `caption`, `fieldset`, `legend`

To restrict checking to only specific elements:

```js
// .eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-empty-palpable-content": [
      "error",
      { checkElements: ["p", "div", "span", "a", "button"] }
    ],
  },
};
```

### Resources

- [MDN: Palpable content](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Content_categories#palpable_content)
- [MDN: `<p>` accessibility concerns](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/p#accessibility)
