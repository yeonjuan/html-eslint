---
title: no-ineffective-attrs
description: Disallow HTML attributes that have no effect in their React/JSX context.
---
# no-ineffective-attrs

This rule disallows HTML attributes that have no effect in their context in React/JSX code.

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
      "@html-eslint/react/no-ineffective-attrs": "error",
    },
  },
];
```

## Rule Details

This rule disallows HTML attributes that have no effect in their context. Such attributes may indicate errors or unnecessary code that should be removed.

**Note**: This rule only checks lowercase HTML elements (e.g., `<input>`, `<script>`). PascalCase React components (e.g., `<Input>`) and custom elements with hyphens (e.g., `<my-input>`) are ignored.

## Examples

Examples of **incorrect** code for this rule:

```jsx
// multiple has no effect on text inputs
<input type="text" multiple />

// multiple has no effect on checkbox inputs
<input type="checkbox" multiple />

// accept only works with file inputs
<input type="text" accept=".jpg,.png" />

// readonly has no effect on checkbox inputs
<input type="checkbox" readOnly />

// readonly has no effect on file inputs
<input type="file" readOnly />

// min/max/step only work with numeric, date, and time inputs
<input type="text" min="0" max="100" />
<input type="password" step="5" />

// pattern only works with text-based inputs
<input type="checkbox" pattern="[0-9]+" />

// maxlength/minlength only work with text-based inputs
<input type="number" maxLength="10" />
<input type="radio" minLength="5" />

// placeholder has no effect on these input types
<input type="checkbox" placeholder="Enter value" />
<input type="radio" placeholder="Select" />

// size only works with text-based inputs
<input type="checkbox" size="20" />

// list has no effect on these input types
<input type="checkbox" list="suggestions" />
<input type="radio" list="options" />

// defer has no effect on inline scripts
<script defer>
  console.log("hello");
</script>

// async has no effect on inline scripts
<script async>
  console.log("hello");
</script>

// download needs href to work
<a download="file.pdf">Download</a>

// target needs href to work
<a target="_blank">Open</a>

// ping needs href to work
<a ping="/analytics">Link</a>

// controlslist needs controls to work
<audio controlsList="nodownload"></audio>
<video controlsList="nofullscreen"></video>

// enctype only has effect when method is "post"
<form method="get" encType="multipart/form-data"></form>

// form* attributes only work with type="submit"
<button type="button" formAction="/submit">Submit</button>
<button type="reset" formMethod="post">Reset</button>

// usemap and ismap cannot be used together
<img src="map.jpg" useMap="#map" isMap />
```

Examples of **correct** code for this rule:

```jsx
// multiple works with email and file inputs
<input type="email" multiple />
<input type="file" multiple />
<select multiple></select>

// accept works with file inputs
<input type="file" accept=".jpg,.png" />

// readonly works with text and password inputs
<input type="text" readOnly />
<input type="password" readOnly />

// min/max/step work with numeric, date, and time inputs
<input type="number" min="0" max="100" />
<input type="range" min="0" max="10" step="2" />
<input type="date" min="2020-01-01" max="2025-12-31" />

// pattern works with text-based inputs
<input type="text" pattern="[0-9]+" />
<input type="email" pattern=".+@example\.com" />

// maxlength/minlength work with text-based inputs
<input type="text" maxLength="10" minLength="3" />
<input type="password" maxLength="20" />

// placeholder works with text and number inputs
<input type="text" placeholder="Enter name" />
<input type="number" placeholder="Enter age" />

// size works with text-based inputs
<input type="text" size="20" />

// list works with appropriate input types
<input type="text" list="suggestions" />
<input type="email" list="emails" />

// defer and async work with external scripts
<script defer src="script.js"></script>
<script async src="script.js"></script>

// download works when href is present
<a href="file.pdf" download="file.pdf">Download</a>

// target works when href is present
<a href="https://example.com" target="_blank">Open</a>

// ping works when href is present
<a href="/page" ping="/analytics">Link</a>

// controlslist works when controls is present
<audio controls controlsList="nodownload"></audio>
<video controls controlsList="nofullscreen"></video>

// enctype works when method is "post"
<form method="post" encType="multipart/form-data"></form>

// form* attributes work with type="submit"
<button type="submit" formAction="/submit">Submit</button>
<button type="submit" formMethod="post">Submit</button>

// usemap without ismap
<img src="map.jpg" useMap="#map" />

// JSX expressions are skipped (dynamic values)
<input type={inputType} multiple />
<script defer={shouldDefer}>alert('hi')</script>

// Custom components are ignored
<Input type="checkbox" multiple />
<MyButton type="button" formAction="/submit">Click</MyButton>
<custom-input type="text" multiple />
```

## Checked Attributes

### Input Element

- `multiple` - Only effective on email, file, and select inputs
- `accept` - Only effective on file inputs
- `readonly` - Not effective on checkbox, radio, file, range, color inputs
- `min`, `max`, `step` - Only effective on number, range, date, datetime-local, month, time, week inputs
- `pattern` - Only effective on text, search, url, tel, email, password inputs
- `maxlength`, `minlength` - Only effective on text, search, url, tel, email, password inputs
- `placeholder` - Only effective on text, search, url, tel, email, password, number inputs
- `size` - Only effective on text, search, url, tel, email, password inputs
- `list` - Not effective on checkbox, radio, file, submit, image, reset, button, hidden inputs

### Script Element

- `defer`, `async` - Only effective on external scripts (with `src` attribute)

### Anchor (`<a>`) and Area Elements

- `download`, `ping`, `target` - Only effective when `href` is present

### Audio and Video Elements

- `controlslist` - Only effective when `controls` is present

### Form Element

- `enctype` - Only effective when `method` is "post"

### Button Element

- `formaction`, `formmethod`, `formenctype`, `formnovalidate`, `formtarget` - Only effective when `type` is "submit"

### Image Element

- `usemap` - Cannot be used together with `ismap`

### Link Element

- `sizes` - Only effective with `rel="icon"` or `rel="apple-touch-icon"`

## Further Reading

- [HTML Spec](https://html.spec.whatwg.org)
- [React DOM Elements](https://react.dev/reference/react-dom/components/common)
