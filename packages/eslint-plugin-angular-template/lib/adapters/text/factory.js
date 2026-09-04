/** @import {AngularText} from "../../types" */

const { AngularTextAdapter } = require("./angular-text");

/** @param {AngularText} node */
function createTextAdapter(node) {
  return new AngularTextAdapter(node);
}

module.exports = {
  createTextAdapter,
};
