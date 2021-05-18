/**
 * @typedef {import("../../types").ElementNode} ElementNode
 * @typedef {import("../../types").AttrNode} AttrNode
 * @typedef {import("../../types").AnyNode} AnyNode
 * @typedef {import("../../types").TextNode} TextNode
 * @typedef {import("../../types").BaseNode} BaseNode
 * @typedef {import("../../types").TextLineNode} TextLineNode
 * @typedef {import("../../types").CommentNode} CommentNode
 */

module.exports = {
  /**
   * Find attribute by name in the given node
   * @param {ElementNode} node node
   * @param {string} name attribute name
   * @return {AttrNode | void}
   */
  findAttr(node, name) {
    return node
      ? (node.attrs || []).find(
          (attr) => attr.name.toLowerCase() === name.toLowerCase()
        )
      : undefined;
  },
  /**
   * Checks a node has attribute with the given name or not.
   * @param {ElementNode} node node
   * @param {string} name attribute name
   * @return {boolean} `true` if the node has a attribute, otherwise `false`.
   */
  hasAttr(node, name) {
    return !!node && (node.attrs || []).some((attr) => attr.name === name);
  },
  /**
   * Checks whether a node's all tokens are on the same line or not.
   * @param {ElementNode} node A node to check
   * @returns {boolean} `true` if a node's tokens are on the same line, otherwise `false`.
   */
  isNodeTokensOnSameLine(node) {
    return node.loc.start.line === node.loc.end.line;
  },

  /**
   * Checks whether a node is a TextNode or not.
   * @param {Object} node A node to check
   * @returns {node is TextNode} `true` if a node is `TextNode`, otherwise `false`.
   */
  isTextNode(node) {
    return !!(node && node.type === "text" && typeof node.value === "string");
  },

  /**
   * Checks whether a node is a CommentNode or not.
   * @param {Object} node A node to check
   * @returns {node is CommentNode} `true` if a node is `CommentNode`, otherwise `false`.
   */
  isCommentNode(node) {
    return !!(node && node.type === "comment");
  },
};
