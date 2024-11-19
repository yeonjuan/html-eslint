# @html-eslint/template-parser

A parser that parses the html written inside a template literal.

## Usage

```js
const { parse } = require("@html-eslint/template-parser");
const espree = require("espree");
const { SourceCode } = require("eslint");

const code = `html\`<div
  id="\${ id }">
    \${text}
  </div>\`;`;

const ast = espree.parse(code, {
  range: true,
  loc: true,
  ecmaVersion: "latest",
});
const sourceCode = new SourceCode({
  text: code,
  ast: {
    ...ast,
    tokens: [],
    comments: ast.comments ?? [],
    loc: ast.loc,
    range: ast.range,
  },
});

const exp = ast.body[0].expression.quasi;
parse(exp, sourcecode, {
  Tag(node) {
    // ...
  },
  AttributeValue(node) {
    // ...
  },
});
```

## License

Distributed under the MIT License.
