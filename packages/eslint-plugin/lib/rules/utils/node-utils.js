/**
 * @typedef {import("es-html-parser").TagNode} TagNode
 * @typedef {import("es-html-parser").AnyNode} AnyNode
 * @typedef {import("es-html-parser").TextNode} TextNode
 * @typedef {import("es-html-parser").AttributeNode} AttributeNode
 * @typedef {import("../../types").LineNode} LineNode
 * @typedef {import("../../types").CommentContentNode} CommentContentNode
 * @typedef {import("../../types").BaseNode} BaseNode
 * @typedef {import("../../types").Location} Location
 */

module.exports = {
  /*
   * @param {TagNode} node
   * @param {string} name
   * @returns {AttributeNode | undefined}
   */
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

  /**
   *
   * @param {TextNode | CommentContentNode} node
   * @returns {LineNode[]}
   */
  splitToLineNodes(node) {
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
  },
  /**
   * Get location between two nodes.
   * @param {BaseNode} before A node placed in before
   * @param {BaseNode} after A node placed in after
   * @returns {Location} location between two nodes.
   */
  getLocBetween(before, after) {
    return {
      start: before.loc.end,
      end: after.loc.start,
    };
  },
};
