# `@html-eslint/eslint-plugin-svelte`

ESLint plugin providing HTML linting rules for Svelte components.

## Installation

```bash
npm install --save-dev eslint @html-eslint/eslint-plugin-svelte svelte-eslint-parser
```

## Configuration

```js
// eslint.config.js
import htmlSvelte from "@html-eslint/eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";

export default [
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
    },
    ...htmlSvelte.configs.recommended,
  },
];
```

## Documentation

- [Getting Started](https://html-eslint.org/docs/svelte/getting-started)
- [Rules](https://html-eslint.org/docs/svelte/rules)

## License

MIT
