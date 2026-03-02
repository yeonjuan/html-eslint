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

/** @implements {AttributeAdapter} */
export class NullAttributeAdapter {
  /**
   * @param {SvelteAttribute
   *   | SvelteAttachTag
   *   | SvelteDirective
   *   | SvelteGenericsDirective
   *   | SvelteShorthandAttribute
   *   | SvelteSpecialDirective
   *   | SvelteSpreadAttribute
   *   | SvelteStyleDirective} node
   */
  constructor(node) {
    this.node = node;
  }

  getKey() {
    return null;
  }

  getValue() {
    return null;
  }
}
