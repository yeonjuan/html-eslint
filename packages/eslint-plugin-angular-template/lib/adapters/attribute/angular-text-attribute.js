/**
 * @import {AttributeAdapter} from "@html-eslint/core"
 * @import {AngularTextAttribute} from "../../types"
 */

const {
  AngularTextAttributeAttributeKeyAdapter,
} = require("../attribute-key/angular-text-attribute");
const {
  AngularTextAttributeAttributeValueAdapter,
} = require("../attribute-value/angular-text-attribute");

/** @implements {AttributeAdapter} */
class AngularTextAttributeAttributeAdapter {
  /** @param {AngularTextAttribute} node */
  constructor(node) {
    this.node = node;
  }
  getKey() {
    return new AngularTextAttributeAttributeKeyAdapter(this.node);
  }

  getValue() {
    return new AngularTextAttributeAttributeValueAdapter(this.node);
  }
}

module.exports = {
  AngularTextAttributeAttributeAdapter,
};
