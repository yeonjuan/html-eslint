---
title: use-baseline
description: Enforce baseline browser-compatible features in React/JSX components.
---

# use-baseline

This rule enforces the use of baseline features in React/JSX.

## What is Baseline?

[Baseline](https://web-platform-dx.github.io/web-features/) is an effort by the [W3C WebDX Community Group](https://www.w3.org/community/webdx/) that provides clear information about which web platform features work across [core browser set](https://web-platform-dx.github.io/web-features/#how-do-features-become-part-of-baseline%3F) today.

Baseline features are available across popular browsers. Baseline has two stages:

- **Newly available**: The feature works across the latest devices and browser versions. The feature might not work in older devices or browsers.
- **Widely available**: The feature is well established and works across many devices and browser versions. It's been available across browsers for at least 2½ years (30 months).

Prior to being newly available, a feature has **Limited availability** when it's not yet available across all browsers.

## How to use

```js
// eslint.config.js (flat config)
import htmlReact from "@html-eslint/eslint-plugin-react";

export default [
  {
    files: ["**/*.jsx", "**/*.tsx"],
    plugins: {
      "@html-eslint/react": htmlReact,
    },
    rules: {
      "@html-eslint/react/use-baseline": "error",
    },
  },
];
```

## Rule Details

This rule warns when it finds any of the following in JSX elements:

- An element that isn't widely available.
- An attribute that isn't widely available.
- An attribute value that isn't widely available.

The data is provided via the [web-features](https://www.npmjs.com/package/web-features) package.

**Note**: This rule only checks lowercase HTML elements (e.g., `<div>`, `<input>`). PascalCase React components (e.g., `<MyComponent>`) and custom elements with hyphens (e.g., `<my-element>`) are ignored.

### Options

This rule has an object option:

```ts
"@html-eslint/react/use-baseline": ["error", {
  "available": "newly" | "widely" | number; // default: "widely"
}]
```

#### available: "widely"

If `"widely"` is used as an option, this rule allows features that are at the Baseline widely available stage: features that have been available across browsers for at least 30 months.

#### available: "newly"

If `"newly"` is used as an option, this rule allows features that are at the Baseline newly available stage: features that have been supported on all core browsers for less than 30 months.

#### available: number

If an integer `number` is used as an option, this rule allows features that became Baseline newly available that year, or earlier. (minimum: 2000)

## Further Reading

- [W3C WebDX Community Group - Baseline](https://web-platform-dx.github.io/web-features/)
- [web.dev - Baseline](https://web.dev/baseline)
- [Chrome Developers Blog - Baseline features availability in developer tools](https://developer.chrome.com/blog/web-at-io25#7_baseline_features_availability_is_now_in_your_familiar_tools_vs_code_eslint_and_more)
- [eslint-plugin-baseline-js](https://github.com/3ru/eslint-plugin-baseline-js)
