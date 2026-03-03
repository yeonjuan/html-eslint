---
title: no-invalid-attr-value
description: Disallow invalid attribute values according to HTML standards and validate against the HTML specification.
---

# no-invalid-attr-value

This rule disallows invalid attribute values according to HTML standards.

## How to use

```js
// eslint.config.js (flat config)
import angularTemplate from "@html-eslint/eslint-plugin-angular-template";
import templateParser from "@angular-eslint/template-parser";

export default [
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: templateParser,
    },
    plugins: {
      "@html-eslint/angular-template": angularTemplate,
    },
    rules: {
      "@html-eslint/angular-template/no-invalid-attr-value": "error",
    },
  },
];
```

## Rule Details

This rule validates attribute values against [HTML standards](https://html.spec.whatwg.org) and reports errors when invalid values are used.

**Note**: Custom elements with hyphens (e.g., `<my-input>`) are ignored. Angular property bindings (e.g., `[type]="value"`) are skipped as they contain dynamic expressions.

### Options

This rule accepts an options object with the following property:

- `allow`: An array of objects specifying tag/attribute combinations to allow. Each object can have:
  - `tag` (required): The HTML tag name to match (case-insensitive)
  - `attr` (required): The attribute name to match (case-insensitive)
  - `valuePattern` (optional): A regular expression pattern to match specific values. If omitted, all values for the specified tag/attribute combination are allowed.

#### Allowing all values for a specific tag and attribute

```js
// eslint.config.js (flat config)
export default [
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: templateParser,
    },
    plugins: {
      "@html-eslint/angular-template": angularTemplate,
    },
    rules: {
      "@html-eslint/angular-template/no-invalid-attr-value": [
        "error",
        {
          allow: [
            { tag: "input", attr: "type" },
            { tag: "button", attr: "type" },
          ],
        },
      ],
    },
  },
];
```

With this configuration, any value for `type` attribute on `input` and `button` elements will be allowed.

#### Allowing specific values using regex patterns

```js
// eslint.config.js (flat config)
export default [
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: templateParser,
    },
    plugins: {
      "@html-eslint/angular-template": angularTemplate,
    },
    rules: {
      "@html-eslint/angular-template/no-invalid-attr-value": [
        "error",
        {
          allow: [
            // Allow exact match
            { tag: "input", attr: "type", valuePattern: "^custom-type$" },
            // Allow multiple values
            { tag: "button", attr: "type", valuePattern: "^(custom|special)$" },
            // Allow pattern matching
            { tag: "form", attr: "method", valuePattern: "^custom-.*$" },
          ],
        },
      ],
    },
  },
];
```

## Examples

Examples of **incorrect** code for this rule:

```html
<!-- Invalid input type -->
<input type="invalid-type" />

<!-- Invalid crossorigin value -->
<img src="image.jpg" crossorigin="invalid" />

<!-- Invalid autocomplete value -->
<input type="text" autocomplete="invalid-value" />

<!-- Invalid button type -->
<button type="invalid">Click</button>

<!-- Invalid form method -->
<form method="invalid"></form>

<!-- Invalid scope -->
<th scope="invalid">Header</th>

<!-- Errors in Angular control flow -->
@if (show) { <input type="invalid" /> } @for (item of items; track item.id) {
<button type="invalid">Click</button>
}
```

Examples of **correct** code for this rule:

```html
<!-- Valid input types -->
<input type="text" />
<input type="email" />
<input type="number" />

<!-- Valid crossorigin values -->
<img src="image.jpg" crossorigin="anonymous" />
<img src="image.jpg" crossorigin="use-credentials" />

<!-- Valid autocomplete values -->
<input type="text" autocomplete="name" />
<input type="email" autocomplete="email" />

<!-- Valid button types -->
<button type="button">Click</button>
<button type="submit">Submit</button>

<!-- Valid form methods -->
<form method="post"></form>
<form method="get"></form>

<!-- Valid scope values -->
<th scope="row">Header</th>
<th scope="col">Header</th>

<!-- Angular property bindings are skipped -->
<input [type]="inputType" />
<button [type]="buttonType">Click</button>

<!-- Custom elements are ignored -->
<custom-input type="invalid" />
```

### With `allow` option

Examples of **correct** code for this rule with the `allow` option:

```js
{
  "allow": [
    { "tag": "input", "attr": "type" }
  ]
}
```

```html
<!-- Any value is allowed for input type when allowed -->
<input type="custom-type" />
<input type="my-special-type" />
```

```js
{
  "allow": [
    { "tag": "input", "attr": "type", "valuePattern": "^custom-.*$" }
  ]
}
```

```html
<!-- Only values matching the pattern are allowed -->
<input type="custom-foo" />
<input type="custom-bar" />
```

Examples of **incorrect** code for this rule with the `allow` option:

```js
{
  "allow": [
    { "tag": "input", "attr": "type", "valuePattern": "^custom-.*$" }
  ]
}
```

```html
<!-- Does not match the pattern -->
<input type="invalid-type" />
<input type="special-type" />
```

## Further Reading

- [HTML Spec](https://html.spec.whatwg.org)
- [Angular Template Syntax](https://angular.dev/guide/templates)
