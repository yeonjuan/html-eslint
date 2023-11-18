---
id: lowercase
title: "lowercase"
---

# lowercase

Enforce to use lowercase for tag and attribute names.

## How to use

.eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/lowercase": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

<!-- prettier-ignore -->
```html
<Div></Div>
```

<!-- prettier-ignore -->
```html
<div ID="foo"></div>
```

<!-- prettier-ignore -->
```html
<SCRIPT></SCRIPT>
```

<!-- prettier-ignore -->
```html
<sTyle></sTyle>
```

Examples of **correct** code for this rule:

```html
<div></div>
```

```html
<div id="foo"></div>
```

```html
<script></script>
```

```html
<style></style>
```
