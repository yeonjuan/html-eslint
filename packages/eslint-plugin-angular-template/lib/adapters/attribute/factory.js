/** @import {AngularTextAttribute} from "../../types" */

const {
  AngularTextAttributeAttributeAdapter,
} = require("./angular-text-attribute");

/** @param {AngularTextAttribute} node */
function createAttributeAdapter(node) {
  return new AngularTextAttributeAttributeAdapter(node);
}

module.exports = {
  createAttributeAdapter,
};
