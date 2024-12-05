# Getting Started

## Contents

- [Prerequisite](#prerequisite)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Flat config](#flat-config)
  - [eslintrc config (.eslintrc.\*)](#eslintrc-config-eslintrc)
- [Lint HTML in JavaScript Template Literal](#lint-html-in-javascript-template-literals)
- [Editor Configuration](#editor-configuration)

## Prerequisite

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

### Flat config

If you are using the ESLint [Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), see examples below.

#### Minimal configuration

```js,eslint.config.js
import html from "@html-eslint/eslint-plugin";

export default [
  // your own configurations.
  {
    // recommended configuration included in the plugin
    ...html.configs["flat/recommended"],
    files: ["**/*.html"],
  },
];
```

or if using `require(..);`

```js,eslint.config.js
const html = require("@html-eslint/eslint-plugin");

module.exports = [
  // your own configurations.
  {
    // recommended configuration included in the plugin
    ... html.configs["flat/recommended"],
    files: ["**/*.html"],
  },
];
```

#### Recommended rules with some customization

```js,eslint.config.js
import html from "@html-eslint/eslint-plugin";

export default [
  // your own configurations.
  {
    // recommended configuration included in the plugin
    ...html.configs["flat/recommended"],
    files: ["**/*.html"],
    rules: {
      ...html.configs["flat/recommended"].rules, // Must be defined. If not, all recommended rules will be lost
      "@html-eslint/indent": "error",
    },
  },
];
```

or if using `require(..);`

```js,eslint.config.js
const html = require("@html-eslint/eslint-plugin");

module.exports = [
  // your own configurations.
  {
    // recommended configuration included in the plugin
    ...html.configs["flat/recommended"],
    files: ["**/*.html"],
    rules: {
      ...html.configs["flat/recommended"].rules, // Must be defined. If not, all recommended rules will be lost
      "@html-eslint/indent": "error",
    },
  },
];
```

#### Explicit plugin and parser configuration

```js,eslint.config.js
import html from "@html-eslint/eslint-plugin";
import htmlParser from "@html-eslint/parser";

export default [
  // your own configurations.
  {
    // recommended configuration included in the plugin
    ...html.configs["flat/recommended"],
    files: ["**/*.html"],
    plugins: {
      "@html-eslint": html,
    },
    languageOptions: {
      parser: htmlParser,
    },
  },
];
```

or if using `require(..);`

```js,eslint.config.js
const html = require("@html-eslint/eslint-plugin");
const htmlParser = require("@html-eslint/parser");

module.exports = [
  // your own configurations.
  {
    // recommended configuration included in the plugin
    ...html.configs["flat/recommended"],
    files: ["**/*.html"],
    plugins: {
      "@html-eslint": html,
    },
    languageOptions: {
      parser: htmlParser,
    },
  },
];
```

### eslintrc config (.eslintrc.\*)

Populate it with the following on your `.eslintrc.js`. If it does not exist create a `.eslintrc.js` config file in the root of your project.
We can apply [HTML-ESLint plugin rules](rules) to only HTML files(`*.html`) by using `overrides` in `.eslintrc.js`. (see [ESLint Configuration](https://eslint.org/docs/user-guide/configuring#configuration-based-on-glob-patterns))

```js,.eslintrc.js
module.exports = {
  //...
  plugins: ["@html-eslint"],
  overrides: [
    {
      files: ["*.html"],
      parser: "@html-eslint/parser",
      extends: ["plugin:@html-eslint/recommended"],
    },
  ],
};
```

## Lint HTML in JavaScript Template Literals

This plugin provides the ability to lint not only HTML files, but also HTML written in [JavaScript Template Literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).
You can set the [@html-eslint rules](./rules.md) in your settings to lint JavaScript code without any additional configuration.

```js,eslint.config.js
import eslintHTML from "@html-eslint/eslint-plugin";
export default [
  // You can use the @html-eslint rules in your ESLint configuration for JS!
  // This is used to lint HTML written inside Template Literal.
  "plugins": {
    "@html-eslint": eslintHTML
  },
  "rules": {
    // Specifies the @html-eslint rules to apply to Template Literal.
    "@html-eslint/no-inline-styles": 1,
    "@html-eslint/indent": 1,
  }
];
```

Not all Template literals are recognized as HTML.
There are two ways to get the plugin to recognize them as HTML.

```js
// 1. Tagged Templates with a function named `html`
html` <div style="${style}"></div>`;

// 2. Template Literal after a html comment (/* html */)
const code = /* html */ `<div style="${style}"></div>`;
```

If you want to specify that linting should be done with keywords other than `html`, you can change the settings option.

```js
 {
    "plugins": {
      "@html-eslint": eslintHTML
    },
    settings: {
        html: {
          templateLiterals: {
               // default options
               tags: ["^html$"],
               comments: ["^\\s*html\\s*$"],
          }
        }
    },
}
```

## Editor Configuration

### VSCode

To get [vscode-eslint](https://github.com/microsoft/vscode-eslint) support, we need to add the following in vscode settings.

```json,.vscode/settings.json
{
  "eslint.enable": true,
  "eslint.validate": [
    "javascript", // ...
    "html" // Add "html" to enable linting `.html` files.
  ]
}
```
