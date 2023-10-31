# Getting Started

## Prerequisite

- Node.js: `^12.22.0 || ^14.17.0 || >=16.0.0`.
- ESLint: `>=6`.

## Installation

- npm

```console
npm install --save-dev eslint @html-eslint/parser @html-eslint/eslint-plugin
```

- yarn

```console
yarn add -D eslint @html-eslint/parser @html-eslint/eslint-plugin
```

## Configuration

Populate it with the following on your `.eslintrc.js`. If it does not exist create a `.eslintrc.js` config file in the root of your project.
We can apply [HTML-ESLint plugin rules](rules) to only HTML files(`*.html`) by using `overrides` in `.eslintrc.js`. (see [ESLint Configuration](https://eslint.org/docs/user-guide/configuring#configuration-based-on-glob-patterns))

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

```json
{
  "eslint.enable": true,
  "eslint.validate": [
    "javascript", // ...
    "html" // Add "html" to enable linting `.html` files.
  ]
}
```
