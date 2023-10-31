# @html-eslint/no-target-blank

Disallow usage of unsafe `target='_blank'`.

## How to use

- .eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/no-target-blank": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html
<a target="_blank" href="http://example.com/"></a>
```

Examples of **correct** code for this rule:

```html
<a target="_blank" href="relative/path/"></a>
<a target="_blank" rel="noreferrer" href="http://example.com/"></a>
```
