/**
 * @import {AttributeAdapter} from "@html-eslint/core"
 * @import {SvelteAttribute} from "../../types"
 */

import { createAttributeKeyAdapter } from "../attribute-key/factory";
import { createAttributeValueAdapter } from "../attribute-value/factory";

/** @implements {AttributeAdapter} */
export class SvelteAttributeAttributeAdapter {
  /** @param {SvelteAttribute} node */
  constructor(node) {
    this.node = node;
  }

  getKey() {
    return createAttributeKeyAdapter(this.node.key);
  }

  getValue() {
    if (this.node.value.length > 1) {
      return null;
    }
    const first = this.node.value[0];

    return createAttributeValueAdapter(first);
  }
}
