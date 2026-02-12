# no-invalid-attr-value

This rule disallows invalid attribute values according to HTML standards.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-invalid-attr-value": "error",
  },
};
```

## Rule Details

This rule validates attribute values against [HTML standards](https://html.spec.whatwg.org) and reports errors when invalid values are used.

### Options

This rule accepts an options object with the following property:

- `allow`: An array of objects specifying tag/attribute combinations to allow. Each object can have:
  - `tag` (required): The HTML tag name to match (case-insensitive)
  - `attr` (required): The attribute name to match (case-insensitive)
  - `valuePattern` (optional): A regular expression pattern to match specific values. If omitted, all values for the specified tag/attribute combination are allowed.

#### Allowing all values for a specific tag and attribute

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-invalid-attr-value": [
      "error",
      {
        allow: [
          { tag: "input", attr: "type" },
          { tag: "button", attr: "type" }
        ]
      }
    ]
  }
};
```

With this configuration, any value for `type` attribute on `input` and `button` elements will be allowed.

#### Allowing specific values using regex patterns

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-invalid-attr-value": [
      "error",
      {
        allow: [
          // Allow exact match
          { tag: "input", attr: "type", valuePattern: "^custom-type$" },
          // Allow multiple values
          { tag: "button", attr: "type", valuePattern: "^(custom|special)$" },
          // Allow pattern matching
          { tag: "form", attr: "method", valuePattern: "^custom-.*$" }
        ]
      }
    ]
  }
};
```

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

### With `allow` option

Examples of **correct** code for this rule with the `allow` option:

```js,.eslintrc.js
{
  "allow": [
    { "tag": "input", "attr": "type" }
  ]
}
```

```html,correct
<!-- Any value is allowed for input type when allowed -->
<input type="custom-type" />
<input type="my-special-type" />
```

```js,.eslintrc.js
{
  "allow": [
    { "tag": "input", "attr": "type", "valuePattern": "^custom-.*$" }
  ]
}
```

```html,correct
<!-- Only values matching the pattern are allowed -->
<input type="custom-foo" />
<input type="custom-bar" />
```

Examples of **incorrect** code for this rule with the `allow` option:

```js,.eslintrc.js
{
  "allow": [
    { "tag": "input", "attr": "type", "valuePattern": "^custom-.*$" }
  ]
}
```

```html,incorrect
<!-- Does not match the pattern -->
<input type="invalid-type" />
<input type="special-type" />
```

## Further Reading

- [HTML Spec](https://html.spec.whatwg.org)
