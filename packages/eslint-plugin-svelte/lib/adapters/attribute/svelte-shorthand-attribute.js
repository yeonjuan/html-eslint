/**
 * @import {AttributeAdapter} from "@html-eslint/core"
 * @import {
 *   Identifier,
 *   SvelteShorthandAttribute
 * } from "../../types"
 */

import { createAttributeKeyAdapter } from "../attribute-key/factory";

/** @implements {AttributeAdapter} */
export class SvelteShorthandAttributeAttributeAdapter {
  /** @param {SvelteShorthandAttribute} node */
  constructor(node) {
    this.node = node;
  }

  getKey() {
    return createAttributeKeyAdapter(/** @type {Identifier} */ (this.node.key));
  }

  getValue() {
    return null;
  }
}
