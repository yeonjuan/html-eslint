/**
 * @import {
 *   AttributeAdapter,
 *   ElementNodeAdapter
 * } from "@html-eslint/core"
 * @import {
 *   SvelteAttribute,
 *   SvelteElement,
 *   SvelteLiteral,
 *   SvelteMustacheTag,
 *   SvelteName
 * } from "svelte-eslint-parser/lib/ast"
 */

import { AST_NODE_TYPES } from "../../constants/node-types";

/**
 * Checks if a Svelte value part contains template/expression
 *
 * @param {SvelteLiteral | SvelteMustacheTag} valuePart
 * @returns {boolean}
 */
function hasExpression(valuePart) {
  return valuePart.type !== "SvelteLiteral";
}

/**
 * Gets the string value from a Svelte attribute value array
 *
 * @param {(SvelteLiteral | SvelteMustacheTag)[] | undefined} valueArray
 * @returns {string}
 */
function getAttributeValue(valueArray) {
  if (!valueArray || valueArray.length === 0) {
    return "";
  }

  // Concatenate all literal parts, skip expression parts
  return valueArray
    .filter((part) => part.type === AST_NODE_TYPES.SvelteLiteral)
    .map((part) => part.value)
    .join("");
}

/**
 * Checks if any part of the attribute value contains expressions
 *
 * @param {(SvelteLiteral | SvelteMustacheTag)[] | undefined} valueArray
 * @returns {boolean}
 */
function hasValueExpression(valueArray) {
  if (!valueArray || valueArray.length === 0) {
    return false;
  }

  return valueArray.some((part) => hasExpression(part));
}

/**
 * @param {SvelteAttribute} node
 * @returns {AttributeAdapter<
 *   SvelteName,
 *   (SvelteLiteral | SvelteMustacheTag)[]
 * >}
 */
export function attributeNodeAdapter(node) {
  return {
    key: {
      node: () => node.key,
      isExpression() {
        // Svelte attribute keys are always static names
        return false;
      },
      value: () => {
        if (node.key && node.key.name) {
          return node.key.name.toLowerCase();
        }
        return "";
      },
      raw: () => {
        if (node.key && node.key.name) {
          return node.key.name;
        }
        return "";
      },
    },
    value: {
      node: () => node.value || null,
      isExpression() {
        return hasValueExpression(node.value);
      },
      value: () => getAttributeValue(node.value),
    },
  };
}

/**
 * Gets the tag name from a Svelte element
 *
 * @param {SvelteElement} node
 * @returns {string}
 */
function getTagName(node) {
  if (!node.name) {
    return "";
  }

  // Handle SvelteName and Identifier types
  if ("name" in node.name && typeof node.name.name === "string") {
    return node.name.name;
  }

  // Handle SvelteMemberExpressionName (e.g., namespace.component)
  if (node.name.type === AST_NODE_TYPES.SvelteMemberExpressionName) {
    // For member expressions, we can't easily get a simple tag name
    // Return empty string as these are typically dynamic components
    return "";
  }

  return "";
}

/**
 * @param {SvelteElement} node
 * @returns {ElementNodeAdapter<
 *   SvelteElement,
 *   SvelteName,
 *   (SvelteLiteral | SvelteMustacheTag)[]
 * >}
 */
export function elementNodeAdapter(node) {
  return {
    node: () => node,
    getTagName() {
      return getTagName(node);
    },
    getAttributes() {
      const attributes = node.startTag?.attributes || [];
      return attributes
        .filter((attr) => attr.type === AST_NODE_TYPES.SvelteAttribute)
        .map(attributeNodeAdapter);
    },
  };
}
