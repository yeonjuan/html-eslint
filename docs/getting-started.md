---
title: Getting Started
description: Learn how to install and configure HTML ESLint to lint HTML files and HTML in JavaScript template literals with ESLint.
---

# Getting Started

## Contents

- [Installation](#installation)
- [Configuration](#configuration)
  - [ESLint v10](#eslint-v10)
  - [ESLint v9](#eslint-v9)
  - [ESLint v8 (Legacy)](#eslint-v8-legacy)
- [Lint HTML in JavaScript Template Literals](#lint-html-code-inside-javascript-template-literals)
- [Editor Configuration](#editor-configuration)

## Installation

- npm

```console,Terminal
npm install --save-dev eslint @html-eslint/parser @html-eslint/eslint-plugin
```

- yarn

```console,Terminal
yarn add -D eslint @html-eslint/parser @html-eslint/eslint-plugin
```

## Configuration

### ESLint v10

If you are using ESLint v10, update your configuration file:

```js,eslint.config.js
import { defineConfig } from "eslint/config";
import html from "@html-eslint/eslint-plugin";

export default defineConfig([
    {
        files: ["**/*.html"],
        plugins: {
            html,
        },
        // When using the recommended rules (or "html/all" for all rules)
        extends: ["html/recommended"],
        language: "html/html",
        rules: {
            "html/no-duplicate-class": "error",
        }
    }
]);
```

### ESLint v9

If you are using ESLint v9 (flat config), update your configuration file:

```js,eslint.config.js
import html from "@html-eslint/eslint-plugin";

export default [
    {
        files: ["**/*.html"],
        ...html.configs["flat/recommended"],
    },
    {
        files: ["**/*.html"],
        rules: {
            "@html-eslint/no-duplicate-class": "error",
        },
    },
];
```

### ESLint v8 (Legacy)

If you are using ESLint v8 or earlier with legacy configuration:

```js,.eslintrc.js
module.exports = {
    overrides: [
        {
            files: ["**/*.html"],
            parser: '@html-eslint/parser',
            extends: ["plugin:@html-eslint/recommended-legacy"],
            plugins: [
                '@html-eslint'
            ],
            rules: {
                '@html-eslint/no-duplicate-class': "error"
            }
        },
    ],
}
```

## Lint HTML code inside JavaScript Template Literals

In addition to standalone HTML files, html-eslint also supports linting HTML inside JavaScript and TypeScript template literals, such as:

```js
html`<div class="box">${content}</div>`;
// or
const code = /* html */ `<img class="image" src=${src}/>`;
```

To enable this, you don't need to set a language. Just apply html-eslint rules to your JavaScript or TypeScript files, and the plugin will detect and lint HTML within template literals.

**ESLint v10/v9:**

```js,eslint.config.js
import { defineConfig } from "eslint/config";
import html from "@html-eslint/eslint-plugin";

export default defineConfig([
    {
        files: ["**/*.js", "**/*.ts"],
        plugins: {
            html,
        },
        rules: {
            "html/require-img-alt": "error",
        },
    },
]);
```

**ESLint v8 (Legacy):**

```js,.eslintrc.js
module.exports = {
  plugins: ["@html-eslint"],
  overrides: [
    {
      files: ["*.js", "*.ts"],
      extends: ["plugin:@html-eslint/recommended-legacy"],
      rules: {
        "@html-eslint/require-img-alt": "error",
      },
    },
  ],
};
```

## Editor Configuration

### VSCode

To enable [vscode-eslint](https://github.com/microsoft/vscode-eslint) support in VSCode, add the following to your VSCode settings.

```json,.vscode/settings.json
{
  "eslint.enable": true,
  "eslint.validate": [
    "javascript", // ...
    "html" // Add "html" to enable linting `.html` files.
  ]
}
```
