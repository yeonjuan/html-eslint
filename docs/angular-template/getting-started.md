---
title: Getting Started
description: Learn how to install and configure HTML ESLint Angular Template plugin to validate HTML elements and attributes in Angular templates.
---

# Getting Started

`@html-eslint/eslint-plugin-angular-template` is an ESLint plugin that validates HTML elements and attributes directly in Angular template files (`.html`). It extends the core `@html-eslint` functionality to work seamlessly with Angular templates parsed by `@angular-eslint/template-parser`.

## Contents

- [Installation](#installation)
- [Configuration](#configuration)

## Installation

- npm

```console,Terminal
npm install --save-dev eslint @html-eslint/eslint-plugin-angular-template @angular-eslint/template-parser
```

- yarn

```console,Terminal
yarn add -D eslint @html-eslint/eslint-plugin-angular-template @angular-eslint/template-parser
```

## Configuration

Update your ESLint configuration file:

### Manual Configuration

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
      "@html-eslint/angular-template/no-duplicate-class": "error",
    },
  },
];
```

### Using Preset Configurations

The plugin provides two preset configurations:

- `recommended` - Enables all available rules with recommended severity
- `all` - Enables all available rules with error severity

#### Using the Recommended Configuration

```js
// eslint.config.js
import angularTemplate from "@html-eslint/eslint-plugin-angular-template";
import templateParser from "@angular-eslint/template-parser";

export default [
  {
    files: ["**/*.html"],
    plugins: {
      "@html-eslint/angular-template": angularTemplate,
    },
    languageOptions: {
      parser: templateParser,
    },
    rules: angularTemplate.configs.recommended.rules,
  },
];
```

#### Using the All Configuration

```js
// eslint.config.js
import angularTemplate from "@html-eslint/eslint-plugin-angular-template";
import templateParser from "@angular-eslint/template-parser";

export default [
  {
    files: ["**/*.html"],
    plugins: {
      "@html-eslint/angular-template": angularTemplate,
    },
    languageOptions: {
      parser: templateParser,
    },
    rules: angularTemplate.configs.all.rules,
  },
];
```
