const { parse } = require("es-html-parser");
const { visitorKeys } = require("./visitor-keys");

function parseForESLint(code) {
  const { ast, tokens } = parse(code);

  const programNode = {
    type: "Program",
    body: ast.children,
    loc: ast.loc,
    range: ast.range,
    tokens: tokens,
    comments: [],
  };
  return {
    ast: programNode,
    visitorKeys,
    scopeManager: null,
  };
}

module.exports = { parseForESLint };
