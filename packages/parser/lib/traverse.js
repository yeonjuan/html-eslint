/**
 * @typedef {import("./types").AnyHTMLNode} AnyHTMLNode
 */
const { visitorKeys } = require("./visitor-keys");

/**
 *
 * @param {AnyHTMLNode} node
 * @param {(arg: AnyHTMLNode) => void} visitor
 * @returns {void}
 */
function traverse(node, visitor) {
  if (!node) {
    return;
  }
  visitor(node);
  const type = node.type;
  const keys = visitorKeys[type];

  if (!keys || keys.length <= 0) {
    return;
  }

  keys.forEach((key) => {
    // @ts-ignore
    const value = node[key];
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((n) => traverse(n, visitor));
      } else {
        traverse(value, visitor);
      }
    }
  });
}

module.exports = {
  traverse,
};
