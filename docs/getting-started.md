---
id: getting-started
title: Getting Started
---

## Installation

```
$ npm install --save-dev eslint @html-eslint/parser @html-eslint/eslint-plugin
```

- Requires Node.js `>=8.10.0`.
- Requires ESLLint `>=6`.

## Configuration

Populate it with the following on your `.eslintrc.js`. If it does not exist create a `.eslintrc.js` config file in the root of your project.

We can apply these [plugin rules](#Rules) to only HTML files(`*.html`) by using `overrides` in `.eslintrc.js`. (see [ESLint Configuration](https://eslint.org/docs/user-guide/configuring#configuration-based-on-glob-patterns))

```js
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

## Editor Configuration

### VSCode

To get [vscode-eslint](https://github.com/microsoft/vscode-eslint) support, we need to add the following in vscode settings.

- `.vscode/settings.json`:

```json5
{
  "eslint.enable": true,
  "eslint.validate": [
    "javascript", // ...
    "html", // Add "html" to enable linting `.html` files.
  ],
}
```

## Recommended Configs

This plugin provides `plugin:@html-eslint/recommended`. The recommended configuration contains the rules marked ⭐ in [Rules](#Rules).
