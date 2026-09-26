/**
 * @import {
 *   AttributeAdapter,
 *   ElementAdapter
 * } from "@html-eslint/core"
 * @import {
 *   Range,
 *   SourceLocation
 * } from "@html-eslint/types"
 * @import {
 *   SvelteElement,
 *   SvelteMemberExpressionName
 * } from "../../types"
 */

import { AST_NODE_TYPES } from "../../constants/node-types";
import { createAttributeAdapter } from "../attribute/factory";

/**
 * Recursively builds the string representation of a SvelteMemberExpressionName.
 * For example, <a.b.c> becomes "a.b.c"
 *
 * @param {SvelteMemberExpressionName} node
 * @returns {string}
 */
function getSvelteMemberExpressionName(node) {
  const objectName =
    node.object.type === AST_NODE_TYPES.Identifier
      ? node.object.name
      : getSvelteMemberExpressionName(node.object);
  return `${objectName}.${node.property.name}`;
}

/** @implements {ElementAdapter} */
export class SvelteElementElementAdapter {
  /** @param {SvelteElement} node */
  constructor(node) {
    this.node = node;
  }

  getElementName() {
    if (this.node.name.type === AST_NODE_TYPES.SvelteMemberExpressionName) {
      return getSvelteMemberExpressionName(this.node.name);
    }
    if (this.node.name.type === AST_NODE_TYPES.Identifier) {
      return this.node.name.name;
    }
    return this.node.name.name;
  }

  getLocation() {
    return this.node.loc;
  }

  getRange() {
    return this.node.range;
  }

  /** @returns {SourceLocation} */
  getOpenStartLocation() {
    return this.node.startTag.loc;
  }

  /** @returns {Range} */
  getOpenStartRange() {
    return /** @type {Range} */ ([
      this.node.startTag.range[0],
      this.node.name.range?.[1] ?? this.node.startTag.range[0],
    ]);
  }

  /** @returns {AttributeAdapter[]} */
  getAttributes() {
    return this.node.startTag.attributes.map((attribute) =>
      createAttributeAdapter(attribute)
    );
  }

  /** @returns {{ name: string; isCustomElement: boolean } | null} */
  getParentContainer() {
    /** @type {any} */
    let current = this.node.parent;
    while (current && current.type !== AST_NODE_TYPES.SvelteElement) {
      current = current.parent;
    }
    if (!current || current.type !== AST_NODE_TYPES.SvelteElement) {
      // No enclosing element - e.g. this element is at the root of the
      // component, composed into a list elsewhere via slots/props.
      return { name: "", isCustomElement: true };
    }
    if (current.kind !== "html") {
      // A Svelte component (e.g. <ListItem>) or special element (e.g.
      // <svelte:component>, <svelte:element>) whose rendered output can't
      // be statically verified.
      return { name: "", isCustomElement: true };
    }
    return {
      name: new SvelteElementElementAdapter(current).getElementName(),
      isCustomElement: false,
    };
  }
}
