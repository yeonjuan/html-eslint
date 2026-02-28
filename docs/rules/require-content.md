---
title: require-content
description: >-
  Require that certain elements have meaningful content or an accessible name.
---

# require-content

This rule enforces that elements which must convey meaning contain actual content (text or child elements), or declare an accessible name via ARIA attributes.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/require-content": "error",
  },
};
```

## Rule Details

Empty elements that are expected to carry meaning are flagged. The following elements are checked by default: `h1–h6`, `p`, `a`, `button`, `li`, `dt`, `dd`, `option`, `label`.

Examples of **incorrect** code for this rule:

<!-- prettier-ignore -->
```html,incorrect
<p></p>
<button></button>
<a href="/home"></a>
<h1>   </h1>
<label></label>
```

Examples of **correct** code for this rule:

<!-- prettier-ignore -->
```html,correct
<p>Welcome to the site.</p>
<button>Submit</button>
<a href="/home">Home</a>
<h1>Page title</h1>
<label>Name</label>

<!-- ARIA accessible name — visible content is optional -->
<button aria-label="Close dialog"></button>
<a href="/home" aria-labelledby="nav-home"></a>

<!-- Hidden elements are exempt -->
<p hidden></p>
<button aria-hidden="true"></button>

<!-- Child elements count as content -->
<button><img src="icon.svg" alt="Submit" /></button>
```

### Options

This rule has an object option:

```ts
"@html-eslint/require-content": ["error", {
  "elements": string[], // Default: h1–h6, p, a, button, li, dt, dd, option, label
}]
```

#### elements

Override the default element list with a custom set of tag names to check. Each item is either a plain tag name or a regex pattern string (wrapped in `/`), which is useful for matching custom elements.

```json
"@html-eslint/require-content": ["error", {
  "elements": ["p", "button", "a", "/^custom-/"]
}]
```

Plain strings are matched case-insensitively. Regex patterns are matched against the full tag name.

### Exemptions

The rule does **not** flag an element when any of the following are true:

- **`aria-label`** or **`aria-labelledby`** is present — the element has an accessible name via ARIA.
- **`hidden`** attribute is present — the element is hidden from the accessibility tree.
- **`aria-hidden="true"`** is present — the element is hidden from assistive technology.
