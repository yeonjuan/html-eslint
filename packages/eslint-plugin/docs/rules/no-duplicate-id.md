# Disallow duplicate `id` attributes.

## Rule Details

This rule disallow the use of duplicate `id` attributes.

Examples of **incorrect** code for this rule:

```html
<div id="foo"></div>
<div id="foo"></div>
```

Examples of **correct** code for this rule:

```html
<div id="foo"></div>
<div id="bar"></div>
```

## Further reading

[MDN - id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id)
