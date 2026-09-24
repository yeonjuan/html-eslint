---
title: angular-template/require-li-container
description: Require li elements to be inside ul, ol, or menu elements in Angular templates.
---

# require-li-container

This rule enforces that `<li>` elements must be children of `<ul>`, `<ol>` or `<menu>`.

## How to use

```js
// eslint.config.js (flat config)
import angularTemplate from "@html-eslint/eslint-plugin-angular-template";
import templateParser from "@angular-eslint/template-parser";

export default [
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: templateParser,
    },
    plugins: {
      "@html-eslint/angular-template": angularTemplate,
    },
    rules: {
      "@html-eslint/angular-template/require-li-container": "error",
    },
  },
];
```

## Rule Details

The `<li>` tag should be contained in a parent element: `<ol>`, `<ul>` or `<menu>`.

**Note**: A `<li>` nested inside a custom element (names containing `-`, including Angular components/directives and built-ins like `<ng-container>`/`<ng-template>`), or with no enclosing element at all (e.g. a template meant to be projected into a list via `<ng-content>`), is allowed since the actual rendered container can't be statically verified.

## Examples

Examples of **incorrect** code for this rule:

```html,incorrect
<div>
  <li>item 1</li>
  <li>item 2</li>
</div>
```

Examples of **correct** code for this rule:

```html,correct
<ul>
  <li>item 1</li>
  <li>item 2</li>
</ul>

<ol>
  @for (item of items; track item.id) {
    <li [textContent]="item.name"></li>
  }
</ol>

<app-custom-list>
  <li>item</li>
</app-custom-list>
```

## Further Reading

- [MDN - li](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li)
