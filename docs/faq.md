---
title: FAQs
description: Frequently asked questions about HTML ESLint including solutions for typescript-eslint typed linting compatibility issues.
---

# FAQs

## Problem when using typescript-eslint typed linting.

```
Error: Error while loading rule '@typescript-eslint/await-thenable': You have used a rule which requires type information, but don't have parserOptions set to generate type information for this file....
Parser: @html-eslint/parser
```

When using [typescript-eslint Typed-Linting](https://typescript-eslint.io/troubleshooting/typed-linting), the above error may occur for HTML files. In this case, disable typed-linting rules for HTML.

```js
export default tseslint.config(
  //...,
  {
    files: ["**/*.html"],
    extends: [tseslint.configs.disableTypeChecked],
  }
  // ...
);
```
