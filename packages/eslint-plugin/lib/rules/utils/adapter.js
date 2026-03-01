/**
 * @import {
 *   AttributeAdapter,
 *   ElementNodeAdapter
 * } from "@html-eslint/core"
 * @import {
 *   AttributeKey,
 *   AttributeValue,
 *   OpenScriptTagStart,
 *   OpenStyleTagStart,
 *   OpenTagStart,
 *   ScriptTag,
 *   StyleTag,
 *   Tag
 * } from "@html-eslint/types"
 */

const { getNameOf, hasTemplate } = require("./node");

/**
 * @param {AttributeKey} key
 * @param {AttributeValue | undefined} value
 * @returns {AttributeAdapter<AttributeKey, AttributeValue>}
 */
function attributeNodeAdapter(key, value) {
  return {
    key: {
      node: () => key,
      isExpression() {
        return hasTemplate(key);
      },
      value: () => key.value.toLowerCase(),
      raw: () => key.value,
    },
    value: {
      node: () => value || null,
      isExpression() {
        return value ? hasTemplate(value) : false;
      },
      value: () => value?.value ?? "",
    },
  };
}

/**
 * @param {ScriptTag | StyleTag | Tag} node
 * @returns {ElementNodeAdapter<
 *   | ScriptTag
 *   | StyleTag
 *   | Tag
 *   | OpenTagStart
 *   | OpenScriptTagStart
 *   | OpenStyleTagStart,
 *   AttributeKey,
 *   AttributeValue
 * >}
 */
function elementNodeAdapter(node) {
  return {
    node: () => node.openStart,
    getTagName() {
      return getNameOf(node);
    },
    getAttributes() {
      return node.attributes.map((attribute) => {
        return attributeNodeAdapter(attribute.key, attribute.value);
      });
    },
  };
}

module.exports = { elementNodeAdapter, attributeNodeAdapter };
