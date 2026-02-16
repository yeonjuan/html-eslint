/** @import {ElementNodeAdapter} from "../types" */
/**
 * @typedef {Object} NoInvalidAttrValueOptions
 * @property {{ tag: string; attr: string; valuePattern?: string }[]} [allow]
 */
/**
 * @template T
 * @typedef {{ node: T; reason: string }[]} NoInvalidAttrValueResult
 */

import { element } from "html-standard";

/**
 * @template AttributeNode
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
    /** @param {ElementNodeAdapter<AttributeNode>} adapter */
    checkAttributes(adapter) {
      const name = adapter.getTagName();
      const spec = element(name);
      /** @type {NoInvalidAttrValueResult<AttributeNode>} */
      const result = [];

      for (const attribute of adapter.getAttributes()) {
        const attrKey = attribute.getKey();
        const attrValue = attribute.getValue();
        if (shouldAllow(name, attrKey, attrValue)) {
          continue;
        }
        const validator = spec.attributes.get(attrKey);
        if (validator) {
          const validateResult = validator.validateValue(attribute.getValue());
          if (validateResult) {
            result.push({
              node: attribute.node,
              reason: validateResult.reason || "Use a valid value.",
            });
          }
        }
      }
    },
  };
}
