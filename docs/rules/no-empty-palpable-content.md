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

Elements that are empty or contain only whitespace (and no text content or replaced elements in any descendant) are not allowed.

The following are **not** flagged:

- Elements with `aria-label` or `aria-labelledby` — they have an accessible name
- Elements with `aria-hidden="true"` — intentionally removed from the accessibility tree
- Elements with `role="presentation"` or `role="none"` — decorative
- Elements containing replaced/embedded content (`<img>`, `<svg>`, `<video>`, `<audio>`, `<canvas>`, `<iframe>`, etc.)
- Elements containing custom/non-standard child elements (`<slot>`, `<my-component>`, template engine tags like `<block>`, `<content>`) — these expand to content at render time

### ❌ Incorrect

```html
<p></p>
<div></div>
<span><!-- comment only --></span>
<a href="/about"></a>
<button></button>
<li></li>
```

### ✅ Correct

```html
<!-- Has text content -->
<p>Some text content</p>
<div><span>Nested text</span></div>
<a href="/about">About us</a>
<button>Submit</button>
<li>Item text</li>

<!-- Has an accessible name via aria-label -->
<button aria-label="Close dialog"></button>
<a href="/" aria-label="Home"></a>

<!-- Intentionally hidden from assistive technology -->
<div aria-hidden="true"></div>
<span role="presentation"></span>

<!-- Contains a replaced element (img, svg, video, …) -->
<a href="/"><img alt="GitHub" src="logo.svg" /></a>
<button><svg viewBox="0 0 24 24">…</svg></button>

<!-- Contains a template slot or custom element -->
<label><slot></slot></label>
<p><my-content></my-content></p>
```

## Options

```ts
type Options = [
  {
    /**
     * Override the list of element names to check. When provided, this list
     * completely replaces the default set. Element names are case-insensitive.
     */
    checkElements?: string[];
  },
];
```

### `checkElements`

By default the rule checks semantically significant elements where emptiness is almost always a bug. Generic structural elements (`div`, `section`, `main`, etc.) are **not** included by default because they are commonly used as CSS-only containers or JavaScript-populated slots.

Default elements: `p`, `blockquote`, `q`, `a`, `button`, `label`, `em`, `strong`, `b`, `i`, `s`, `u`, `cite`, `code`, `kbd`, `samp`, `mark`, `small`, `sub`, `sup`, `var`, `abbr`, `dfn`, `bdi`, `bdo`, `ins`, `del`, `li`, `dt`, `dd`, `figcaption`, `caption`, `time`, `data`, `output`

To restrict checking to only specific elements:

```js
// .eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-empty-palpable-content": [
      "error",
      { checkElements: ["p", "div", "span", "a", "button"] },
    ],
  },
};
```

### Resources

- [MDN: Palpable content](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Content_categories#palpable_content)
- [MDN: `<p>` accessibility concerns](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/p#accessibility)
