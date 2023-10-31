# @html-eslint/require-button-type

Require use of button element with a valid type attribute.

## How to use

- .eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/require-button-type": "error",
  },
};
```

## Rule Details

This rule enforces use of a valid type attribute for button elements. (`"button"`, `"submit"`, `"reset"`)

Examples of **incorrect** code for this rule:

<!-- prettier-ignore -->
```html
<button></button>
<button type="invalid"></button>
```

Examples of **correct** code for this rule:

```html
<button type="submit"></button>
<button type="button"></button>
<button type="reset"></button>
```

## Further reading

- [HTML spec - the button element](https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type)
