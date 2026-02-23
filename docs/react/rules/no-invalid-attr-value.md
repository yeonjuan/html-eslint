---
title: no-invalid-attr-value
description: Disallow invalid attribute values in React/JSX according to HTML standards.
---
# no-invalid-attr-value

This rule disallows invalid attribute values according to HTML standards in React/JSX.

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
      "@html-eslint/react/no-invalid-attr-value": "error",
    },
  },
];
```

## Rule Details

This rule validates attribute values against [HTML standards](https://html.spec.whatwg.org) and reports errors when invalid values are used in JSX elements.

**Note**: This rule only checks lowercase HTML elements (e.g., `<div>`, `<input>`). PascalCase React components (e.g., `<MyComponent>`) and custom elements with hyphens (e.g., `<my-element>`) are ignored.

### Options

This rule accepts an options object with the following property:

- `allow`: An array of objects specifying tag/attribute combinations to allow. Each object can have:
  - `tag` (required): The HTML tag name to match (case-insensitive)
  - `attr` (required): The attribute name to match (case-insensitive)
  - `valuePattern` (optional): A regular expression pattern to match specific values. If omitted, all values for the specified tag/attribute combination are allowed.

#### Allowing all values for a specific tag and attribute

```js
// eslint.config.js
export default [
  {
    files: ["**/*.jsx"],
    plugins: {
      "@html-eslint/react": htmlReact,
    },
    rules: {
      "@html-eslint/react/no-invalid-attr-value": [
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
// eslint.config.js
export default [
  {
    files: ["**/*.jsx"],
    plugins: {
      "@html-eslint/react": htmlReact,
    },
    rules: {
      "@html-eslint/react/no-invalid-attr-value": [
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

```jsx
// Invalid input type
<input type="invalid-type" />
<input type="txt" />

// Invalid crossorigin value
<img src="image.jpg" crossOrigin="invalid" />

// Invalid autocomplete value
<input type="text" autocomplete="invalid-value" />

// Invalid button type
<button type="invalid">Click</button>

// Invalid form method
<form method="put"></form>

// Invalid loading value
<img src="image.jpg" loading="invalid" />

// Invalid dir value
<div dir="invalid">Text</div>
```

Examples of **correct** code for this rule:

```jsx
// Valid input types
<input type="text" />
<input type="email" />
<input type="number" />

// Valid crossorigin values
<img src="image.jpg" crossOrigin="anonymous" />
<img src="image.jpg" crossOrigin="use-credentials" />

// Valid autocomplete values
<input type="text" autocomplete="name" />
<input type="email" autocomplete="email" />

// Valid button types
<button type="button">Click</button>
<button type="submit">Submit</button>

// Valid form methods
<form method="post"></form>
<form method="get"></form>

// Valid loading values
<img src="image.jpg" loading="lazy" />
<img src="image.jpg" loading="eager" />

// Valid dir values
<div dir="ltr">Text</div>
<div dir="rtl">Text</div>

// JSX expressions are skipped (dynamic values)
<input type={inputType} />
<button type={type}>Click</button>
<img loading={loading} />

// JSX spread attributes are skipped
<input {...props} />

// Custom components are ignored
<Input type="invalid-type" />
<MyButton type="invalid">Click</MyButton>
<custom-button type="invalid">Click</custom-button>
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

```jsx
// Any value is allowed for input type when allowed
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

```jsx
// Only values matching the pattern are allowed
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

```jsx
// Does not match the pattern
<input type="invalid-type" />
<input type="special-type" />
```

## React-specific Notes

- **Attribute naming**: React uses camelCase for HTML attributes (`className`, `htmlFor`, `crossOrigin`, etc.). This rule correctly handles both the camelCase React prop names and their lowercase HTML equivalents.

- **JSX expressions**: Attribute values in JSX expression containers are treated as dynamic values and are not validated. For example:
  - `<input type={someVar} />` - Not validated (dynamic)
  - `<input type={"text"} />` - Not validated (expression container)
  - `<input type="text" />` - Validated (string literal)

- **Custom components**: Components with PascalCase names (e.g., `<Input>`, `<Button>`) are treated as React components and ignored by this rule.

- **Member expressions**: Components using dot notation (e.g., `<Form.Input>`) are also ignored.

## Further Reading

- [HTML Spec](https://html.spec.whatwg.org)
