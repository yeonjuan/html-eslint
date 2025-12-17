# no-obsolete-attrs

This rule disallows the use of obsolete attributes in HTML5.

## Why?

Many attributes that were commonly used in earlier HTML versions are now obsolete in HTML5.
These attributes are discouraged and should be replaced with modern alternatives, typically CSS or JavaScript.

Using obsolete attributes can lead to:

- Non-standard HTML that may not be future-proof
- Inconsistent rendering across browsers
- Maintenance issues when updating codebases

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-obsolete-attrs": "error",
  },
};
```

## Rule Details

This rule disallows using obsolete attributes on HTML elements and provides suggestions for modern alternatives.

Examples of **incorrect** code for this rule:

```html,incorrect
<!-- Obsolete presentational attributes -->
<table align="center" bgcolor="#ffffff" border="1"></table>
<div align="left">Content</div>
<img src="image.jpg" border="0">

<!-- Obsolete name attribute on certain elements -->
<a name="anchor">Link</a>
<img name="myimage" src="image.jpg">

<!-- Obsolete charset attribute on non-script elements -->
<a charset="UTF-8" href="page.html">Link</a>

<!-- Obsolete manifest attribute -->
<html manifest="app.appcache"></html>

<!-- Other obsolete attributes -->
<iframe frameborder="0" scrolling="no"></iframe>
<body bgcolor="#ffffff" text="#000000"></body>
<td scope="row">Cell</td>
```

Examples of **correct** code for this rule:

```html,correct
<!-- Use CSS instead of presentational attributes -->
<table style="text-align: center; background-color: #ffffff; border: 1px solid black;"></table>
<div style="text-align: left;">Content</div>
<img src="image.jpg" style="border: 0;">

<!-- Use id instead of name on certain elements -->
<a id="anchor">Link</a>
<img id="myimage" src="image.jpg">

<!-- Omit charset on non-script elements -->
<a href="page.html">Link</a>

<!-- Use service workers instead of manifest -->
<html></html>

<!-- Use CSS for iframe styling -->
<iframe style="border: 0;"></iframe>
<body style="background-color: #ffffff; color: #000000;"></body>

<!-- Use th with scope instead of td -->
<th scope="row">Header</th>
```

## Further Reading

- [HTML Spec: Non-conforming features](https://html.spec.whatwg.org/dev/obsolete.html#non-conforming-features)
