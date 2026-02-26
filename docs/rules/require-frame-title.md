---
title: require-frame-title
description: Require title attribute on frame and iframe elements for accessibility.
---

# require-frame-title

This rule enforces the use of `title` attribute on `<frame>` and `<iframe>`.

## Why?

The `title` attribute provides additional information about the content within the frame or iframe.
This is especially important for users with disabilities who may be using screen readers.
When a screen reader encounters a frame or iframe with a title attribute, it can announce the title to the user, providing context and improving the overall accessibility of the web page.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/require-frame-title": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<iframe src="..."></iframe> <iframe src="..." title=""></iframe>
```

Examples of **correct** code for this rule:

```html,correct
<iframe src="..." title="frame title"></iframe>
```
