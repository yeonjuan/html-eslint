# Getting Started

`@html-eslint/eslint-plugin-react` is an ESLint plugin that validates HTML attribute values and baseline browser compatibility directly in your React/JSX code. It extends the core `@html-eslint` functionality to work seamlessly with React components,

## Contents

- [Installation](#installation)
- [Configuration](#configuration)

## Installation

- npm

```console,Terminal
npm install --save-dev eslint @html-eslint/eslint-plugin-react
```

- yarn

```console,Terminal
yarn add -D eslint @html-eslint/eslint-plugin-react
```

## Configuration

Update your ESLint configuration file:

### Manual Configuration

```js
// eslint.config.js (flat config)
import htmlReact from "@html-eslint/eslint-plugin-react";

export default [
  {
    files: ["**/*.jsx", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@html-eslint/react": htmlReact,
    },
    rules: {
      "@html-eslint/react/no-invalid-attr-value": "error",
      "@html-eslint/react/use-baseline": "error",
    },
  },
];
```

### Using Preset Configurations

The plugin provides two preset configurations:

- `recommended` - Enables all available rules with error severity
- `all` - Enables all available rules with error severity (currently identical to `recommended`)

#### Using the Recommended Configuration

```js
// eslint.config.js
import htmlReact from "@html-eslint/eslint-plugin-react";

export default [
  {
    files: ["**/*.jsx", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    ...htmlReact.configs.recommended,
  },
];
```

#### Using the All Configuration

```js
// eslint.config.js
import htmlReact from "@html-eslint/eslint-plugin-react";

export default [
  {
    files: ["**/*.jsx", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    ...htmlReact.configs.all,
  },
];
```
