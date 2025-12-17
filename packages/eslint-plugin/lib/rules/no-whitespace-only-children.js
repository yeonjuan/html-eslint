/**
 * @import {
 *   Tag,
 *   Text
 * } from "@html-eslint/types"
 * @import {RuleModule} from "../types"
 */

const { RULE_CATEGORY } = require("../constants");
const { isText, isComment, getLocBetween } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  WHITESPACE_ONLY_CHILDREN: "whitespaceOnlyChildren",
};

/** @param {Tag} node */
function hasOnlyWhitespaceChildren(node) {
  if (!node.children || node.children.length === 0) {
    return false;
  }

  if (node.children.every((child) => isComment(child))) {
    return false;
  }

  for (const child of node.children) {
    if (isComment(child)) {
      continue;
    }
    if (isText(child)) {
      // Check if text contains any non-whitespace characters
      if (child.value && child.value.trim().length > 0) {
        return false;
      }
    } else {
      return false;
    }
  }

  return true;
}

/** @type {RuleModule<[{ tagPatterns?: string[] }]>} */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "Disallow tags with only whitespace children.",
      recommended: false,
      category: RULE_CATEGORY.BEST_PRACTICE,
      url: getRuleUrl("no-whitespace-only-children"),
    },
    fixable: "whitespace",
    schema: [
      {
        type: "object",
        properties: {
          tagPatterns: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [MESSAGE_IDS.WHITESPACE_ONLY_CHILDREN]:
        "Tag should not have only whitespace children.",
    },
  },
  create(context) {
    const options = context.options[0] || {};
    const tagPatterns = (options.tagPatterns || []).map(
      (pattern) => new RegExp(pattern, "u")
    );

    return createVisitors(context, {
      Tag(node) {
        if (!node.close) {
          return;
        }
        if (tagPatterns.length <= 0) {
          return;
        }

        const tagName = node.name.toLowerCase();

        // If tagPatterns is specified, check if tag name matches any pattern
        const matches = tagPatterns.some((pattern) => pattern.test(tagName));
        if (!matches) {
          return;
        }

        if (hasOnlyWhitespaceChildren(node)) {
          const loc = getLocBetween(node.openEnd, node.close);
          context.report({
            loc,
            messageId: MESSAGE_IDS.WHITESPACE_ONLY_CHILDREN,
            fix(fixer) {
              return node.children
                .filter((child) => isText(child))
                .map((child) => fixer.removeRange(child.range));
            },
          });
        }
      },
    });
  },
};
