// @ts-check
/**
 * @typedef {import("../../types").HTMLNode} HTMLNode
 * @typedef {import("../../types").AttrNode} AttrNode
 */

module.exports = {
  /**
   * Find attribute by name in the given node
   * @param {HTMLNode} node node
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
   * @param {HTMLNode} node node
   * @param {string} name attribute name
   * @return {boolean} `true` if the node has a attribute, otherwise `false`.
   */
  hasAttr(node, name) {
    return !!node && (node.attrs || []).some((attr) => attr.name === name);
  },
  /**
   * Checks whether a node's all tokens are on the same line or not.
   * @param {HTMLNode} node A node to check
   * @returns {boolean} `true` if a node's tokens are on the same line, otherwise `false`.
   */
  isNodeTokensOnSameLine(node) {
    return node.loc.start.line === node.loc.end.line;
  },
};
