/**
 * @import {
 *   AttributeAdapter,
 *   ElementAdapter
 * } from "@html-eslint/core"
 * @import {
 *   Range,
 *   SourceLocation
 * } from "@html-eslint/types"
 * @import {SvelteElement} from "../../types"
 */

import { AST_NODE_TYPES } from "../../constants/node-types";
import { createAttributeAdapter } from "../attribute/factory";

/** @implements {ElementAdapter} */
export class SvelteElementElementAdapter {
  /** @param {SvelteElement} node */
  constructor(node) {
    this.node = node;
  }
  getElementName() {
    if (this.node.name.type === AST_NODE_TYPES.SvelteMemberExpressionName) {
      // TODO: member expression name 처리
      return "";
    }
    if (this.node.name.type === AST_NODE_TYPES.Identifier) {
      return this.node.name.name;
    }
    return this.node.name.name;
  }

  /** @returns {SourceLocation} */
  getOpenStartLocation() {
    return this.node.startTag.loc;
  }

  /** @returns {Range} */
  getOpenStartRange() {
    return this.node.startTag.range;
  }

  /** @returns {AttributeAdapter[]} */
  getAttributes() {
    return this.node.startTag.attributes.map((attribute) =>
      createAttributeAdapter(attribute)
    );
  }
}
