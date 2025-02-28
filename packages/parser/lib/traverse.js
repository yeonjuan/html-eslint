/**
 * @typedef {import("es-html-parser").AnyNode} AnyNode
 * @typedef {import("eslint").AST.Program} Program
 */
const { visitorKeys } = require("./visitor-keys");

/**
 *
 * @param {AnyNode | Program} node
 * @param {(arg: AnyNode | Program) => void} visitor
 * @returns {void}
 */
function traverse(node, visitor) {
  if (!node) {
    return;
  }
  visitor(node);
  const type = node.type;
  // @ts-ignore
  const keys = visitorKeys[type];

  if (!keys || keys.length <= 0) {
    return;
  }

  // @ts-ignore
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
