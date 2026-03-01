/**
 * @import {
 *   Literal,
 *   SvelteLiteral,
 *   TemplateLiteral
 * } from "../../../types"
 */

import { AST_NODE_TYPES } from "../../../constants/node-types";
import { LiteralAttributeValueAdapter } from "./literal";
import { SvelteLiteralAttributeValueAdapter } from "./svelte-literal";
import { TemplateLiteralAttributeValueAdapter } from "./template-literal";

/** @param {Literal | SvelteLiteral | TemplateLiteral} node */
export function createAttributeValueAdapter(node) {
  switch (node.type) {
    case AST_NODE_TYPES.Literal: {
      return new LiteralAttributeValueAdapter(node);
    }
    case AST_NODE_TYPES.SvelteLiteral: {
      return new SvelteLiteralAttributeValueAdapter(node);
    }
    case AST_NODE_TYPES.TemplateLiteral: {
      return new TemplateLiteralAttributeValueAdapter(node);
    }
  }
}
