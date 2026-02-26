---
title: no-ineffective-attrs
description: Disallow HTML attributes that have no effect in their context.
---

# no-ineffective-attrs

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-ineffective-attrs": "error",
  },
};
```

## Rule Details

This rule disallows HTML attributes that have no effect in their context. Such attributes may indicate errors or unnecessary code that should be removed.

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

<!-- controlslist needs controls to work -->
<audio controlslist="nodownload"></audio>
<video controlslist="nofullscreen"></video>
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

<!-- defer and async work with external scripts -->
<script defer src="script.js"></script>
<script async src="script.js"></script>

<!-- download works when href is present -->
<a href="file.pdf" download="file.pdf">Download</a>

<!-- controlslist works when controls is present -->
<audio controls controlslist="nodownload"></audio>
<video controls controlslist="nofullscreen"></video>
```
