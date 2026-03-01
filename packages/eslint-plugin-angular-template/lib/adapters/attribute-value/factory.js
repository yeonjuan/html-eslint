/** @import {AngularTextAttribute} from "../../types" */

const {
  AngularTextAttributeAttributeValueAdapter,
} = require("./angular-text-attribute");

/** @param {AngularTextAttribute} node */
function createAttributeValueAdapter(node) {
  return new AngularTextAttributeAttributeValueAdapter(node);
}

module.exports = {
  createAttributeValueAdapter,
};
