/**
 * @import {TextAdapter} from "@html-eslint/core"
 * @import {SvelteText} from "../../types"
 */

import { SvelteTextAdapter } from "./svelte-text";

/** @param {SvelteText} node */
export function createTextAdapter(node) {
  return new SvelteTextAdapter(node);
}
