/**
 * @import {RuleModule} from "../types";
 * @import {Tag} from "@html-eslint/types";
 */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { findParent, isTag } = require("./utils/node");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  MISSING: "missingLabel",
};

const INPUT_TAGS = new Set(["input", "textarea", "select"]);

const LABEL_ATTRIBUTES = new Set(["id", "aria-labelledby", "aria-label"]);

/**
 * @type {RuleModule<[]>}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description:
        "Enforces use of label for form elements(`input`, `textarea`, `select`)",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
      url: getRuleUrl("require-input-label"),
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

        for (const attr of node.attributes) {
          if (
            LABEL_ATTRIBUTES.has(attr.key.value.toLowerCase()) &&
            attr.value &&
            attr.value.value
          ) {
            return;
          }

          if (
            attr.key.value.toLowerCase() === "type" &&
            attr.value &&
            attr.value.value === "hidden"
          ) {
            return;
          }
        }

        const label = findParent(node, (parent) => {
          return isTag(parent) && parent.name.toLowerCase() === "label";
        });

        if (label) {
          return;
        }

        context.report({
          node,
          messageId: "missingLabel",
        });
      },
    });
  },
};
