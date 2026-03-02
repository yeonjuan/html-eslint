/** @import {SvelteElement} from "../../types" */

import { SvelteElementElementAdapter } from "./svelte-element";

/** @param {import("../../types").SvelteElement} node */
export function createElementAdapter(node) {
  return new SvelteElementElementAdapter(node);
}
