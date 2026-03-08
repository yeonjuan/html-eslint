/** @import {AngularElement} from "../../types" */

const { AngularElementElementAdapter } = require("./angular-element");

/** @param {AngularElement} node */
function createElementAdapter(node) {
  return new AngularElementElementAdapter(node);
}

module.exports = {
  createElementAdapter,
};
