---
title: use-baseline
description: Enforce baseline browser-compatible features in Angular template files.
---

# use-baseline

This rule enforces the use of baseline features in Angular templates.

## What is Baseline?

[Baseline](https://web-platform-dx.github.io/web-features/) is an effort by the [W3C WebDX Community Group](https://www.w3.org/community/webdx/) that provides clear information about which web platform features work across [core browser set](https://web-platform-dx.github.io/web-features/#how-do-features-become-part-of-baseline%3F) today.

Baseline features are available across popular browsers. Baseline has two stages:

- **Newly available**: The feature works across the latest devices and browser versions. The feature might not work in older devices or browsers.
- **Widely available**: The feature is well established and works across many devices and browser versions. It's been available across browsers for at least 2½ years (30 months).

Prior to being newly available, a feature has **Limited availability** when it's not yet available across all browsers.

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
      "@html-eslint/angular-template/use-baseline": "warn",
    },
  },
];
```

## Rule Details

This rule warns when it finds any of the following in Angular template elements:

- An element that isn't widely available.
- An attribute that isn't widely available.
- An attribute value that isn't widely available.

The data is provided via the [web-features](https://www.npmjs.com/package/web-features) package.

**Note**: Custom elements containing a hyphen (e.g., `<my-component>`, `<app-header>`) are ignored. Property bindings (`[property]="expr"`) and attribute bindings (`[attr.key]="expr"`) are treated as expressions and their values are not checked.

### Options

This rule has an object option:

```ts
"@html-eslint/angular-template/use-baseline": ["warn", {
  "available": "newly" | "widely" | number; // default: "widely"
}]
```

#### available: "widely"

If `"widely"` is used as an option, this rule allows features that are at the Baseline widely available stage: features that have been available across browsers for at least 30 months.

#### available: "newly"

If `"newly"` is used as an option, this rule allows features that are at the Baseline newly available stage: features that have been supported on all core browsers for less than 30 months.

#### available: number

If an integer `number` is used as an option, this rule allows features that became Baseline newly available that year, or earlier. (minimum: 2000)

## Examples

Examples of **incorrect** code for this rule:

```html
<!-- <slot> is not widely available (added: 2019) -->
<slot></slot>

<!-- 'slot' attribute is not widely available -->
<span slot="header">Header</span>

<!-- Inside Angular control flow — elements are still checked -->
@if (show) {
<slot></slot>
}
```

Examples of **correct** code for this rule:

```html
<!-- Standard HTML elements -->
<div class="container"></div>
<input type="text" />
<button type="button">Click</button>

<!-- Property binding — value is expression, skipped -->
<input [disabled]="isDisabled" />

<!-- Attribute binding — value is expression, skipped -->
<div [attr.aria-label]="label"></div>

<!-- Custom elements are ignored -->
<my-component [title]="title"></my-component>

<!-- Angular control flow with valid elements -->
@if (isLoggedIn) {
<span>Welcome</span>
} @else {
<a href="/login">Login</a>
} @for (item of items; track item.id) {
<li>{{ item.name }}</li>
}
```

## Further Reading

- [W3C WebDX Community Group - Baseline](https://web-platform-dx.github.io/web-features/)
- [web.dev - Baseline](https://web.dev/baseline)
- [eslint-plugin-baseline-js](https://github.com/3ru/eslint-plugin-baseline-js)
