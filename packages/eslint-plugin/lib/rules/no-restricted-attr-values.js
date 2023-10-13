/**
 * @typedef {import("../types").Rule} Rule
 * @typedef {{attrPatterns: string[], attrValues: string[], message?: string}[]} Options
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
        required: ["attrPatterns", "attrValues"],
        properties: {
          attrPatterns: {
            type: "array",
            items: {
              type: "string",
            },
          },
          attrValues: {
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
      [MESSAGE_IDS.RESTRICTED]:
        "'{{attrValues}}' is restricted from being used.",
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
        node.attributes.forEach((attr) => {
          if (!attr.key || typeof attr.value?.value !== "string" || !attr.key?.value) {
            return;
          }
          const matched = checkers.find((checker) =>
            checker.test(attr.key.value, attr.value.value)
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
            data: { attrValues: attr.value.value },
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
    this.attrRegExps = option.attrPatterns.map(
      (pattern) => new RegExp(pattern, "u")
    );

    this.valueRegExps = option.attrValues.map(
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
    const result =
      this.attrRegExps.some((exp) => exp.test(attrName)) &&
      this.valueRegExps.some((exp) => exp.test(attrValue));
    return result;
  }

  /**
   * @returns {string}
   */
  getMessage() {
    return this.message || "";
  }
}
