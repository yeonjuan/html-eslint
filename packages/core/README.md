# @html-eslint/core

Core HTML validation logic for html-eslint.

## Overview

This package contains the core HTML validation logic that can be reused across different framework-specific ESLint plugins (React, Vue, Angular, Svelte, etc.).

## Purpose

The `@html-eslint/core` package provides:

- Shared HTML validation utilities
- Common rule logic for HTML standards compliance
- Attribute and element validation
- Reusable validation functions for framework adapters

## Installation

```bash
npm install @html-eslint/core
```

## Usage

This package is primarily used as a dependency by framework-specific adapters like `@html-eslint/svelte`, `@html-eslint/react`, etc.

```javascript
const { validateAttribute } = require("@html-eslint/core");

// Use core validation logic in framework-specific rules
```

## Architecture

The core package separates HTML validation logic from framework-specific parsing and integration, allowing for consistent HTML linting across different frameworks.

## License

MIT
