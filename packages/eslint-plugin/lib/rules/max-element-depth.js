/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").Tag } Tag
 * @typedef { import("../types").StyleTag } StyleTag
 * @typedef { import("../types").ScriptTag } ScriptTag
 */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");

const MESSAGE_IDS = {
  MAX_DEPTH_EXCEEDED: "maxDepthExceeded",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforce element maximum depth",
      category: RULE_CATEGORY.STYLE,
      recommended: false,
    },

    fixable: null,
    schema: [
      {
        type: "object",
        properties: {
          max: {
            type: "integer",
            minimum: 0,
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
    return createVisitors(context, {});
  },
};
