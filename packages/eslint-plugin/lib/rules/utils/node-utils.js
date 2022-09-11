/**
 * @typedef {import("es-html-parser").TagNode} TagNode
 * @typedef {import("es-html-parser").AnyNode} AnyNode
 */

module.exports = {
  findAttr(node, name) {
    return node.attributes.find(
      (attr) => attr.key && attr.key.value.toLowerCase() === name.toLowerCase()
    );
  },
  /**
   * Checks a node has attribute with the given name or not.
   * @param {TagNode} node node
   * @param {string} name attribute name
   * @return {boolean} `true` if the node has a attribute, otherwise `false`.
   */
  hasAttr(node, name) {
    return (
      !!node &&
      (node.attributes || []).some(
        (attr) => attr.key && attr.key.value === name
      )
    );
  },
  /**
   * Checks whether a node's all tokens are on the same line or not.
   * @param {AnyNode} node A node to check
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
