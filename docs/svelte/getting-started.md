# Getting Started

`@html-eslint/eslint-plugin-svelte` is an ESLint plugin that validates HTML attribute values and baseline browser compatibility directly in your Svelte code. It extends the core `@html-eslint` functionality to work seamlessly with Svelte components.

## Contents

- [Installation](#installation)
- [Configuration](#configuration)

## Installation

- npm

```console,Terminal
npm install --save-dev eslint @html-eslint/eslint-plugin-svelte
```

- yarn

```console,Terminal
yarn add -D eslint @html-eslint/eslint-plugin-svelte
```

## Configuration

Update your ESLint configuration file:

### Manual Configuration

```js
// eslint.config.js (flat config)
import htmlSvelte from "@html-eslint/eslint-plugin-svelte";

export default [
  {
    files: ["**/*.svelte"],
    plugins: {
      "@html-eslint/svelte": htmlSvelte,
    },
    rules: {
      "@html-eslint/svelte/class-spacing": "error",
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
import htmlSvelte from "@html-eslint/eslint-plugin-svelte";

export default [
  {
    files: ["**/*.svelte"],
    ...htmlSvelte.configs.recommended,
  },
];
```

#### Using the All Configuration

```js
// eslint.config.js
import htmlSvelte from "@html-eslint/eslint-plugin-svelte";

export default [
  {
    files: ["**/*.svelte"],
    ...htmlSvelte.configs.all,
  },
];
```
