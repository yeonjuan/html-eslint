/**
 * @typedef {import("../types").Rule} Rule
 * @typedef {import("../types").AnyNode} AnyNode
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
      "*"(node) {
        const tagName = node.tagName;
        const startTag = node.startTag;
        if (!tagName || !startTag) return;
        if (!node.attrs.length) return;

        node.attrs.forEach((attr) => {
          if (!attr.name) return;

          const matched = checkers.find((checker) =>
            checker.test(node.tagName, attr.name)
          );

          if (!matched) return;

          /**
           * @type {{node: AnyNode, message: string, messageId?: string}}
           */

          const result = {
            node: startTag,
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
            data: { attr: attr.name },
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
