---
title: no-duplicate-class
description: Disallow duplicate class names in class attributes in Angular templates.
---

# no-duplicate-class

This rule disallows duplicate class names in `class` attributes in Angular template files.

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
      "@html-eslint/angular-template/no-duplicate-class": "error",
    },
  },
];
```

## Rule Details

This rule enforces unique class names in static `class` attribute values.

**Note**: Dynamic class bindings are ignored:
- `[class]="expr"` — property binding, value is an expression
- `[class.active]="isActive"` — class binding, value is an expression

This rule is auto-fixable using the `--fix` option.

## Examples

Examples of **incorrect** code for this rule:

```html
<!-- Duplicate class names -->
<div class="foo foo"></div>
<span class="foo bar foo"></span>

<!-- Inside Angular control flow — elements are still checked -->
@if (show) {
  <div class="foo foo"></div>
}

@for (item of items; track item.id) {
  <li class="item item"></li>
}
```

Examples of **correct** code for this rule:

```html
<!-- Unique class names -->
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
  <li class="item">{{ item.name }}</li>
}
```

## When Not To Use It

If you don't care about duplicate class names in Angular templates, you can disable this rule.

## Further Reading

- [Angular Template Syntax](https://angular.dev/guide/templates)
- [Angular Class Binding](https://angular.dev/guide/templates/class-binding)
