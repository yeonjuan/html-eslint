---
title: react/require-li-container
description: Require li elements to be inside ul, ol, or menu elements in React/JSX.
---

# require-li-container

This rule enforces that `<li>` elements must be children of `<ul>`, `<ol>` or `<menu>`.

## How to use

```js
// eslint.config.js (flat config)
import htmlReact from "@html-eslint/eslint-plugin-react";

export default [
  {
    files: ["**/*.jsx", "**/*.tsx"],
    plugins: {
      "@html-eslint/react": htmlReact,
    },
    rules: {
      "@html-eslint/react/require-li-container": "error",
    },
  },
];
```

## Rule Details

The `<li>` tag should be contained in a parent element: `<ol>`, `<ul>` or `<menu>`.

**Note**: A `<li>` nested inside a custom component (e.g. `<CustomList><li>...</li></CustomList>`), or with no enclosing JSX element at all (e.g. returned directly from a component that will be composed into a list via `children`), is allowed since the actual rendered container can't be statically verified.

## Examples

Examples of **incorrect** code for this rule:

```jsx
<div>
  <li>item 1</li>
  <li>item 2</li>
</div>
```

Examples of **correct** code for this rule:

```jsx
<ul>
  <li>item 1</li>
  <li>item 2</li>
</ul>

<ol>
  {items.map((item) => (
    <li key={item.id}>{item.label}</li>
  ))}
</ol>

<CustomList>
  <li>item</li>
</CustomList>

function ListItem({ children }) {
  return <li>{children}</li>;
}
```

## Further Reading

- [MDN - li](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li)
