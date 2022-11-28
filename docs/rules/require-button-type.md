---
id: require-button-type
title: "require-button-type"
---

## Require use of button element with a valid type attribute.

### Rule Details

This rule enforces use of a valid type attribute for button elements. (`"button"`, `"submit"`,  `"reset"`)

Examples of **incorrect** code for this rule:

<!-- prettier-ignore-start -->

```html
<button></button>
<button type="invalid"></button>
```
<!-- prettier-ignore-end -->

Examples of **correct** code for this rule:

```html
<button type="submit"></button>
<button type="button"></button>
<button type="reset"></button>
```

### Further reading

- [HTML spec - the button element](https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type)
