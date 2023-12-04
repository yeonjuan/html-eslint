# no-multiple-empty-lines

This rule disallows use of multiple empty lines.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-multiple-empty-lines": "error",
  },
};
```

## Rule Details

This rule disallows the use of empty lines which exceeded the maximum lines allowed.

### Options

- `max` (default 2): enforces a maximum number of consecutive empty lines.

Examples of **incorrect** code for this rule with the default `{ "max": 2 }` option:

<!-- prettier-ignore -->
```html,incorrect
<div id="foo"></div>



<div id="bar"></div>
```

Examples of **correct** code for this rule with the default `{ "max": 2 }` option:

<!-- prettier-ignore -->
```html,correct
<div id="foo"></div>


<div id="bar"></div>
```
