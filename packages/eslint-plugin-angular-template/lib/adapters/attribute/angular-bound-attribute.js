/**
 * @import {AttributeAdapter} from "@html-eslint/core"
 * @import {AngularBoundAttribute} from "../../types"
 */

const {
  AngularBoundAttributeAttributeKeyAdapter,
} = require("../attribute-key/angular-bound-attribute");
const {
  AngularBoundAttributeAttributeValueAdapter,
} = require("../attribute-value/angular-bound-attribute");

/** @implements {AttributeAdapter} */
class AngularBoundAttributeAttributeAdapter {
  /** @param {AngularBoundAttribute} node */
  constructor(node) {
    this.node = node;
  }
  getKey() {
    return new AngularBoundAttributeAttributeKeyAdapter(this.node);
  }

  getValue() {
    return new AngularBoundAttributeAttributeValueAdapter(this.node);
  }
}

module.exports = {
  AngularBoundAttributeAttributeAdapter,
};
