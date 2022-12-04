---
id: no-multiple-h1
title: "no-multiple-h1"
---

# no-multiple-h1

Disallow multiple `<h1><h1>`.

## Rule Details

This rule disallow the usage of multiple `<h1></h1>` tags.

Examples of **incorrect** code for this rule:

```html
<html>
  <body>
    <h1>head</h1>
    <h1>head</h1>
  </body>
</html>
```

Examples of **correct** code for this rule:

```html
<html>
  <body>
    <h1>head</h1>
  </body>
</html>
```

## Further reading

- [MDN - heading elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements)
