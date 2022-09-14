/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");
const { NodeUtils } = require("./utils");

const MESSAGE_IDS = {
  MISSING: "missing",
  INVALID: "invalid",
};

const VALID_BUTTON_TYPES_SET = new Set(["submit", "button", "reset"]);

/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Require use of button element with a valid type attribute.",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.MISSING]: "Missing a type attribute for button",
      [MESSAGE_IDS.INVALID]:
        '"{{type}}" is an invalid value for button type attribute.',
    },
  },

  create(context) {
    return {
      Tag(node) {
        if (node.name !== "button") {
          return;
        }
        const typeAttr = NodeUtils.findAttr(node, "type");
        if (!typeAttr || !typeAttr.value) {
          context.report({
            node: node.openStart,
            messageId: MESSAGE_IDS.MISSING,
          });
        } else if (!VALID_BUTTON_TYPES_SET.has(typeAttr.value.value)) {
          context.report({
            node: typeAttr,
            messageId: MESSAGE_IDS.INVALID,
            data: {
              type: typeAttr.value.value,
            },
          });
        }
      },
    };
  },
};
