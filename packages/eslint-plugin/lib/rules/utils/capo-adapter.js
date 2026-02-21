/**
 * @file HTML ESLint adapter for capo.js
 *
 * This adapter bridges HTML ESLint AST nodes with capo.js API.
 * It implements the HTMLAdapter interface required by capo.js.
 */

const { NODE_TYPES } = require("@html-eslint/parser");
const { findAttr } = require("./node");

/**
 * Adapter for HTML ESLint AST nodes to work with capo.js
 */
class HtmlEslintAdapter {
  /**
   * Check if node is an Element (Tag, ScriptTag, or StyleTag)
   * @param {any} node - The node to check
   * @returns {boolean}
   */
  isElement(node) {
    return (
      node &&
      (node.type === NODE_TYPES.Tag ||
        node.type === NODE_TYPES.ScriptTag ||
        node.type === NODE_TYPES.StyleTag)
    );
  }

  /**
   * Get the tag name of an element (lowercase)
   * @param {any} node - Element node
   * @returns {string} - Tag name like 'meta', 'link', 'script'
   */
  getTagName(node) {
    if (!this.isElement(node)) {
      return "";
    }

    // ScriptTag and StyleTag nodes don't have a name property
    if (node.type === NODE_TYPES.ScriptTag) {
      return "script";
    }
    if (node.type === NODE_TYPES.StyleTag) {
      return "style";
    }

    // Regular Tag nodes have a name property
    if (node.name) {
      return node.name.toLowerCase();
    }

    return "";
  }

  /**
   * Get attribute value from element
   * @param {any} node - Element node
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
   * @param {any} node - Element node
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
   * Get all attribute names for an element
   * @param {any} node - Element node
   * @returns {string[]} - Array of attribute names
   */
  getAttributeNames(node) {
    if (!this.isElement(node) || !node.attributes) {
      return [];
    }

    return node.attributes
      .filter(
        /** @param {any} attr */
        (attr) => attr.type === "Attribute" && attr.key
      )
      .map(
        /** @param {any} attr */
        (attr) => attr.key.value
      );
  }

  /**
   * Get text content of a node (for inline scripts/styles)
   * @param {any} node - Element node
   * @returns {string} - Text content
   */
  getTextContent(node) {
    if (!this.isElement(node)) {
      return "";
    }

    // ScriptTag and StyleTag have a value property containing the content
    if (node.type === NODE_TYPES.ScriptTag || node.type === NODE_TYPES.StyleTag) {
      if (node.value && node.value.value) {
        return node.value.value;
      }
    }

    return "";
  }

  /**
   * Get child elements of a node
   * @param {any} node - Parent node
   * @returns {any[]} - Array of child element nodes (excluding text/comment nodes)
   */
  getChildren(node) {
    if (!node || !node.children) {
      return [];
    }

    return node.children.filter(
      /** @param {any} child */
      (child) => this.isElement(child)
    );
  }

  /**
   * Get parent element of a node
   * @param {any} node - Child node
   * @returns {any | null} - Parent element node, or null if no parent
   */
  getParent(node) {
    return node && node.parent ? node.parent : null;
  }

  /**
   * Get sibling elements of a node
   * @param {any} node - Element node
   * @returns {any[]} - Array of sibling element nodes (excluding the node itself)
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
   * @param {any} node - Element node
   * @returns {{ line: number, column: number, endLine?: number, endColumn?: number } | null}
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
   * @param {any} node - Element node
   * @returns {string} - String representation like "<meta charset='utf-8'>"
   */
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
