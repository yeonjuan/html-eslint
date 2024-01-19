/**
 * @typedef { import("../../types").TagNode } TagNode
 * @typedef { import("../../types").ScriptTagNode } ScriptTagNode
 * @typedef { import("../../types").StyleTagNode } StyleTagNode
 * @typedef { import("../../types").AttributeNode } AttributeNode
 * @typedef { import("../../types").AnyNode } AnyNode
 * @typedef { import("../../types").TextNode } TextNode
 * @typedef { import("../../types").CommentContentNode } CommentContentNode
 * @typedef { import("../../types").LineNode } LineNode
 * @typedef { import("../../types").BaseNode } BaseNode
 * @typedef { import("../../types").Location } Location
 */

module.exports = {
  /**
   * @param {TagNode | ScriptTagNode | StyleTagNode} node
   * @param {string} key
   * @returns {AttributeNode | undefined}
   */
  findAttr(node, key) {
    return node.attributes.find(
      (attr) => attr.key && attr.key.value.toLowerCase() === key.toLowerCase()
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
