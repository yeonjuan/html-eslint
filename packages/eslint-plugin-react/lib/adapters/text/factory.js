/** @import {JSXText} from "../../types" */

const { JSXTextAdapter } = require("./jsx-text");

/**
 * @param {JSXText} node
 * @returns {JSXTextAdapter}
 */
function createTextAdapter(node) {
  return new JSXTextAdapter(node);
}

module.exports = {
  createTextAdapter,
};
