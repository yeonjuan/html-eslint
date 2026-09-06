/**
 * @import {
 *   AttributeAdapter,
 *   ElementAdapter,
 *   NoRestrictedAttrsOptions,
 *   NoRestrictedAttrsResult
 * } from "../types"
 */

/**
 * @type {{
 *   restricted: "restricted";
 * }}
 */
export const NO_RESTRICTED_ATTRS_MESSAGE_IDS = {
  restricted: "restricted",
};

class PatternChecker {
  /** @param {NoRestrictedAttrsOptions[number]} option */
  constructor(option) {
    this.option = option;
    this.tagRegExps = option.tagPatterns.map(
      (pattern) => new RegExp(pattern, "u")
    );
    this.attrRegExps = option.attrPatterns.map(
      (pattern) => new RegExp(pattern, "u")
    );
    this.message = option.message;
  }

  /**
   * @param {string} tagName
   * @param {string} attrName
   * @returns {boolean}
   */
  test(tagName, attrName) {
    return (
      this.tagRegExps.some((exp) => exp.test(tagName)) &&
      this.attrRegExps.some((exp) => exp.test(attrName))
    );
  }

  /** @returns {string} */
  getMessage() {
    return this.message || "";
  }
}

/** @param {NoRestrictedAttrsOptions} options */
export function noRestrictedAttrs(options) {
  const checkers = options.map((option) => new PatternChecker(option));

  return {
    /**
     * @param {ElementAdapter} adapter
     * @returns {NoRestrictedAttrsResult}
     */
    checkAttributes(adapter) {
      const tagName = adapter.getElementName();

      /** @type {NoRestrictedAttrsResult} */
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

        const matched = checkers.find((checker) =>
          checker.test(tagName, attrName)
        );

        if (!matched) {
          continue;
        }

        const customMessage = matched.getMessage();

        if (customMessage) {
          result.push({
            loc: key.getLocation(),
            message: customMessage,
            data: { attr: attrName },
          });
        } else {
          result.push({
            loc: key.getLocation(),
            messageId: NO_RESTRICTED_ATTRS_MESSAGE_IDS.restricted,
            data: { attr: attrName },
          });
        }
      }

      return result;
    },
  };
}
