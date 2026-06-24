/**
 * @import {
 *   SvelteMustacheTagText,
 *   SvelteText
 * } from "../../types"
 */

import { AST_NODE_TYPES } from "../../constants/node-types";
import { SvelteMustacheTagTextTextAdapter } from "./svelte-mustache-tag-text";
import { SvelteTextAdapter } from "./svelte-text";

/** @param {SvelteText | SvelteMustacheTagText} node */
export function createTextAdapter(node) {
  switch (node.type) {
    case AST_NODE_TYPES.SvelteText: {
      return new SvelteTextAdapter(node);
    }
    case AST_NODE_TYPES.SvelteMustacheTag: {
      return new SvelteMustacheTagTextTextAdapter(node);
    }
  }
}
