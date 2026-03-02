/**
 * @import {AttributeAdapter} from "@html-eslint/core"
 * @import {
 *   SvelteAttachTag,
 *   SvelteAttribute,
 *   SvelteDirective,
 *   SvelteGenericsDirective,
 *   SvelteShorthandAttribute,
 *   SvelteSpecialDirective,
 *   SvelteSpreadAttribute,
 *   SvelteStyleDirective
 * } from "../../types.js"
 */

import { AST_NODE_TYPES } from "../../constants/node-types.js";
import { SvelteAttributeAttributeAdapter } from "./svelte-attrribute.js";
import { NullAttributeAdapter } from "./null.js";
import { SvelteShorthandAttributeAttributeAdapter } from "./svelte-shorthand-attribute.js";

/**
 * @param {SvelteAttribute
 *   | SvelteDirective
 *   | SvelteGenericsDirective
 *   | SvelteShorthandAttribute
 *   | SvelteSpecialDirective
 *   | SvelteSpreadAttribute
 *   | SvelteAttachTag
 *   | SvelteStyleDirective} node
 * @returns {AttributeAdapter}
 */
export function createAttributeAdapter(node) {
  switch (node.type) {
    case AST_NODE_TYPES.SvelteAttribute: {
      return new SvelteAttributeAttributeAdapter(node);
    }
    case AST_NODE_TYPES.SvelteShorthandAttribute: {
      return new SvelteShorthandAttributeAttributeAdapter(node);
    }
    default: {
      return new NullAttributeAdapter(node);
    }
  }
}
