/**
 * @import {AttributeKeyAdapter} from "@html-eslint/core"
 * @import {
 *   Identifier,
 *   SvelteDirectiveKey,
 *   SvelteName
 * } from "../../types"
 */

import { IdentifierAttributeKeyAdapter } from "./identifier";

const { AST_NODE_TYPES } = require("../../constants/node-types");
const {
  SvelteDirectiveKeyAttributeKeyAdapter,
} = require("./svelte-directive-key");
const { SvelteNameAttributeKeyAdapter } = require("./svelte-name");

/**
 * @param {SvelteName | SvelteDirectiveKey | Identifier} node
 * @returns {AttributeKeyAdapter}
 */
export function createAttributeKeyAdapter(node) {
  switch (node.type) {
    case AST_NODE_TYPES.SvelteName: {
      return new SvelteNameAttributeKeyAdapter(node);
    }
    case AST_NODE_TYPES.SvelteDirectiveKey: {
      return new SvelteDirectiveKeyAttributeKeyAdapter(node);
    }
    case AST_NODE_TYPES.Identifier: {
      return new IdentifierAttributeKeyAdapter(node);
    }
  }
}
