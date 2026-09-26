---
title: svelte/require-li-container
description: Require li elements to be inside ul, ol, or menu elements in Svelte components.
---

# require-li-container

This rule enforces that `<li>` elements must be children of `<ul>`, `<ol>` or `<menu>`.

## How to use

```js
// eslint.config.js (flat config)
import svelteParser from "svelte-eslint-parser";
import htmlSvelte from "@html-eslint/eslint-plugin-svelte";

export default [
  {
    files: ["**/*.svelte"],
    plugins: {
      "@html-eslint/svelte": htmlSvelte,
    },
    languageOptions: {
      parser: svelteParser,
    },
    rules: {
      "@html-eslint/svelte/require-li-container": "error",
    },
  },
];
```

## Rule Details

The `<li>` tag should be contained in a parent element: `<ol>`, `<ul>` or `<menu>`.

**Note**: A `<li>` nested inside a Svelte component (e.g. `<CustomList><li>...</li></CustomList>`), or with no enclosing element at all (e.g. a component root meant to be composed into a list via slots/props), is allowed since the actual rendered container can't be statically verified.

## Examples

Examples of **incorrect** code for this rule:

```html,incorrect
<div>
  <li>item 1</li>
  <li>item 2</li>
</div>
```

Examples of **correct** code for this rule:

```html,correct
<ul>
  <li>item 1</li>
  <li>item 2</li>
</ul>

<ol>
  {#each items as item}
    <li>{item.label}</li>
  {/each}
</ol>

<CustomList>
  <li>item</li>
</CustomList>
```

## Further Reading

- [MDN - li](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li)
