# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HTML ESLint is a monorepo containing an ESLint plugin ecosystem for linting HTML and HTML-in-template-literals, including React-specific HTML linting. The project is built with TypeScript and uses Yarn workspaces, Lerna for publishing, and Turbo for build orchestration.

## Commands

### Testing

```bash
yarn test                    # Run all tests with Turbo
yarn test:legacy             # Test with legacy ESLint config (sets TEST_ESLINT_LEGACY_CONFIG=true)
yarn test:integration        # Run integration tests
NODE_OPTIONS=--experimental-vm-modules yarn run test:legacy  # Common test command pattern
```

### Building

```bash
yarn build                   # Build all packages with Turbo
yarn build                   # In individual packages: builds that package
```

### Code Quality

```bash
yarn lint                    # Lint all packages
yarn format                  # Format code with Prettier
yarn check:format            # Check formatting without modifying
yarn check:spell             # Run cspell on source files
yarn check:ts                # TypeScript type checking
yarn check                   # Run all checks (test, format, spell, ts)
```

### Development

```bash
yarn dev                     # Run development mode (for website package)
yarn new-rule <rule-name>    # Generate scaffolding for a new rule
yarn baseline                # Generate web standards baseline
```

### Publishing

```bash
yarn publish                 # Publish packages with lerna
yarn publish:alpha           # Publish alpha version
yarn publish:website         # Deploy website to Firebase
```

## Architecture

### Monorepo Structure

The project consists of 11 packages organized by functionality:

**Core Packages:**

- `@html-eslint/parser` - Parses HTML to ESLint-compatible AST using es-html-parser
- `@html-eslint/core` - Core validation logic and rule execution engine (built with tsup)
- `@html-eslint/types` - Shared TypeScript type definitions
- `@html-eslint/eslint-plugin` - Main plugin with 50+ linting rules
- `@html-eslint/eslint-plugin-react` - React-specific HTML linting rules

**Template Support:**

- `@html-eslint/template-parser` - Parses HTML template literals in JS/TS files
- `@html-eslint/template-syntax-parser` - Parses template engine syntax (Vue, Svelte, etc.)

**Tooling:**

- `@html-eslint/cli` - Command-line interface
- `@html-eslint/web-linter` - Browserified bundle for web-based linting (Rollup)
- `@html-eslint/website` - Documentation site with interactive playground (Parcel + Tailwind CSS)
- `@html-eslint/integration-test` - End-to-end integration tests

### Dependency Flow

```
eslint-plugin → parser → es-html-parser (external)
              → core → types
              → template-parser → template-syntax-parser
              → eslint-plugin-react

website → web-linter → (bundled version of plugin)
cli → eslint-plugin
```

### AST Parsing

The project uses [es-html-parser](https://github.com/yeonjuan/es-html-parser) to generate AST nodes. You can debug ASTs at https://yeonjuan.github.io/es-html-parser/

The parser also integrates CSS parsing via `css-tree` and `@eslint/css-tree` for CSS-specific linting.

### Rule System

Rules are located in `packages/eslint-plugin/lib/rules/` (70+ rule files). Each rule:

- Exports a rule object with `meta` (metadata) and `create` (visitor pattern implementation)
- Has a corresponding test file in `packages/eslint-plugin/tests/rules/`
- Has documentation in `docs/rules/`
- Is registered in `packages/eslint-plugin/lib/rules/index.js`

Rules are organized into configs in `packages/eslint-plugin/lib/configs/`:

- `recommended.js` - Recommended ruleset
- `all.js` - All available rules

**IMPORTANT - Documentation Updates:**

- When adding a new rule or option to `packages/eslint-plugin`, the corresponding documentation in `docs/rules/` must be added or updated
- When adding a new rule or option to `packages/eslint-plugin-react`, the corresponding documentation in `docs/react/rules/` must be added or updated

### Build System

**Turbo Tasks:**

- `build` - Depends on `^build` (dependencies first)
- `test` - Depends on `^build`
- `test:legacy` - Depends on `^build`
- `test:integration` - Depends on `@html-eslint/eslint-plugin#build`
- `dev` - Depends on `^dev` and `^build`
- `ts` - TypeScript type checking, depends on `^build`

**Package-Specific Build Tools:**

- `@html-eslint/core` - Uses tsup for dual CJS/ESM builds
- `@html-eslint/eslint-plugin` - Uses tsc to generate types
- `@html-eslint/parser` - Uses tsc to generate types
- `@html-eslint/web-linter` - Uses Rollup for browser bundling
- `@html-eslint/website` - Uses Parcel for bundling

## Adding a New Rule

1. Run `yarn new-rule <rule-name>` (rule name must be lowercase with hyphens)
   - Creates `packages/eslint-plugin/lib/rules/<rule-name>.js`
   - Creates `packages/eslint-plugin/tests/rules/<rule-name>.test.js`
   - Creates `docs/rules/<rule-name>.md`
   - Updates `packages/eslint-plugin/lib/rules/index.js` with imports and exports

2. Implement the rule using the visitor pattern to traverse HTML AST nodes

3. Add test cases covering valid and invalid scenarios

4. Run `yarn build` to sync documentation to the website

5. Create a pull request following the [developer guide](https://html-eslint.org/developer-guide.md)

## Testing Patterns

### Running Single Tests

```bash
# In a specific package directory
yarn test <test-file-name>

# For eslint-plugin rules
cd packages/eslint-plugin
yarn test rules/<rule-name>.test.js
```

### Test Structure

Tests use Jest with coverage reporting. Rule tests follow this pattern:

- Import `RuleTester` from ESLint
- Define valid test cases (code that should pass)
- Define invalid test cases (code that should fail with expected errors)

## Key Technical Details

### ESLint Compatibility

- Supports ESLint 8.x, 9.x (Flat Config), and 10.x (pre-release)
- Uses `@eslint/plugin-kit` for plugin utilities
- Supports both legacy and flat config formats (tested separately)

### Node.js Requirements

- Requires Node.js ^18.18.0 || ^20.9.0 || >=21.1.0
- Uses Yarn 4.9.1 (packageManager in root package.json)

### TypeScript Configuration

- Base config in `tsconfig.base.json` (ES2022, strict mode)
- Individual packages extend the base config
- Type checking runs via `turbo run ts`

### Code Style

- Prettier with prettier-plugin-jsdoc for formatting
- ESLint Flat Config (eslint.config.js) with plugins:
  - eslint-plugin-jest
  - eslint-plugin-n
  - @stylistic/eslint-plugin
- Pre-commit hooks via Husky

### React Plugin Specifics

The `@html-eslint/eslint-plugin-react` package provides React-specific rules. When working on React rules, ensure they only apply to React/JSX contexts and don't conflict with the main HTML plugin.

## Website Development

The documentation website (`packages/website`) includes:

- Interactive playground using CodeMirror for live HTML linting
- Auto-generated rule documentation
- Built with Parcel, styled with Tailwind CSS
- Uses PostHTML for templating (extend, include, modules)
- Deployed to Firebase

To work on the website:

```bash
cd packages/website
yarn dev  # Starts development server
```

## Important Files

- `tools/add-new-rule.js` - Scaffolding generator for new rules
- `tools/base-line/generate-baseline.mjs` - Web standards baseline generator
- `turbo.json` - Build pipeline configuration
- `lerna.json` - Publishing configuration
- `tsconfig.base.json` - Base TypeScript configuration
- `.cspell.json` - Spell checker configuration
