# `@html-eslint/eslint-plugin-react`

ESLint plugin providing HTML linting rules for React JSX.

## Installation

```bash
npm install --save-dev eslint @html-eslint/eslint-plugin-react
```

## Configuration

```js
// eslint.config.js
import htmlReact from "@html-eslint/eslint-plugin-react";

export default [
  ...htmlReact.configs.recommended,
  {
    rules: {
      "@html-eslint/react/use-baseline": "warn",
    },
  },
];
```

## Documentation

- [Getting Started](https://html-eslint.org/docs/react/getting-started)
- [Rules](https://html-eslint.org/docs/react/rules)

## License

MIT
