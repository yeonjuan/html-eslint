# no-invalid-attr-value

This rule disallows invalid attribute values according to HTML standards.

## Why?

HTML attributes have specific value requirements defined in the HTML specification. Using invalid values can lead to:

- Unexpected behavior in browsers
- Accessibility issues
- Non-standard HTML that may not be future-proof
- Inconsistent rendering across different browsers
- Security vulnerabilities (e.g., invalid `rel` values, invalid `target` values)

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-invalid-attr-value": "error",
  },
};
```

## Rule Details

This rule validates attribute values against HTML standards and reports errors when invalid values are used.

Examples of **incorrect** code for this rule:

```html,incorrect
<!-- Invalid input type -->
<input type="invalid-type" />

<!-- Invalid crossorigin value -->
<img src="image.jpg" crossorigin="invalid" />

<!-- Invalid rel value -->
<link rel="invalid" href="style.css" />

<!-- Invalid autocomplete value -->
<input type="text" autocomplete="invalid-value" />

<!-- Invalid button type -->
<button type="invalid">Click</button>

<!-- Invalid form method -->
<form method="invalid"></form>

<!-- Invalid enctype -->
<form enctype="invalid"></form>

<!-- Invalid scope -->
<th scope="invalid">Header</th>
```

Examples of **correct** code for this rule:

```html,correct
<!-- Valid input type -->
<input type="text" />
<input type="email" />
<input type="number" />

<!-- Valid crossorigin value -->
<img src="image.jpg" crossorigin="anonymous" />
<img src="image.jpg" crossorigin="use-credentials" />

<!-- Valid rel value -->
<link rel="stylesheet" href="style.css" />
<a href="page.html" rel="noopener">Link</a>

<!-- Valid autocomplete value -->
<input type="text" autocomplete="name" />
<input type="email" autocomplete="email" />

<!-- Valid button type -->
<button type="button">Click</button>
<button type="submit">Submit</button>

<!-- Valid form method -->
<form method="post"></form>
<form method="get"></form>

<!-- Valid enctype -->
<form enctype="application/x-www-form-urlencoded"></form>
<form enctype="multipart/form-data"></form>

<!-- Valid scope -->
<th scope="row">Header</th>
<th scope="col">Header</th>
```

## Further Reading

- [HTML Spec: Input types](https://html.spec.whatwg.org/multipage/input.html#attr-input-type)
- [HTML Spec: Link types](https://html.spec.whatwg.org/multipage/links.html#linkTypes)
- [HTML Spec: CORS settings attribute](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#cors-settings-attribute)
- [HTML Spec: Autocomplete](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill)
