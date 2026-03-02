/**
 * @import {
 *   Attribute,
 *   AttributeKey,
 *   AttributeValue,
 *   ScriptTag,
 *   StyleTag,
 *   Tag
 * } from "@html-eslint/types"
 */

const { HTMLAttributeAdapter } = require("./attribute");
const { HTMLAttributeKeyAdapter } = require("./attribute-key");
const { HTMLAttributeValueAdapter } = require("./attribute-value");
const { HTMLElementAdapter } = require("./element");

/** @param {ScriptTag | StyleTag | Tag} node */
function createElementAdapter(node) {
  return new HTMLElementAdapter(node);
}

/** @param {Attribute} node */
function createAttributeAdapter(node) {
  return new HTMLAttributeAdapter(node);
}

/** @param {AttributeKey} node */
function createAttributeKeyAdapter(node) {
  return new HTMLAttributeKeyAdapter(node);
}

/** @param {AttributeValue} node */
function createAttributeValueAdapter(node) {
  return new HTMLAttributeValueAdapter(node);
}

module.exports = {
  createElementAdapter,
  createAttributeAdapter,
  createAttributeKeyAdapter,
  createAttributeValueAdapter,
};
