---
title: angular-template/no-ineffective-attrs
description: Disallow HTML attributes that have no effect in their context in Angular templates.
---

# no-ineffective-attrs

This rule disallows HTML attributes that have no effect in their context in Angular template files.

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
      "@html-eslint/angular-template/no-ineffective-attrs": "error",
    },
  },
];
```

## Rule Details

This rule disallows HTML attributes that have no effect in their context. Such attributes may indicate errors or unnecessary code that should be removed.

**Note**: This rule only checks lowercase HTML elements (e.g., `<input>`, `<script>`). Custom elements with hyphens (e.g., `<my-input>`) are ignored.

## Examples

Examples of **incorrect** code for this rule:

```html
<!-- multiple has no effect on text inputs -->
<input type="text" multiple />

<!-- multiple has no effect on checkbox inputs -->
<input type="checkbox" multiple />

<!-- accept only works with file inputs -->
<input type="text" accept=".jpg,.png" />

<!-- readonly has no effect on checkbox inputs -->
<input type="checkbox" readonly />

<!-- readonly has no effect on file inputs -->
<input type="file" readonly />

<!-- min/max/step only work with numeric, date, and time inputs -->
<input type="text" min="0" max="100" />
<input type="password" step="5" />

<!-- pattern only works with text-based inputs -->
<input type="checkbox" pattern="[0-9]+" />

<!-- maxlength/minlength only work with text-based inputs -->
<input type="number" maxlength="10" />
<input type="radio" minlength="5" />

<!-- placeholder has no effect on these input types -->
<input type="checkbox" placeholder="Enter value" />
<input type="radio" placeholder="Select" />

<!-- size only works with text-based inputs -->
<input type="checkbox" size="20" />

<!-- list has no effect on these input types -->
<input type="checkbox" list="suggestions" />
<input type="radio" list="options" />

<!-- defer has no effect on inline scripts -->
<script defer>
  console.log("hello");
</script>

<!-- async has no effect on inline scripts -->
<script async>
  console.log("hello");
</script>

<!-- download needs href to work -->
<a download="file.pdf">Download</a>

<!-- target needs href to work -->
<a target="_blank">Open</a>

<!-- ping needs href to work -->
<a ping="/analytics">Link</a>

<!-- controlslist needs controls to work -->
<audio controlslist="nodownload"></audio>
<video controlslist="nofullscreen"></video>

<!-- enctype only has effect when method is "post" -->
<form method="get" enctype="multipart/form-data"></form>

<!-- form* attributes only work with type="submit" -->
<button type="button" formaction="/submit">Submit</button>
<button type="reset" formmethod="post">Reset</button>

<!-- usemap and ismap cannot be used together -->
<img src="map.jpg" usemap="#map" ismap />
```

Examples of **correct** code for this rule:

```html
<!-- multiple works with email and file inputs -->
<input type="email" multiple />
<input type="file" multiple />
<select multiple></select>

<!-- accept works with file inputs -->
<input type="file" accept=".jpg,.png" />

<!-- readonly works with text and password inputs -->
<input type="text" readonly />
<input type="password" readonly />

<!-- min/max/step work with numeric, date, and time inputs -->
<input type="number" min="0" max="100" />
<input type="range" min="0" max="10" step="2" />
<input type="date" min="2020-01-01" max="2025-12-31" />

<!-- pattern works with text-based inputs -->
<input type="text" pattern="[0-9]+" />
<input type="email" pattern=".+@example\.com" />

<!-- maxlength/minlength work with text-based inputs -->
<input type="text" maxlength="10" minlength="3" />
<input type="password" maxlength="20" />

<!-- placeholder works with text and number inputs -->
<input type="text" placeholder="Enter name" />
<input type="number" placeholder="Enter age" />

<!-- size works with text-based inputs -->
<input type="text" size="20" />

<!-- list works with appropriate input types -->
<input type="text" list="suggestions" />
<input type="email" list="emails" />

<!-- defer and async work with external scripts -->
<script defer src="script.js"></script>
<script async src="script.js"></script>

<!-- download works when href is present -->
<a href="file.pdf" download="file.pdf">Download</a>

<!-- target works when href is present -->
<a href="https://example.com" target="_blank">Open</a>

<!-- ping works when href is present -->
<a href="/page" ping="/analytics">Link</a>

<!-- controlslist works when controls is present -->
<audio controls controlslist="nodownload"></audio>
<video controls controlslist="nofullscreen"></video>

<!-- enctype works when method is "post" -->
<form method="post" enctype="multipart/form-data"></form>

<!-- form* attributes work with type="submit" -->
<button type="submit" formaction="/submit">Submit</button>
<button type="submit" formmethod="post">Submit</button>

<!-- usemap without ismap -->
<img src="map.jpg" usemap="#map" />

<!-- Angular property binding is skipped (dynamic values) -->
<input [type]="inputType" multiple />

<!-- Custom elements are ignored -->
<custom-input type="text" multiple />
<my-button type="button" formaction="/submit">Click</my-button>
```

## Further Reading

- [HTML Spec](https://html.spec.whatwg.org)
- [Angular Template Syntax](https://angular.dev/guide/templates)
