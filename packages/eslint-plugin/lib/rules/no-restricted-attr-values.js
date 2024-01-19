/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").StyleTagNode } StyleTagNode
 * @typedef { import("../types").AttributeNode } AttributeNode
 * @typedef { import("../types").TagNode } TagNode
 * @typedef { import("../types").ScriptTagNode } ScriptTagNode
 * @typedef {{attrPatterns: string[], attrValuePatterns: string[], message?: string}[]} Options
 */

const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  RESTRICTED: "restricted",
};

/**
 * @type {RuleModule}
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
        required: ["attrPatterns", "attrValuePatterns"],
        properties: {
          attrPatterns: {
            type: "array",
            items: {
              type: "string",
            },
          },
          attrValuePatterns: {
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
        "'{{attrValuePatterns}}' is restricted from being used.",
    },
  },

  create(context) {
    /**
     * @type {Options}
     */
    const options = context.options;
    const checkers = options.map((option) => new PatternChecker(option));

    return {
      /**
       * @param {TagNode | StyleTagNode | ScriptTagNode} node
       */
      [["Tag", "StyleTag", "ScriptTag"].join(",")](node) {
        node.attributes.forEach((attr) => {
          if (
            !attr.key ||
            !attr.key.value ||
            !attr.value ||
            typeof attr.value.value !== "string"
          ) {
            return;
          }

          const matched = checkers.find(
            (checker) =>
              attr.value && checker.test(attr.key.value, attr.value.value)
          );

          if (!matched) {
            return;
          }

          /**
           * @type {{node: AttributeNode, message: string, messageId?: string}}
           */
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
            data: { attrValuePatterns: attr.value.value },
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
