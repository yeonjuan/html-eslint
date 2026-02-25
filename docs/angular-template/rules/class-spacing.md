---
title: class-spacing
description: Disallow extra spacing in class attribute values in Angular templates.
---

# class-spacing

This rule disallows extra whitespace in `class` attribute values in Angular template files.

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
      "@html-eslint/angular-template/class-spacing": "error",
    },
  },
];
```

## Rule Details

This rule enforces that static `class` attribute values have no leading spaces, no trailing spaces, and no consecutive spaces between class names.

**Note**: Dynamic class bindings are ignored:
- `[class]="expr"` — property binding, value is an expression
- `[class.active]="isActive"` — class binding, value is an expression

This rule is auto-fixable using the `--fix` option.

## Examples

Examples of **incorrect** code for this rule:

```html
<!-- Leading space -->
<div class=" foo"></div>

<!-- Trailing space -->
<div class="foo "></div>

<!-- Extra space between class names -->
<div class="foo  bar"></div>

<!-- Inside Angular control flow — elements are still checked -->
@if (show) {
  <div class=" foo bar"></div>
}

@for (item of items; track item.id) {
  <li class="item  item2"></li>
}
```

Examples of **correct** code for this rule:

```html
<!-- Properly spaced class names -->
<div class="foo"></div>
<div class="foo bar"></div>
<span class="foo bar baz"></span>

<!-- Dynamic binding — skipped -->
<div [class]="classExpr"></div>
<div [class.active]="isActive"></div>

<!-- Angular control flow with valid elements -->
@if (show) {
  <div class="foo bar"></div>
}

@for (item of items; track item.id) {
  <li class="item item2"></li>
}
```

## When Not To Use It

If you don't care about extra whitespace in class attribute values, you can disable this rule.

## Further Reading

- [Angular Template Syntax](https://angular.dev/guide/templates)
- [Angular Class Binding](https://angular.dev/guide/templates/class-binding)
