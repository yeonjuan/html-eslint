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

<!-- accept only works with file inputs -->
<input type="text" accept=".jpg,.png" />

<!-- defer has no effect on inline scripts -->
<script defer>
  console.log("hello");
</script>

<!-- value attribute has no effect on textarea -->
<textarea value="default">actual content</textarea>

<!-- download needs href to work -->
<a download="file.pdf">Download</a>

<!-- enctype only applies to POST forms -->
<form method="get" enctype="multipart/form-data">
  <input type="text" name="query" />
</form>
```

Examples of **correct** code for this rule:

```html
<!-- multiple works with file inputs -->
<input type="file" multiple />

<!-- accept works with file inputs -->
<input type="file" accept=".jpg,.png" />

<!-- defer works with external scripts -->
<script defer src="script.js"></script>

<!-- textarea uses content, not value attribute -->
<textarea>default content</textarea>

<!-- download works when href is present -->
<a href="file.pdf" download="file.pdf">Download</a>

<!-- enctype applies to POST forms -->
<form method="post" enctype="multipart/form-data">
  <input type="file" name="upload" />
</form>
```
