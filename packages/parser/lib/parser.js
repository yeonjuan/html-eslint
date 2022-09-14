const { parse } = require("es-html-parser");
const { visitorKeys } = require("./visitor-keys");
const { traverse } = require("./traverse");

function parseForESLint(code) {
  const { ast, tokens } = parse(code);

  const programNode = {
    type: "Program",
    body: ast.children,
    loc: ast.loc,
    range: ast.range,
    tokens: tokens.filter(
      (token) =>
        token.type !== "CommentContent" &&
        token.type !== "CommentOpen" &&
        token.type !== "CommentClose"
    ),
    comments: [],
  };

  traverse(programNode, (node) => {
    if (node.type === "CommentContent") {
      programNode.comments.push({
        type: node.type,
        range: node.range,
        loc: node.loc,
        value: node.value,
      });
    }
  });

  return {
    ast: programNode,
    visitorKeys,
    scopeManager: null,
  };
}

module.exports = { parseForESLint };
