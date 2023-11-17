---
id: no-script-style-type
title: "no-script-style-type"
---

# no-script-style-type

Enforce to omit default type attributes for style sheets and scripts.

.eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/no-script-style-type": "error",
  },
};
```

## Rule Details

This rule disallows the use of `type` attributes for style sheets (unless not using CSS) and scripts (unless not using JavaScript).
Specifying below `type` attributes is not necessary as HTML5 implies `text/css` and `text/javascript` as defaults

- script - `type="text/javascript"`
- style, link - `type="text/css"`

Examples of **incorrect** code for this rule:

```html
<script type="text/javascript" src="https://script.js"></script>
```

```html
<link type="text/css" rel="stylesheet" href="https://styles.css" />
```

```html
<style type="text/css"></style>
```

Examples of **correct** code for this rule:

```html
<script src="https://script.js"></script>
```

```html
<script type="module" src="https://script.js"></script>
```

```html
<link rel="stylesheet" href="https://styles.css" />
```

```html
<style></style>
```

## Further reading

- [Google HTML/CSS Style Guide - type Attributes](https://google.github.io/styleguide/htmlcssguide.html#type_Attributes)
