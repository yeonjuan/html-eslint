# Getting Started

## Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Flat config](#flat-config)
  - [eslintrc config (.eslintrc.\*)](#eslintrc-config-eslintrc)
  - [Using ESLint Language](#using-eslint-language)
- [Lint HTML in JavaScript Template Literal](#lint-html-in-javascript-template-literals)
- [Editor Configuration](#editor-configuration)

## Prerequisites

- Node.js: `^12.22.0 || ^14.17.0 || >=16.0.0`.
- ESLint: `>=6`.

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

Update your configuration file:

```js,eslint.config.js
import { defineConfig } from "eslint/config";
import html from "@html-eslint/eslint-plugin";

export default defineConfig([
    // lint html files
    {
        files: ["**/*.html"],
        plugins: {
            html,
        },
        // When using the recommended rules
        extends: ["html/recommended"],
        language: "html/html",
        rules: {
            "html/no-duplicate-class": "error",
        }
    }
]);
```

## Lint HTML code inside JavaScript Template Literals

In addition to standalone HTML files, html-eslint also supports linting HTML inside JavaScript and TypeScript template literals, such as:

```js
html`<div class="box">${content}</div>`;
// or
const code = /* html */ `<img class="image" src=${src}/>`;
```

To enable this, you don’t need to set a language. Just apply html-eslint rules to your JavaScript or TypeScript files, and the plugin will detect and lint HTML within template literals.

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

## Legacy Configuratuion

If you are using ESLint version 8 or below, you can configure it as follows.

```js,eslintrc.js
module.exports = {
  //...
  plugins: ["@html-eslint"],
  overrides: [
    {
      files: ["*.html"],
      parser: "@html-eslint/parser",
      extends: ["plugin:@html-eslint/recommended-legacy"],
    },
  ],
};
```

## Editor Configuration

### VSCode

To enable [vscode-eslint](https://github.com/microsoft/vscode-eslint) support, add the following to your VSCode settings.

```json,.vscode/settings.json
{
  "eslint.enable": true,
  "eslint.validate": [
    "javascript", // ...
    "html" // Add "html" to enable linting `.html` files.
  ]
}
```
