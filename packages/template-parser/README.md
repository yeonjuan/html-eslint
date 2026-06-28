# `@html-eslint/template-parser`

Parser for HTML written inside JavaScript/TypeScript template literals (e.g., Lit).

## Installation

```bash
npm install --save-dev @html-eslint/template-parser
```

## Usage

```js
const { parse } = require("@html-eslint/template-parser");

parse(templateLiteralNode, sourceCode, {
  Tag(node) {
    // visit HTML tag nodes
  },
  AttributeValue(node) {
    // visit attribute value nodes
  },
});
```

## Documentation

- [Getting Started](https://html-eslint.org/docs/getting-started)

## License

MIT
