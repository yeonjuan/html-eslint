/**
 * @import {
 *   ElementAdapter,
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

/** @param {NoInvalidAttrValueOptions} options */
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
     * @param {ElementAdapter} adapter
     * @returns {NoInvalidAttrValueResult}
     */
    checkAttributes(adapter) {
      const name = adapter.getElementName();
      if (name.includes("-")) {
        return [];
      }
      const spec = element(name);
      /** @type {NoInvalidAttrValueResult} */
      const result = [];

      for (const attribute of adapter.getAttributes()) {
        const attributeKey = attribute.getKey();

        if (attributeKey.hasExpression()) {
          continue;
        }

        const attributeValue = attribute.getValue();

        if (attributeValue?.hasExpression()) {
          continue;
        }

        const attrKeyValue = attributeKey.getValue();
        const attrValueValue = attributeValue?.getValue() ?? null;
        if (attrValueValue === null) {
          continue;
        }

        if (attrKeyValue && shouldAllow(name, attrKeyValue, attrValueValue)) {
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
              loc: attributeValue?.getLocation() ?? attributeKey?.getLocation(),
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
