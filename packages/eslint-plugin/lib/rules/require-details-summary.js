/**
 * @import {
 *   Tag
 * } from "@html-eslint/types"
 * @import {RuleModule} from "../types"
 */

const { RULE_CATEGORY } = require("../constants");
const { isTag } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  MISSING_SUMMARY: "missingSummary",
  SUMMARY_NOT_FIRST: "summaryNotFirst",
};

/**
 * Returns the first element child of a node (skipping text/comment nodes).
 *
 * @param {Tag} node
 * @returns {Tag | null}
 */
function firstElementChild(node) {
  for (const child of node.children) {
    if (isTag(child)) return child;
  }
  return null;
}

/** @type {RuleModule} */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description:
        "Require `<details>` elements to have a `<summary>` as their first child element.",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
      url: getRuleUrl("require-details-summary"),
    },
    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.MISSING_SUMMARY]:
        "The <details> element must contain a <summary> child element.",
      [MESSAGE_IDS.SUMMARY_NOT_FIRST]:
        "The <summary> element must be the first child element of <details>.",
    },
  },
  create(context) {
    return createVisitors(context, {
      Tag(node) {
        if (node.name.toLowerCase() !== "details") return;

        const first = firstElementChild(node);

        if (!first) {
          // <details> with no element children at all
          context.report({ node, messageId: MESSAGE_IDS.MISSING_SUMMARY });
          return;
        }

        if (first.name.toLowerCase() !== "summary") {
          // Has element children but <summary> is not first (or absent)
          const hasSummary = node.children.some(
            (child) => isTag(child) && child.name.toLowerCase() === "summary"
          );
          context.report({
            node: first,
            messageId: hasSummary
              ? MESSAGE_IDS.SUMMARY_NOT_FIRST
              : MESSAGE_IDS.MISSING_SUMMARY,
          });
        }
      },
    });
  },
};
