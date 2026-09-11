---
title: angular-template/require-attrs
description: Require specified attributes on elements in Angular templates.
---

# require-attrs

This rule enforces the use of elements with specified attributes in Angular templates.

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
      "@html-eslint/angular-template/require-attrs": [
        "error",
        { tag: "img", attr: "alt" },
      ],
    },
  },
];
```

## Rule Details

This rule requires specified attributes to be present on matching elements. Custom elements (names containing `-`) are ignored. Angular property bindings (e.g., `[attr]="expr"`) are treated as satisfying the presence check.

**Note**: Auto-fix is not supported for Angular templates.

### Options

This rule takes an array of option objects:

- `tag` (`string`, **required**): the HTML tag name to check.
- `attr` (`string`, **required**): the attribute name that must be present.
- `value` (`string`, _optional_): if specified, the attribute must have this exact value.
- `message` (`string`, _optional_): custom error message.
- `conditions` (`array`, _optional_): conditions that must all be true before the attribute is enforced.

Examples of **incorrect** code for this rule:

```html,incorrect
<img />
<svg></svg>
```

Examples of **correct** code for this rule:

```html,correct
<img alt="" />
<svg viewBox="0 0 100 100"></svg>
```
