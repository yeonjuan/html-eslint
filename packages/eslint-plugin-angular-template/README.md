# `@html-eslint/eslint-plugin-angular-template`

ESLint plugin providing HTML linting rules for Angular templates.

## Installation

```bash
npm install --save-dev eslint @html-eslint/eslint-plugin-angular-template @angular-eslint/template-parser
```

## Configuration

```js
// eslint.config.js
import angularTemplate from "@html-eslint/eslint-plugin-angular-template";
import templateParser from "@angular-eslint/template-parser";

export default [
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: templateParser,
    },
    ...angularTemplate.configs.recommended,
  },
];
```

## Documentation

- [Getting Started](https://html-eslint.org/docs/angular-template/getting-started)
- [Rules](https://html-eslint.org/docs/angular-template/rules)

## License

MIT
