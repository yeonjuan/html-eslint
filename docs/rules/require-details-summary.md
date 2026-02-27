---
title: require-details-summary
description: >-
  Require `<details>` elements to have a `<summary>` as their first child element.
---

# require-details-summary

The HTML specification states that the first child element of a `<details>` element should be a `<summary>`. The `<summary>` serves as the visible label/toggle for the disclosure widget. Without it, browsers generate a default label (typically "Details") which is rarely appropriate for users.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/require-details-summary": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

<!-- prettier-ignore -->
```html,incorrect
<!-- No <summary> at all -->
<details>
  <p>Hidden content</p>
</details>

<!-- <summary> is not the first element child -->
<details>
  <p>Content before summary</p>
  <summary>Toggle</summary>
</details>
```

Examples of **correct** code for this rule:

```html,correct
<details>
  <summary>Show more</summary>
  <p>Hidden content</p>
</details>

<details>
  <summary>Configuration options</summary>
  <ul>
    <li>Option A</li>
    <li>Option B</li>
  </ul>
</details>
```

## Further Reading

- [HTML spec - the details element](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-details-element)
- [HTML spec - the summary element](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-summary-element)
