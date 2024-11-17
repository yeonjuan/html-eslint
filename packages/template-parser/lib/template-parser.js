const esHtmlParser = require("es-html-parser");
const { traverse } = require("./traverser");
/**
 * @typedef {import("estree").TemplateLiteral} TemplateLiteral
 * @typedef {import("./types").TemplateHTMLVisitor} TemplateHTMLVisitor
 */

/**
 *
 * @param {TemplateLiteral} node
 * @param {TemplateHTMLVisitor} visitors
 */
function parse(node, visitors) {
  /**
   * @type {string[]}
   */
  const htmlParts = [];
  const quasis = node.quasis;
  const rangeOffset = node.range[0] + 1;
  const lineOffset = node.loc.start.line - 1;

  quasis.forEach((element) => {
    htmlParts.push(element.value.raw);
  });

  const html = htmlParts.join("");

  const { ast } = esHtmlParser.parse(html, {
    tokenAdapter: {
      finalizeLocation(token) {
        const startLine = token.loc.start.line + lineOffset;
        const columnOffset =
          startLine === node.loc.start.line ? node.loc.end.column + 1 : 0;

        return {
          start: {
            line: startLine,
            column: token.loc.start.column + columnOffset,
          },
          end: {
            line: token.loc.end.line + lineOffset,
            column: token.loc.end.column + columnOffset,
          },
        };
      },
      finalizeRange(token) {
        return [token.range[0] + rangeOffset, token.range[1] + rangeOffset];
      },
    },
  });

  traverse(ast, visitors);
  return ast;
}

module.exports = {
  parse,
};
