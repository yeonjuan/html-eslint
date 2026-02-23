---
title: no-obsolete-attrs
description: Disallow obsolete HTML attributes in React/JSX that are deprecated in HTML5.
---
# no-obsolete-attrs

This rule disallows the use of obsolete attributes in HTML5 in React/JSX code.

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
      "@html-eslint/react/no-obsolete-attrs": "error",
    },
  },
];
```

## Rule Details

This rule disallows using obsolete attributes on HTML elements and provides suggestions for modern alternatives.

## Examples

Examples of **incorrect** code for this rule:

```jsx
// Obsolete presentational attributes
<table align="center" bgcolor="#ffffff" border="1"></table>
<div align="left">Content</div>
<img src="image.jpg" border="0" />

// Obsolete name attribute on certain elements
<a name="anchor">Link</a>
<img name="myimage" src="image.jpg" />

// Obsolete charset attribute on non-script elements
<a charset="UTF-8" href="page.html">Link</a>

// Obsolete manifest attribute
<html manifest="app.appcache"></html>

// Other obsolete attributes
<iframe frameBorder="0" scrolling="no"></iframe>
<body bgcolor="#ffffff" text="#000000"></body>
<td scope="row">Cell</td>

// React camelCase attributes are also detected
<table cellPadding="5" cellSpacing="0"></table>
<iframe frameBorder="0"></iframe>
```

Examples of **correct** code for this rule:

```jsx
// Use CSS instead of presentational attributes
<table style={{ textAlign: "center", backgroundColor: "#ffffff", border: "1px solid black" }}></table>
<div style={{ textAlign: "left" }}>Content</div>
<img src="image.jpg" style={{ border: 0 }} />

// Use id instead of name on certain elements
<a id="anchor">Link</a>
<img id="myimage" src="image.jpg" />

// Omit charset on non-script elements
<a href="page.html">Link</a>

// Use service workers instead of manifest
<html></html>

// Use CSS for iframe styling
<iframe style={{ border: 0 }}></iframe>
<body style={{ backgroundColor: "#ffffff", color: "#000000" }}></body>

// Use th with scope instead of td
<th scope="row">Header</th>

// Custom components are ignored
<Table align="center" bgcolor="#ffffff">Content</Table>
<MyDiv align="left">Content</MyDiv>
<custom-table align="center">Content</custom-table>
```

## Further Reading

- [HTML Spec: Non-conforming features](https://html.spec.whatwg.org/dev/obsolete.html#non-conforming-features)
- [React DOM Elements](https://react.dev/reference/react-dom/components/common)
