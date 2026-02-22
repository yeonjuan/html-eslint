# @html-eslint/integration-test

Internal integration testing package for HTML ESLint.

This is a **private package** used to verify that HTML ESLint plugins and parsers work correctly across different ESLint versions.

## Directory Structure

```
integration-test/
├── fixtures/           # Test fixtures for different ESLint configurations
│   ├── eslint-v8-legacy-config/    # ESLint 8 with .eslintrc.js format
│   ├── eslint-v9-flat-config/      # ESLint 9 with flat config format
│   ├── eslint-v9-language/         # ESLint 9 language API testing
│   ├── eslint-v10-flat-config/     # ESLint 10 flat config testing
│   ├── typescript/                 # TypeScript config type checking
│   └── react/                      # React plugin integration testing
├── lib/                # Test utilities
│   └── test-utils.js   # Helper functions for running ESLint and type checks
└── tests/              # Integration test suites
    └── integration.test.js
```

## Running Tests

```bash
yarn test:integration
```

## Notes

- This package uses **file: protocol** to reference local monorepo packages, ensuring tests use the current workspace code
- Tests are isolated in temporary directories to prevent cross-contamination
- The package is **excluded from publishing** (marked as `private: true`)
