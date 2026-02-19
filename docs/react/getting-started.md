# Getting Started

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

```js
// eslint.config.js (flat config)
import htmlReact from "@html-eslint/eslint-plugin-react";

export default [
  {
    files: ["**/*.jsx", "**/*.tsx"],
    plugins: {
      "html-react": htmlReact,
    },
    rules: {
      "html-react/no-invalid-attr-value": "error",
      "html-react/use-baseline": "error",
    },
  },
];
```
