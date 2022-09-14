/**
 * @typedef {import("../types").Rule} Rule
 * @typedef {{tagPatterns: string[], attrPatterns: string[], message?: string}[]} Options
 */

const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  RESTRICTED: "restricted",
};

/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow specified attributes",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },

    fixable: null,
    schema: {
      type: "array",

      items: {
        type: "object",
        required: ["tagPatterns", "attrPatterns"],
        properties: {
          tagPatterns: {
            type: "array",
            items: {
              type: "string",
            },
          },
          attrPatterns: {
            type: "array",
            items: {
              type: "string",
            },
          },
          message: {
            type: "string",
          },
        },
      },
    },
    messages: {
      [MESSAGE_IDS.RESTRICTED]: "'{{attr}}' is restricted from being used.",
    },
  },

  create(context) {
    /**
     * @type {Options}
     */
    const options = context.options;
    const checkers = options.map((option) => new PatternChecker(option));

    return {
      [["Tag", "StyleTag", "ScriptTag"].join(",")](node) {
        const tagName = node.name;
        node.attributes.forEach((attr) => {
          if (!attr.key || !attr.key.value) {
            return;
          }
          const matched = checkers.find((checker) =>
            checker.test(tagName, attr.key.value)
          );

          if (!matched) {
            return;
          }

          const result = {
            node: attr,
            message: "",
          };

          const customMessage = matched.getMessage();

          if (customMessage) {
            result.message = customMessage;
          } else {
            result.messageId = MESSAGE_IDS.RESTRICTED;
          }

          context.report({
            ...result,
            data: { attr: attr.key.value },
          });
        });
      },
    };
  },
};

class PatternChecker {
  /**
   * @param {Options[number]} option
   */
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
    const result =
      this.tagRegExps.some((exp) => exp.test(tagName)) &&
      this.attrRegExps.some((exp) => exp.test(attrName));
    return result;
  }

  /**
   * @returns {string}
   */
  getMessage() {
    return this.message || "";
  }
}
