# Project Overview

html-eslint is a monorepo that provides ESLint plugins offering linting rules for HTML and HTML-related syntaxes.

It supports multiple use cases, including:

- Standalone `.html` files
- HTML inside JavaScript template literals (e.g., `Lit`)
- React (JSX)
- Angular template
- Svelte

## Rules

- All documentation, code, and comments must be written in English.
- When adding a new rule, always use `yarn new-rule <plugin-type> <rule-name>` to generate the scaffolding first. Never create rule files manually.
- When a new rule is added or a rule's options are added, removed, or changed, the corresponding documentation in `docs/` must also be updated. Never modify rule code without updating the docs.
- Always run `yarn run format` after completing any code/doc modification.
- Always run `yarn check:spell` after completing any code modification. If an error occurs:
  - If the flagged word is not a typo but a valid term, add it to the `words` array in `.cspell.json`.
  - If spell-checking the entire file is meaningless (e.g., generated files, fixtures), add the file path to the `ignorePaths` array in `.cspell.json`.

## Commands

- `yarn test`: Run all unit tests.
- `yarn test:legacy`: Run all unit tests with legacy ESLint config.
- `yarn test:integration`: Run integration tests.
- `yarn build`: Build all packages.
- `yarn lint`: Lint all packages.
- `yarn format`: Format code with Prettier.
- `yarn check:format`: Check formatting without modifying
- `yarn check:ts`: TypeScript type checking
- `yarn check`: Run all checks (test, format, spell, ts)
- `yarn new-rule <plugin-type> <rule-name>`: Generate scaffolding for a new rule. `plugin-type` must be `html` (for `packages/eslint-plugin`) or `react` (for `packages/eslint-plugin-react`).

## Architecture

### Packages

**eslint plugin packages**

- `@html-eslint/eslint-plugin` (packages/eslint-plugin): ESLint plugin providing linting rules for `.html` files.
- `@html-eslint/eslint-plugin-react` (packages/eslint-plugin-react): ESLint plugin providing HTML linting rules for React JSX.
- `@html-eslint/eslint-plugin-svelte` (packages/eslint-plugin-svelte): ESLint plugin providing HTML linting rules for Svelte components.
- `@html-eslint/eslint-plugin-angular-template` (packages/eslint-plugin-angular-template): ESLint plugin providing HTML linting rules for Angular templates.

**core packages**

- `@html-eslint/core` (packages/core): Core validation logic and rule execution engine shared across eslint-plugins.
- `@html-eslint/parser` (packages/parser): Parses `.html` files into an ESLint-compatible AST using `es-html-parser`.
- `@html-eslint/template-parser` (packages/template-parser): Parses HTML template literals embedded in JS/TS files (e.g., Lit).
- `@html-eslint/template-syntax-parser` (packages/template-syntax-parser): Parses template engine syntax (Handlebar, ERB, TWIG) to extract HTML portions.
- `@html-eslint/types` (packages/types): Shared TypeScript type definitions used across some packages.

**etc**

- `packages/website`: Documentation site with an interactive playground, built with Parcel, HTML, JavaScript and Tailwind CSS.
- `packages/web-linter`: Browserified bundle of the plugin for use in web-based linting environments.
- `packages/integration-test`: Integration tests across all supported environments.
- `./tools`: Internal development scripts.
  - `add-new-rule.js`: Scaffolding generator invoked by `yarn new-rule` to create rule, test, and doc files from templates.
  - `base-line/generate-baseline.mjs`: Generates web standards baseline data used by the website.
  - `templates/`: Template files (`rule.js`, `rule.test.js`, `rule.md`) used by `add-new-rule.js` when scaffolding a new rule.

## Documentation

The `docs/` directory contains the source documentation written in Markdown. When `yarn build` is run, `packages/website` converts these files into HTML for the documentation site.

Each subdirectory maps to a specific plugin:

- `docs/` — Rules and guides for `@html-eslint/eslint-plugin`
- `docs/react/` — Rules and guides for `@html-eslint/eslint-plugin-react`
- `docs/angular-template/` — Rules and guides for `@html-eslint/eslint-plugin-angular-template`
- `docs/svelte/` — Rules and guides for `@html-eslint/eslint-plugin-svelte`
