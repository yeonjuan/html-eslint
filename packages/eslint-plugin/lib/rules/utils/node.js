/**
 * @typedef { import("es-html-parser").TagNode } TagNode
 * @typedef { import("es-html-parser").ScriptTagNode } ScriptTagNode
 * @typedef { import("es-html-parser").StyleTagNode } StyleTagNode
 * @typedef { import("es-html-parser").AttributeNode } AttributeNode
 * @typedef { import("es-html-parser").AttributeValueNode } AttributeValueNode
 * @typedef { import("es-html-parser").AnyNode } AnyNode
 * @typedef { import("es-html-parser").TextNode } TextNode
 * @typedef { import("es-html-parser").CommentContentNode } CommentContentNode
 * @typedef { import("es-html-parser").CommentNode } CommentNode
 * @typedef { import("../../types").LineNode } LineNode
 * @typedef { import("../../types").BaseNode } BaseNode
 * @typedef { import("../../types").Location } Location
 */

const { NODE_TYPES } = require("@html-eslint/parser");

/**
 * @param {TagNode | ScriptTagNode | StyleTagNode} node
 * @param {string} key
 * @returns {AttributeNode | undefined}
 */
function findAttr(node, key) {
  return node.attributes.find(
    (attr) => attr.key && attr.key.value.toLowerCase() === key.toLowerCase()
  );
}

/**
 * Checks whether a node's attributes is empty or not.
 * @param {TagNode | ScriptTagNode | StyleTagNode} node
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
 * @param {TextNode | CommentContentNode} node
 * @returns {LineNode[]}
 */
function splitToLineNodes(node) {
  let start = node.range[0];
  let line = node.loc.start.line;
  const startCol = node.loc.start.column;

  return node.value.split("\n").map((value, index) => {
    const columnStart = index === 0 ? startCol : 0;
    /**
     * @type {LineNode}
     */
    const lineNode = {
      type: "Line",
      value,
      range: [start, start + value.length],
      loc: {
        start: {
          line,
          column: columnStart,
        },
        end: {
          line,
          column: columnStart + value.length,
        },
      },
    };

    start += value.length + 1;
    line += 1;
    return lineNode;
  });
}

/**
 * Get location between two nodes.
 * @param {BaseNode} before A node placed in before
 * @param {BaseNode} after A node placed in after
 * @returns {Location} location between two nodes.
 */
function getLocBetween(before, after) {
  return {
    start: before.loc.end,
    end: after.loc.start,
  };
}

/**
 * @param {AttributeValueNode} node
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
 * @returns {node is TagNode}
 */
function isTag(node) {
  return node.type === NODE_TYPES.Tag;
}

/**
 * @param {AnyNode} node
 * @returns {node is CommentNode}
 */
function isComment(node) {
  return node.type === NODE_TYPES.Comment;
}

/**
 * @param {AnyNode} node
 * @returns {node is TextNode}
 */
function isText(node) {
  return node.type === NODE_TYPES.Text;
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
};
