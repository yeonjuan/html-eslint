/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").Tag } Tag
 */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { findAttr } = require("./utils/node");

const MESSAGE_IDS = {
  MISSING: "missingLabel",
};

const INPUT_TAGS = new Set(["input", "textarea", "select"]);

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforces the use of label for `<input>` tag",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.MISSING]: "Missing an associated label",
    },
  },
  create(context) {
    return createVisitors(context, {
      Tag(node) {
        if (!INPUT_TAGS.has(node.name.toLowerCase())) {
          return;
        }

        const idAttr = findAttr(node, "id");

        if (idAttr && idAttr.value) {
          return;
        }

        const typeAttr = findAttr(node, "type");

        if (typeAttr && typeAttr.value && typeAttr.value.value === "hidden") {
          return;
        }
      },
    });
  },
};
