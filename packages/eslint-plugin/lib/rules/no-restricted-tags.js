/**
 * @import {StyleTag, Tag, ScriptTag} from "@html-eslint/types";
 * @import {RuleModule} from "../types";
 * @typedef {{tagPatterns: string[], message?: string}[]} Options
 *
 */

const { NODE_TYPES } = require("@html-eslint/parser");
const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  RESTRICTED: "restricted",
};

/**
 * @type {RuleModule<Options>}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow specified tags",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
      url: getRuleUrl("no-restricted-tags"),
    },

    fixable: null,
    schema: {
      type: "array",

      items: {
        type: "object",
        required: ["tagPatterns"],
        properties: {
          tagPatterns: {
            type: "array",
            items: {
              type: "string",
            },
          },
          message: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    },
    messages: {
      [MESSAGE_IDS.RESTRICTED]: "'{{tag}}' tag is restricted from being used.",
    },
  },

  create(context) {
    /**
     * @type {Options}
     */
    const options = context.options;
    const checkers = options.map((option) => new PatternChecker(option));

    /**
     * @param {Tag | StyleTag | ScriptTag} node
     */
    function check(node) {
      const tagName =
        node.type === NODE_TYPES.Tag
          ? node.name
          : node.type === NODE_TYPES.ScriptTag
            ? "script"
            : "style";

      const matched = checkers.find((checker) => checker.test(tagName));

      if (!matched) {
        return;
      }

      /**
       * @type {{node: Tag | StyleTag | ScriptTag, message: string, messageId?: string}}
       */
      const result = {
        node: node,
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
        data: { tag: tagName },
      });
    }

    return createVisitors(context, {
      Tag: check,
      StyleTag: check,
      ScriptTag: check,
    });
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
    this.message = option.message;
  }

  /**
   * @param {string} tagName
   * @returns {boolean}
   */
  test(tagName) {
    const result = this.tagRegExps.some((exp) => exp.test(tagName));
    return result;
  }

  /**
   * @returns {string}
   */
  getMessage() {
    return this.message || "";
  }
}
