/**
 * @import {
 *   AngularBoundAttribute,
 *   AngularTextAttribute
 * } from "../../types"
 */

const {
  AngularTextAttributeAttributeAdapter,
} = require("./angular-text-attribute");
const {
  AngularBoundAttributeAttributeAdapter,
} = require("./angular-bound-attribute");
const { AST_NODE_TYPES } = require("../../constants/node-types");

/** @param {AngularTextAttribute | AngularBoundAttribute} node */
function createAttributeAdapter(node) {
  switch (node.type) {
    case AST_NODE_TYPES.BoundAttribute:
      return new AngularBoundAttributeAttributeAdapter(node);
    case AST_NODE_TYPES.TextAttribute:
      return new AngularTextAttributeAttributeAdapter(node);
  }
}

module.exports = {
  createAttributeAdapter,
};
