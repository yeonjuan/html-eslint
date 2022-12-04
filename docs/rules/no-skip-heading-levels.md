---
id: no-skip-heading-levels
title: "no-skip-heading-levels"
---

# no-skip-heading-levels

Disallow skipping heading levels.

## Rule Details

This rule disallow skipping heading levels.

Examples of **incorrect** code for this rule:

```html
<html>
  <body>
    <h1>head1</h1>
    <h3>head3</h3>
  </body>
</html>
```

Examples of **correct** code for this rule:

```html
<html>
  <body>
    <h1>head1</h1>
    <h2>head2</h2>
  </body>
</html>
```

## Further reading

- [MDN - heading elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements)
