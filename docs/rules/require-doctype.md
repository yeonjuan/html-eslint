---
id: require-doctype
title: "require-doctype"
---

# require-doctype

Require `<!DOCTYPE html>` in the document

## How to use

.eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/require-doctype": "error",
  },
};
```

## Rule Details

This rule enforces the `<!DOCTYPE html>`.

Examples of **incorrect** code for this rule:

```html
<html></html>
```

Examples of **correct** code for this rule:

```html
<!DOCTYPE html>
<html></html>
```

## Further reading

- [MDN - Doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype)
