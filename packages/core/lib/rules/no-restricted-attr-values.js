/**
 * @import {
 *   ElementAdapter,
 *   NoRestrictedAttrValuesOptions,
 *   NoRestrictedAttrValuesResult
 * } from "../types"
 */

/**
 * @type {{
 *   restricted: "restricted";
 * }}
 */
export const NO_RESTRICTED_ATTR_VALUES_MESSAGE_IDS = {
  restricted: "restricted",
};

class PatternChecker {
  /** @param {NoRestrictedAttrValuesOptions[number]} option */
  constructor(option) {
    this.option = option;
    this.attrRegExps = option.attrPatterns.map(
      (pattern) => new RegExp(pattern, "u")
    );
    this.valueRegExps = option.attrValuePatterns.map(
      (pattern) => new RegExp(pattern, "u")
    );
    this.message = option.message;
  }

  /**
   * @param {string} attrName
   * @param {string} attrValue
   * @returns {boolean}
   */
  test(attrName, attrValue) {
    return (
      this.attrRegExps.some((exp) => exp.test(attrName)) &&
      this.valueRegExps.some((exp) => exp.test(attrValue))
    );
  }

  /** @returns {string} */
  getMessage() {
    return this.message || "";
  }
}

/** @param {NoRestrictedAttrValuesOptions} options */
export function noRestrictedAttrValues(options) {
  const checkers = options.map((option) => new PatternChecker(option));

  return {
    /**
     * @param {ElementAdapter} adapter
     * @returns {NoRestrictedAttrValuesResult}
     */
    checkAttributes(adapter) {
      /** @type {NoRestrictedAttrValuesResult} */
      const result = [];

      for (const attribute of adapter.getAttributes()) {
        const key = attribute.getKey();
        if (!key || key.hasExpression()) {
          continue;
        }
        const attrName = key.getValue();
        if (!attrName) {
          continue;
        }

        const valueAdapter = attribute.getValue();
        if (!valueAdapter || valueAdapter.hasExpression()) {
          continue;
        }

        const attrValue = valueAdapter.getValue();
        if (attrValue === null) {
          continue;
        }

        const matched = checkers.find((checker) =>
          checker.test(attrName, attrValue)
        );

        if (!matched) {
          continue;
        }

        const customMessage = matched.getMessage();

        if (customMessage) {
          result.push({
            loc: valueAdapter.getLocation(),
            message: customMessage,
            data: { attrValuePatterns: attrValue },
          });
        } else {
          result.push({
            loc: valueAdapter.getLocation(),
            messageId: NO_RESTRICTED_ATTR_VALUES_MESSAGE_IDS.restricted,
            data: { attrValuePatterns: attrValue },
          });
        }
      }

      return result;
    },
  };
}
