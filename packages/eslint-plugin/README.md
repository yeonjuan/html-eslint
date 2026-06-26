# `@html-eslint/eslint-plugin`

ESLint plugin providing HTML linting rules for `.html` files.

## Installation

```bash
npm install --save-dev eslint @html-eslint/parser @html-eslint/eslint-plugin
```

## Configuration

```js
// eslint.config.js
import { defineConfig } from "eslint/config";
import html from "@html-eslint/eslint-plugin";

export default defineConfig([
  {
    files: ["**/*.html"],
    plugins: {
      html,
    },
    // When using the recommended rules (or "html/all" for all rules)
    extends: ["html/recommended"],
    language: "html/html",
    rules: {
      "html/no-duplicate-class": "error",
    },
  },
]);
```

## Documentation

- [Getting Started](https://html-eslint.org/docs/getting-started)
- [Rules](https://html-eslint.org/docs/rules)
- [Playground](https://html-eslint.org/playground)

## License

MIT
