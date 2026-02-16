/**
 * @import {ElementNodeAdapter} from "@html-eslint/core"
 * @import {
 *   AttributeKey,
 *   AttributeValue,
 *   ScriptTag,
 *   StyleTag,
 *   Tag
 * } from "@html-eslint/types"
 */

const { getNameOf, hasTemplate } = require("./node");

/**
 * @param {ScriptTag | StyleTag | Tag} node
 * @returns {ElementNodeAdapter<AttributeKey, AttributeValue>}
 */
function elementNodeAdapter(node) {
  return {
    getTagName() {
      return getNameOf(node);
    },
    getAttributes() {
      return node.attributes.map((attribute) => {
        if (attribute.value && hasTemplate(attribute.value)) {
          return {
            key: {
              node: attribute.key,
              isExpression: false,
              value: attribute.key.value,
            },
            value: {
              node: null,
              isExpression: true,
              value: null,
            },
          };
        }

        return {
          key: {
            node: attribute.key,
            isExpression: false,
            value: attribute.key.value,
          },
          value: {
            node: attribute.value || null,
            isExpression: false,
            value: attribute.value ? attribute.value.value : "",
          },
        };
      });
    },
  };
}

module.exports = { elementNodeAdapter };
