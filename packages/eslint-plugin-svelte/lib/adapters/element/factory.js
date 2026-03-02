/** @import {SvelteElement} from "../../types" */

import { SvelteElementElementAdapter } from "./svelte-element";

/** @param {SvelteElement} node */
export function createElementAdapter(node) {
  return new SvelteElementElementAdapter(node);
}
