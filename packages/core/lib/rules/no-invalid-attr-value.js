/**
 * @import {
 *   ElementNodeAdapter,
 *   NoInvalidAttrValueOptions,
 *   NoInvalidAttrValueResult
 * } from "../types"
 */

import { element } from "html-standard";

/**
 * @type {{
 *   invalid: "invalid";
 * }}
 */
export const NO_INVALID_ATTR_VALUE_MESSAGE_IDS = {
  invalid: "invalid",
};

/**
 * @template ElementNode
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
     * @param {ElementNodeAdapter<
     *   ElementNode,
     *   AttributeKeyNode,
     *   AttributeValueNode
     * >} adapter
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
        if (attribute.key.isExpression()) {
          continue;
        }

        if (attribute.value.isExpression()) {
          continue;
        }

        const attrKeyValue = attribute.key.value();
        const attrValueValue = attribute.value.value();

        if (
          attrKeyValue &&
          attrValueValue !== null &&
          shouldAllow(name, attrKeyValue, attrValueValue)
        ) {
          continue;
        }
        if (!attrKeyValue || attrValueValue === null) {
          continue;
        }
        const validator = spec.attributes.get(attrKeyValue);
        if (validator) {
          const validateResult = validator.validateValue(attrValueValue);
          if (!validateResult.valid) {
            result.push({
              node: attribute.value.node() || attribute.key.node(),
              messageId: NO_INVALID_ATTR_VALUE_MESSAGE_IDS.invalid,
              data: {
                value: attrValueValue || "",
                attr: attrKeyValue,
                element: name,
                suggestion: validateResult.reason || "Use a valid value.",
              },
            });
          }
        }
      }
      return result;
    },
  };
}
