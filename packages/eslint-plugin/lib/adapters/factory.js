/** @import {AttributeValue} from "@html-eslint/types" */

const { HTMLAttributeValueAdapter } = require("./attribute-value");

/** @param {AttributeValue} node */
function createAttributeValueAdapter(node) {
  return new HTMLAttributeValueAdapter(node);
}

module.exports = {
  createAttributeValueAdapter,
};
