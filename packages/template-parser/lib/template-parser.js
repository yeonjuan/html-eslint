const esHtmlParser = require("es-html-parser");
const { traverse } = require("./traverser");
/**
 * @typedef {import("@html-eslint/types").TemplateLiteral} TemplateLiteral
 * @typedef {import("./types").TemplateHTMLVisitor} TemplateHTMLVisitor
 * @typedef {import("eslint").SourceCode} SourceCode
 */

/**
 * @param {TemplateLiteral} node
 * @param {SourceCode} sourceCode
 * @param {TemplateHTMLVisitor} visitors
 */
function parse(node, sourceCode, visitors) {
  /**
   * @type {string[]}
   */
  const htmlParts = [];
  const quasis = node.quasis;
  const rangeOffset = node.range[0] + 1;
  const lineOffset = node.loc.start.line - 1;
  const expressions = node.expressions;
  /**
   * @type {{open: [number, number]; close: [number, number]}[]}
   */
  const templateInfos = [];
  quasis.forEach((element, index) => {
    htmlParts.push(element.value.raw);
    if (expressions[index]) {
      const nextQuasisElement = quasis[index + 1];
      const str = sourceCode.text.slice(
        element.range[1] - "${".length,
        nextQuasisElement.range[0] + "}".length
      );
      htmlParts.push(str);
      const start = element.range[1] - "${".length - rangeOffset;
      const end = start + str.length;
      templateInfos.push({
        open: [start, start + "${".length],
        close: [end - "}".length, end],
      });
    }
  });
  const html = htmlParts.join("");
  const { ast, tokens } = esHtmlParser.parse(html, {
    templateInfos: templateInfos,
    tokenAdapter: {
      finalizeLocation(token) {
        const startLine = token.loc.start.line + lineOffset;
        const columnOffset =
          startLine === node.loc.start.line ? node.loc.start.column + 1 : 0;

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
  traverse(ast, visitors, null);
  return { ast, html, tokens };
}

module.exports = {
  parse,
};
