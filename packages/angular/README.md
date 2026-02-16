# @html-eslint/angular

HTML ESLint plugin for Angular components.

## Overview

This package provides HTML linting rules for Angular components, leveraging the core validation logic from `@html-eslint/core`.

## Features

- HTML standards validation in Angular components
- Accessibility checks
- SEO optimization rules
- Best practices enforcement
- Compatible with existing @angular-eslint

## Installation

```bash
npm install --save-dev @html-eslint/angular eslint
```

## Usage

Add `@html-eslint/angular` to your ESLint configuration:

```javascript
// eslint.config.js
const htmlAngular = require("@html-eslint/angular");

module.exports = [
  {
    plugins: {
      "@html-eslint/angular": htmlAngular,
    },
    rules: {
      "@html-eslint/angular/no-invalid-attr-value": "error",
      "@html-eslint/angular/no-obsolete-tags": "error",
      "@html-eslint/angular/require-meta-viewport": "warn",
    },
  },
];
```

## Rules

### Available Rules

| Rule                                                         | Description                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------- |
| [no-invalid-attr-value](docs/rules/no-invalid-attr-value.md) | Disallow invalid attribute values according to HTML standards |

More rules coming soon...

## Compatibility

Works alongside `@angular-eslint` to provide comprehensive linting for Angular projects.

## License

MIT
