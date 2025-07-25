/**
 * @import {Tag, StyleTag, ScriptTag} from "@html-eslint/types";
 * @import {RuleModule} from "../types";
 *
 * @typedef {Object} Option
 * @property {number} [Option.max]
 */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  MAX_DEPTH_EXCEEDED: "maxDepthExceeded",
};

/**
 * @type {RuleModule<[Option]>}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforce element maximum depth",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
      url: getRuleUrl("max-element-depth"),
    },

    fixable: null,
    schema: [
      {
        type: "object",
        properties: {
          max: {
            type: "integer",
            minimum: 1,
            default: 32,
          },
        },
        required: ["max"],
        additionalProperties: false,
      },
    ],
    messages: {
      [MESSAGE_IDS.MAX_DEPTH_EXCEEDED]:
        "Expected the depth of nested elements to be <= {{needed}}, but found {{found}}",
    },
  },

  create(context) {
    const maxDepth =
      context.options &&
      context.options[0] &&
      typeof context.options[0].max === "number"
        ? context.options[0].max
        : 32;

    let depth = 0;

    function resetDepth() {
      depth = 0;
    }

    /**
     *
     * @param {Tag | ScriptTag | StyleTag} node
     */
    function increaseDepth(node) {
      depth++;
      if (depth > maxDepth) {
        context.report({
          node,
          messageId: MESSAGE_IDS.MAX_DEPTH_EXCEEDED,
          data: {
            needed: `${maxDepth}`,
            found: String(depth),
          },
        });
      }
    }

    function decreaseDepth() {
      depth--;
    }

    return createVisitors(context, {
      Document: resetDepth,
      "Document:exit": resetDepth,
      Tag: increaseDepth,
      "Tag:exit": decreaseDepth,
      ScriptTag: increaseDepth,
      "ScriptTag:exit": decreaseDepth,
      StyleTag: increaseDepth,
      "StyleTag:exit": decreaseDepth,
    });
  },
};
