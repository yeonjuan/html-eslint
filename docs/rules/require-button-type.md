# require-button-type

This rule enforces to use of button element with a valid type attribute.(`"button"`, `"submit"`, `"reset"`)

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/require-button-type": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

<!-- prettier-ignore -->
```html,incorrect
<button></button>
<button type="invalid"></button>
```

Examples of **correct** code for this rule:

```html,correct
<button type="submit"></button>
<button type="button"></button>
<button type="reset"></button>
```

## Further Reading

- [HTML spec - the button element](https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type)
