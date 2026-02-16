/**
 * @import {
 *   ElementNodeAdapter,
 *   NoInvalidAttrValueOptions,
 *   NoInvalidAttrValueResult
 * } from "../types"
 */

import { element } from "html-standard";

/**
 * @template AttributeKeyNode
 * @template AttributeValueNode
 * @param {NoInvalidAttrValueOptions} options
 */
export function noInvalidAttrValue(options) {
  const allowList = options.allow || [];
  const compiledAllowList = allowList.map((rule) => ({
    tag: rule.tag.toLowerCase(),
    attr: rule.attr.toLowerCase(),
    valuePattern: rule.valuePattern ? new RegExp(rule.valuePattern) : undefined,
  }));

  /**
   * @param {string} elementName
   * @param {string} attrKey
   * @param {string} attrValue
   * @returns
   */
  function shouldAllow(elementName, attrKey, attrValue) {
    return compiledAllowList.some((allowRule) => {
      const tagMatch = allowRule.tag === elementName.toLowerCase();
      const attrMatch = allowRule.attr === attrKey.toLowerCase();

      if (!tagMatch || !attrMatch) {
        return false;
      }

      if (allowRule.valuePattern === undefined) {
        return true;
      }

      return allowRule.valuePattern.test(attrValue);
    });
  }

  return {
    /**
     * @param {ElementNodeAdapter<AttributeKeyNode, AttributeValueNode>} adapter
     * @returns {NoInvalidAttrValueResult<
     *   AttributeKeyNode,
     *   AttributeValueNode
     * >}
     */
    checkAttributes(adapter) {
      const name = adapter.getTagName();
      if (name.includes("-")) {
        return [];
      }
      const spec = element(name);
      /**
       * @type {NoInvalidAttrValueResult<
       *   AttributeKeyNode,
       *   AttributeValueNode
       * >}
       */
      const result = [];

      for (const attribute of adapter.getAttributes()) {
        const attrKey = attribute.key();
        if (attrKey.isExpression()) {
          continue;
        }

        const attrValue = attribute.value();

        if (attrValue.isExpression()) {
          continue;
        }

        if (
          attrKey.value &&
          attrValue.value &&
          shouldAllow(name, attrKey.value, attrValue.value)
        ) {
          continue;
        }
        if (!attrKey.value || !attrValue.value) {
          continue;
        }
        const validator = spec.attributes.get(attrKey.value);
        if (validator) {
          const validateResult = validator.validateValue(attrValue.value);
          if (!validateResult.valid) {
            result.push({
              keyNode: attrKey.node,
              valueNode: attrValue.node,
              elementName: name,
              reason: validateResult.reason || "Use a valid value.",
            });
          }
        }
      }
      return result;
    },
  };
}
