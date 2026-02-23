---
title: no-empty-headings
description: >-
  Disallow empty or inaccessible heading elements for better document structure
  and accessibility.
---

# no-empty-headings

This rule enforces that all heading elements (h1–h6) and elements with `role="heading"` must have accessible text content.

### Why?

Headings relay the structure of a webpage and provide a meaningful, hierarchical order of its content. If headings are empty or their text contents are inaccessible, this could confuse users or prevent them from accessing sections of interest, especially for those using assistive technology.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-empty-headings": "error",
  },
};
```

## Rule Details

Headings that are empty or whose text is only present in elements with `aria-hidden="true"` are not allowed, as this can confuse users or prevent them from accessing sections of interest.

### ❌ Incorrect

```html
<h1></h1>
<div role="heading" aria-level="1"></div>
<h2><span aria-hidden="true">Inaccessible text</span></h2>
```

### ✅ Correct

```html
<h1>Heading Content</h1>
<h2><span>Text</span></h2>
<div role="heading" aria-level="1">Heading Content</div>
<h3 aria-hidden="true">Heading Content</h3>
<h4 hidden>Heading Content</h4>
```

### Resources

- [ember-template-lint: no-empty-headings](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-empty-headings.md)
