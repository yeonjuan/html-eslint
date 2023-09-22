---
id: require-frame-title
title: "require-frame-title"
---

# require-frame-title

Require `title` attribute in `<frame>` and `<iframe>`

## How to use

.eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/require-frame-title": "error",
  },
};
```

## Rule Details

This rule enforces use of `title` attribute in `<frame>` and `<iframe>`.

Examples of **incorrect** code for this rule:

```html
<iframe src="..."></iframe> <iframe src="..." title=""></iframe>
```

Examples of **correct** code for this rule:

```html
<iframe src="..." title="frame title"></iframe>
```
