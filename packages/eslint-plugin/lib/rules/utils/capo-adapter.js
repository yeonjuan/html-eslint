/**
 * @import {
 *   AnyNode,
 *   ScriptTag,
 *   StyleTag,
 *   Tag
 * } from "@html-eslint/types"
 */

const { NODE_TYPES } = require("@html-eslint/parser");
const { findAttr, getNameOf } = require("./node");

/** Adapter for HTML ESLint AST nodes to work with capo.js */
class HtmlEslintAdapter {
  /**
   * Check if node is an Element (Tag, ScriptTag, or StyleTag)
   *
   * @param {AnyNode} node - The node to check
   * @returns {node is Tag | ScriptTag | StyleTag}
   */
  isElement(node) {
    return (
      node.type === NODE_TYPES.Tag ||
      node.type === NODE_TYPES.ScriptTag ||
      node.type === NODE_TYPES.StyleTag
    );
  }

  /**
   * Get the tag name of an element (lowercase)
   *
   * @param {Tag | StyleTag | ScriptTag} node - Element node
   * @returns {string} - Tag name like 'meta', 'link', 'script'
   */
  getTagName(node) {
    if (!this.isElement(node)) {
      return "";
    }
    return getNameOf(node);
  }

  /**
   * Get attribute value from element
   *
   * @param {Tag | StyleTag | ScriptTag} node - Element node
   * @param {string} attrName - Attribute name (case-insensitive)
   * @returns {string | null} - Attribute value or null if not found
   */
  getAttribute(node, attrName) {
    if (!this.isElement(node)) {
      return null;
    }

    const attr = findAttr(node, attrName);
    if (!attr || !attr.value) {
      return null;
    }

    return attr.value.value || null;
  }

  /**
   * Check if element has a specific attribute
   *
   * @param {Tag | StyleTag | ScriptTag} node - Element node
   * @param {string} attrName - Attribute name (case-insensitive)
   * @returns {boolean} - True if attribute exists
   */
  hasAttribute(node, attrName) {
    if (!this.isElement(node)) {
      return false;
    }

    return !!findAttr(node, attrName);
  }

  /**
   * @param {Tag | StyleTag | ScriptTag} node - Element node
   * @returns {string[]} - Array of attribute names
   */
  getAttributeNames(node) {
    if (!this.isElement(node) || !node.attributes) {
      return [];
    }

    return node.attributes
      .filter((attr) => attr.type === NODE_TYPES.Attribute && attr.key)
      .map((attr) => attr.key.value);
  }

  /**
   * @param {Tag | StyleTag | ScriptTag} node - Element node
   * @returns {string} - Text content
   */
  getTextContent(node) {
    if (!this.isElement(node)) {
      return "";
    }

    // ScriptTag and StyleTag have a value property containing the content
    if (
      node.type === NODE_TYPES.ScriptTag ||
      node.type === NODE_TYPES.StyleTag
    ) {
      if (node.value && node.value.value) {
        return node.value.value;
      }
    }

    return "";
  }

  /**
   * Get child elements of a node
   *
   * @param {Tag | StyleTag | ScriptTag} node - Parent node
   * @returns {Tag["children"]} - Array of child element nodes (excluding
   *   text/comment nodes)
   */
  getChildren(node) {
    if (node.type !== NODE_TYPES.Tag || !node.children) {
      return [];
    }

    return node.children.filter((child) => this.isElement(child));
  }

  /**
   * Get parent element of a node
   *
   * @param {AnyNode} node - Child node
   * @returns {any | null} - Parent element node, or null if no parent
   */
  getParent(node) {
    return node && node.parent ? node.parent : null;
  }

  /**
   * Get sibling elements of a node
   *
   * @param {AnyNode} node - Element node
   * @returns {AnyNode[]} - Array of sibling element nodes (excluding the node
   *   itself)
   */
  getSiblings(node) {
    const parent = this.getParent(node);
    if (!parent) {
      return [];
    }

    const children = this.getChildren(parent);
    return children.filter((child) => child !== node);
  }

  /**
   * Get source location for a node
   *
   * @param {any} node - Element node
   * @returns {{
   *   line: number;
   *   column: number;
   *   endLine?: number;
   *   endColumn?: number;
   * } | null}
   */
  getLocation(node) {
    if (!node || !node.loc) {
      return null;
    }

    return {
      line: node.loc.start.line,
      column: node.loc.start.column,
      endLine: node.loc.end.line,
      endColumn: node.loc.end.column,
    };
  }

  /**
   * Stringify element for logging/debugging
   *
   * @param {AnyNode} node - Element node
   * @returns {string} - String representation like "<meta charset='utf-8'>"
   */
  /* istanbul ignore next */
  stringify(node) {
    if (!this.isElement(node)) {
      return "";
    }

    const tagName = this.getTagName(node);
    const attrNames = this.getAttributeNames(node);

    if (attrNames.length === 0) {
      return `<${tagName}>`;
    }

    const attrs = attrNames
      .map((name) => {
        const value = this.getAttribute(node, name);
        if (value === null) {
          return name;
        }
        return `${name}="${value}"`;
      })
      .join(" ");

    return `<${tagName} ${attrs}>`;
  }
}

module.exports = { HtmlEslintAdapter };
