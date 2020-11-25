module.exports = {
  /**
   * Find attribute by name in the given node
   * @param {HTMLNode} node node
   * @param {string} name attribute name
   * @return {HTMLNode | undefined}
   */
  findAttr(node, name) {
    return node
      ? (node.attrs || []).find((attr) => attr.name === name)
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
};
