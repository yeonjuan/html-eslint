/** @import {AngularTextAttribute} from "../../types" */

const {
  AngularTextAttributeAttributeKeyAdapter,
} = require("./angular-text-attribute");

/** @param {AngularTextAttribute} node */
function createAttributeKeyAdapter(node) {
  return new AngularTextAttributeAttributeKeyAdapter(node);
}

module.exports = {
  createAttributeKeyAdapter,
};
