# @html-eslint/svelte

HTML ESLint plugin for Svelte components.

## Overview

This package provides HTML linting rules for Svelte components, leveraging the core validation logic from `@html-eslint/core`.

## Features

- HTML standards validation in Svelte components
- Accessibility checks
- SEO optimization rules
- Best practices enforcement
- Compatible with existing eslint-plugin-svelte

## Installation

```bash
npm install --save-dev @html-eslint/svelte eslint
```

## Usage

Add `@html-eslint/svelte` to your ESLint configuration:

```javascript
// eslint.config.js
import htmlSvelte from "@html-eslint/svelte";

export default [
  {
    plugins: {
      "@html-eslint/svelte": htmlSvelte,
    },
    rules: {
      "@html-eslint/svelte/no-invalid-attr-value": "error",
      "@html-eslint/svelte/no-obsolete-tags": "error",
      "@html-eslint/svelte/require-meta-viewport": "warn",
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

Works alongside `eslint-plugin-svelte` to provide comprehensive linting for Svelte projects.

## License

MIT
