/**
 * @import {CssNodePlain} from "css-tree"
 * @import {AnyNode} from "es-html-parser"
 * @import {AST} from "eslint"
 */
const { visitorKeys } = require("./visitor-keys");
const { cssVisitorKeys } = require("./css-visitor-keys");

/**
 * @param {AnyNode | AST.Program} node
 * @param {(arg: AnyNode | AST.Program) => void} visitor
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

/**
 * @param {CssNodePlain} node
 * @param {(node: any) => void} visitor
 */
function traverseCss(node, visitor) {
  if (!node) {
    return;
  }
  /** @type {keyof typeof cssVisitorKeys} */
  // @ts-ignore
  const type = `Css${node.type}`;
  const keys = cssVisitorKeys[type];
  visitor(node);
  if (!keys || keys.length <= 0) {
    return;
  }

  keys.forEach((key) => {
    // @ts-ignore
    const value = node[key];
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((n) => traverseCss(n, visitor));
      } else {
        traverseCss(value, visitor);
      }
    }
  });
}

module.exports = {
  traverse,
  traverseCss,
};
