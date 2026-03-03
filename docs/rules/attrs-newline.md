---
title: attrs-newline
description: >-
  Enforce newline between attributes for better readability and maintainability
  of HTML code.
---

# attrs-newline

This rule enforces a newline between attributes when more than a certain number of attributes are present.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/attrs-newline": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

<!-- prettier-ignore -->
```html,incorrect
<p class="foo" data-custom id="p">
  <img class="foo" data-custom />
</p>
```

Examples of **correct** code for this rule:

```html,correct
<p
  class="foo"
  data-custom
  id="p"
>
  <img class="foo" data-custom />
</p>
```

### Options

This rule has an object option:

```ts
//...
"@html-eslint/attrs-newline": ["error", {
  "closeStyle": "sameline" | "newline", // Default `"newline"`
  "ifAttrsMoreThan": number, // Default `2`
  "skip": string[], // Default `[]`
  "inline": string[], // Default `[]`
}]
```

#### ifAttrsMoreThan

If there are more than this number of attributes, all attributes should be separated by newlines.

The default is `2`.

Examples of **correct** code for `"ifAttrsMoreThan": 2`

<!-- prettier-ignore -->
```html
<p class="foo" id="p">
  <img
    class="foo"
    data-custom
    id="img"
  />
</p>
```

#### closeStyle

How the open tag's closing bracket `>` should be spaced:

- `"newline"`: The closing bracket should be on a newline following the last attribute:
  <!-- prettier-ignore -->
  ```html
  <img
    class="foo"
    data-custom
    id="img"
  />
  ```

- `"sameline"`: The closing bracket should be on the same line following the last attribute
  <!-- prettier-ignore -->
  ```html
  <img
    class="foo"
    data-custom
    id="img" />
  ```

#### skip

A list of tag names for which the rule is entirely skipped, even if the number of attributes exceeds `ifAttrsMoreThan`. Useful for tags like `<pre>` or `<code>` where formatting must be preserved.

```json
"@html-eslint/attrs-newline": ["error", {
  "ifAttrsMoreThan": 1,
  "skip": ["pre", "code"]
}]
```

#### inline

A list of tag names that are treated as inline elements. The rule is skipped for these tags, allowing their attributes to stay on a single line even when `ifAttrsMoreThan` is exceeded. This is useful for inline elements embedded inside prose where expanding to multiple lines would break readability.

Supports the `$inline` preset, which covers all [HTML inline text semantics elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element#inline_text_semantics) (`a`, `abbr`, `b`, `span`, `strong`, etc.).

Examples of **correct** code for `"inline": ["$inline"]`:

<!-- prettier-ignore -->
```html
<p>
  Lorem ipsum <span class="highlight" data-id="1">dolor sit amet</span>,
  consectetur <a class="link" href="/foo" target="_blank">adipiscing</a> elit.
</p>
```
