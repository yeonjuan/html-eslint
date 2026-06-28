# `@html-eslint/parser`

HTML parser for ESLint. Converts HTML into an ESLint-compatible AST using [es-html-parser](https://github.com/yeonjuan/es-html-parser).

## Installation

```bash
npm install --save-dev @html-eslint/parser
```

## Configuration

```js
// eslint.config.js
import html from "@html-eslint/eslint-plugin";

export default [
  {
    files: ["**/*.html"],
    plugins: { "@html-eslint": html },
    languageOptions: {
      parser: html.parser,
    },
  },
];
```

## Documentation

- [Getting Started](https://html-eslint.org/docs/getting-started)

## License

MIT
