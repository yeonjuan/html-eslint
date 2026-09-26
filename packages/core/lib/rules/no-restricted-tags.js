/**
 * @import {
 *   ElementAdapter,
 *   NoRestrictedTagsOptions,
 *   NoRestrictedTagsResult
 * } from "../types"
 */

/**
 * @type {{
 *   restricted: "restricted";
 * }}
 */
export const NO_RESTRICTED_TAGS_MESSAGE_IDS = {
  restricted: "restricted",
};

class PatternChecker {
  /** @param {NoRestrictedTagsOptions[number]} option */
  constructor(option) {
    this.option = option;
    this.tagRegExps = option.tagPatterns.map(
      (pattern) => new RegExp(pattern, "u")
    );
    this.message = option.message;
  }

  /**
   * @param {string} tagName
   * @returns {boolean}
   */
  test(tagName) {
    return this.tagRegExps.some((exp) => exp.test(tagName));
  }

  /** @returns {string} */
  getMessage() {
    return this.message || "";
  }
}

/** @param {NoRestrictedTagsOptions} options */
export function noRestrictedTags(options) {
  const checkers = options.map((option) => new PatternChecker(option));

  return {
    /**
     * @param {ElementAdapter} adapter
     * @returns {NoRestrictedTagsResult}
     */
    checkElement(adapter) {
      const tagName = adapter.getElementName();

      const matched = checkers.find((checker) => checker.test(tagName));

      if (!matched) {
        return [];
      }

      const customMessage = matched.getMessage();

      if (customMessage) {
        return [
          {
            loc: adapter.getOpenStartLocation(),
            message: customMessage,
            data: { tag: tagName },
          },
        ];
      }

      return [
        {
          loc: adapter.getOpenStartLocation(),
          messageId: NO_RESTRICTED_TAGS_MESSAGE_IDS.restricted,
          data: { tag: tagName },
        },
      ];
    },
  };
}
