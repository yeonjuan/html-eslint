/**
 * @typedef { import("../../types").Attribute } Attribute
 * @typedef { import("../../types").Tag } Tag
 * @typedef { import("../../types").ScriptTag } ScriptTag
 * @typedef { import("../../types").StyleTag } StyleTag
 * @typedef { import("../../types").Line } Line
 * @typedef { import("../../types").Text } Text
 * @typedef { import("../../types").CommentContent } CommentContent
 * @typedef { import("../../types").Comment } Comment
 * @typedef { import("../../types").AnyNode } AnyNode
 * @typedef { import("../../types").AttributeValue } AttributeValue
 * @typedef { import("eslint").AST.Range } Range
 * @typedef { import("eslint").AST.SourceLocation } SourceLocation
 * @typedef { import("es-html-parser").AnyToken } AnyToken

 */

const { NODE_TYPES } = require("@html-eslint/parser");

/**
 * @param {Tag | ScriptTag | StyleTag} node
 * @param {string} key
 * @returns {Attribute | undefined}
 */
function findAttr(node, key) {
  return node.attributes.find(
    (attr) => attr.key && attr.key.value.toLowerCase() === key.toLowerCase()
  );
}

/**
 * Checks whether a node's attributes is empty or not.
 * @param {Tag | ScriptTag | StyleTag} node
 * @returns {boolean}
 */
function isAttributesEmpty(node) {
  return !node.attributes || node.attributes.length <= 0;
}

/**
 * Checks whether a node's all tokens are on the same line or not.
 * @param {AnyNode} node A node to check
 * @returns {boolean} `true` if a node's tokens are on the same line, otherwise `false`.
 */
function isNodeTokensOnSameLine(node) {
  return node.loc.start.line === node.loc.end.line;
}

/**
 *
 * @param {Range} rangeA
 * @param {Range} rangeB
 * @returns {boolean}
 */
function isRangesOverlap(rangeA, rangeB) {
  return rangeA[0] < rangeB[1] && rangeB[0] < rangeA[1];
}

/**
 * @param {(Text | CommentContent)['templates']} templates
 * @param {Range} range
 * @returns {boolean}
 */
function isOverlapWithTemplates(templates, range) {
  return templates
    .filter((template) => template.isTemplate)
    .some((template) => isRangesOverlap(template.range, range));
}

/**
 *
 * @param {Text | CommentContent} node
 * @returns {Line[]}
 */
function splitToLineNodes(node) {
  let start = node.range[0];
  let line = node.loc.start.line;
  const startCol = node.loc.start.column;
  /**
   * @type {Line[]}
   */
  const lineNodes = [];
  const templates = node.templates || [];
  /**
   *
   * @param {Range} range
   */
  function shouldSkipIndentCheck(range) {
    return templates.some(
      (template) =>
        template.isTemplate && isRangesOverlap(template.range, range)
    );
  }

  node.value.split("\n").forEach((value, index) => {
    const columnStart = index === 0 ? startCol : 0;
    /**
     * @type {Range}
     */
    const range = [start, start + value.length];
    const loc = {
      start: {
        line,
        column: columnStart,
      },
      end: {
        line,
        column: columnStart + value.length,
      },
    };
    /**
     * @type {Line}
     */
    const lineNode = {
      type: "Line",
      value,
      range,
      loc,
      skipIndentCheck: shouldSkipIndentCheck(range),
    };

    start += value.length + 1;
    line += 1;

    lineNodes.push(lineNode);
  });

  return lineNodes;
}

/**
 * Get location between two nodes.
 * @param {{loc: SourceLocation}} before A node placed in before
 * @param {{loc: SourceLocation}} after A node placed in after
 * @returns {SourceLocation} location between two nodes.
 */
function getLocBetween(before, after) {
  return {
    start: before.loc.end,
    end: after.loc.start,
  };
}

/**
 * @param {AttributeValue} node
 * @return {boolean}
 */
function isExpressionInTemplate(node) {
  if (node.type === NODE_TYPES.AttributeValue) {
    return node.value.indexOf("${") === 0;
  }
  return false;
}

/**
 * @param {AnyNode} node
 * @returns {node is Tag}
 */
function isTag(node) {
  return node.type === NODE_TYPES.Tag;
}

/**
 * @param {AnyNode} node
 * @returns {node is Comment}
 */
function isComment(node) {
  return node.type === NODE_TYPES.Comment;
}

/**
 * @param {AnyNode} node
 * @returns {node is Text}
 */
function isText(node) {
  return node.type === NODE_TYPES.Text;
}

const lineBreakPattern = /\r\n|[\r\n\u2028\u2029]/u;
const lineEndingPattern = new RegExp(lineBreakPattern.source, "gu");
/**
 * @param {string} source
 * @returns {string[]}
 */
function codeToLines(source) {
  return source.split(lineEndingPattern);
}

/**
 *
 * @param {AnyToken[]} tokens
 * @returns {((CommentContent | Text)['templates'][number])[]}
 */
function getTemplateTokens(tokens) {
  return (
    []
      .concat(
        ...tokens
          // @ts-ignore
          .map((token) => token["templates"] || [])
      )
      // @ts-ignore
      .filter((token) => token.isTemplate)
  );
}

module.exports = {
  findAttr,
  isAttributesEmpty,
  isNodeTokensOnSameLine,
  splitToLineNodes,
  getLocBetween,
  isExpressionInTemplate,
  isTag,
  isComment,
  isText,
  isOverlapWithTemplates,
  codeToLines,
  isRangesOverlap,
  getTemplateTokens,
};
