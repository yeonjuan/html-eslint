# no-invalid-attr-value

Disallow invalid attribute values according to HTML standards in Svelte components.

## Rule Details

This rule validates attribute values against [HTML standards](https://html.spec.whatwg.org) and reports errors when invalid values are used in Svelte components.

## Options

This rule accepts an options object with the following property:

- `allow`: An array of objects specifying tag/attribute combinations to allow. Each object can have:
  - `tag` (required): The HTML tag name to match (case-insensitive)
  - `attr` (required): The attribute name to match (case-insensitive)
  - `valuePattern` (optional): A regular expression pattern to match specific values. If omitted, all values for the specified tag/attribute combination are allowed.

### Allowing all values for a specific tag and attribute

```javascript
// eslint.config.js
export default [
  {
    plugins: {
      "@html-eslint/svelte": htmlSvelte,
    },
    rules: {
      "@html-eslint/svelte/no-invalid-attr-value": [
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

### Allowing specific values using regex patterns

```javascript
// eslint.config.js
export default [
  {
    plugins: {
      "@html-eslint/svelte": htmlSvelte,
    },
    rules: {
      "@html-eslint/svelte/no-invalid-attr-value": [
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

### Incorrect

```svelte
<!-- Invalid input type -->
<input type="invalid-type" />

<!-- Invalid crossorigin value -->
<img src="image.jpg" crossorigin="invalid" />

<!-- Invalid button type -->
<button type="invalid">Click</button>

<!-- Invalid form method -->
<form method="invalid"></form>
```

### Correct

```svelte
<!-- Valid input types -->
<input type="text" />
<input type="email" />
<input type="number" />

<!-- Valid crossorigin value -->
<img src="image.jpg" crossorigin="anonymous" />

<!-- Valid button type -->
<button type="button">Click</button>
<button type="submit">Submit</button>

<!-- Valid form method -->
<form method="post"></form>
<form method="get"></form>
```

### With Svelte Expressions

```svelte
<script>
  let inputType = 'text';
  let buttonType = 'button';
</script>

<!-- Dynamic values are allowed -->
<input type={inputType} />
<button type={buttonType}>Click</button>
```

### With `allow` option

```svelte
<!-- Custom values allowed when configured -->
<input type="custom-type" />
<input type="custom-foo" />
```

## When Not To Use It

If you're using custom elements or web components with non-standard attribute values, you may want to configure the `allow` option or disable this rule for those specific cases.

## Further Reading

- [HTML Spec](https://html.spec.whatwg.org)
- [Svelte Documentation](https://svelte.dev)
