---
id: require-title
title: "@html-eslint/require-title"
---

## Require `<title>` in the `<head>`.

`<title><title/>` tag is used to define the document's title.
The content of the title is used by the search engine to decide the order of search results.

### Rule Details

This rule enforces `<title><title/>` tag in the `<head><head/>`.

Examples of **incorrect** code for this rule:

```html
<html>
  <head> </head>
</html>

<!-- empty title -->
<html>
  <head>
    <title> </title>
  </head>
</html>
```

Examples of **correct** code for this rule:

```html
<html>
  <head>
    <title>Site Title</title>
  </head>
</html>
```

### Further reading

[MDN - title](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title)
