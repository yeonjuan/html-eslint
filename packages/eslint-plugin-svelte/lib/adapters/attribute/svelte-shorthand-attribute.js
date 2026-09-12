/**
 * @import {AttributeAdapter} from "@html-eslint/core"
 * @import {
 *   Identifier,
 *   SvelteShorthandAttribute
 * } from "../../types"
 */

import { createAttributeKeyAdapter } from "../attribute-key/factory";
import { IdentifierAttributeValueAdapter } from "../attribute-value/identifier";

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
    return new IdentifierAttributeValueAdapter(
      /** @type {Identifier} */ (this.node.value)
    );
  }

  isSpread() {
    return false;
  }

  getLocation() {
    return this.node.loc;
  }
}
