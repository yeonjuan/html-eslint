# @html-eslint/eslint-plugin-angular

ESLint plugin for HTML with Angular template support.

## Installation

```bash
npm install --save-dev @html-eslint/eslint-plugin-angular @angular-eslint/template-parser
```

## Usage

```js
// eslint.config.js
const angularPlugin = require("@html-eslint/eslint-plugin-angular");
const templateParser = require("@angular-eslint/template-parser");

module.exports = [
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: templateParser,
    },
    plugins: {
      "@html-eslint/angular": angularPlugin,
    },
    rules: {
      "@html-eslint/angular/use-baseline": "warn",
    },
  },
];
```

Or use the recommended config:

```js
// eslint.config.js
const angularPlugin = require("@html-eslint/eslint-plugin-angular");
const templateParser = require("@angular-eslint/template-parser");

module.exports = [
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: templateParser,
    },
    ...angularPlugin.configs.recommended,
  },
];
```

## Rules

| Rule                                                                    | Description                          | Recommended |
| ----------------------------------------------------------------------- | ------------------------------------ | ----------- |
| [use-baseline](https://html-eslint.org/docs/angular/rules/use-baseline) | Enforce the use of baseline features | ✅          |
