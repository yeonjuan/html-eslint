/**
 * @typedef {import("../types").ElementNode} ElementNode
 * @typedef {import("../types").AnyNode} AnyNode
 * @typedef {import("../types").Context} Context
 */

const { RULE_CATEGORY, NODE_TYPES } = require("../constants");

const MESSAGE_IDS = {
  EXPECT_NEW_LINE_AFTER: "expectAfter",
  EXPECT_NEW_LINE_BEFORE: "expectBefore",
};

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforce newline between elements.",
      category: RULE_CATEGORY.STYLE,
      recommended: true,
    },

    fixable: true,
    schema: [],
    messages: {
      [MESSAGE_IDS.EXPECT_NEW_LINE_AFTER]:
        "There should be a linebreak after {{tag}}.",
      [MESSAGE_IDS.EXPECT_NEW_LINE_BEFORE]:
        "There should be a linebreak before {{tag}}.",
    },
  },

  /**
   * @param {Context} context
   */
  create(context) {
    function checkSiblings(siblings) {
      siblings
        .filter((node) => node.type !== NODE_TYPES.TEXT && node.range[0])
        .forEach((current, index, arr) => {
          const after = arr[index + 1];
          if (after) {
            if (isOnTheSameLine(current, after)) {
              context.report({
                node: current,
                messageId: MESSAGE_IDS.EXPECT_NEW_LINE_AFTER,
                data: { tag: `<${current.tagName}>` },
                fix(fixer) {
                  return fixer.insertTextAfter(current, "\n");
                },
              });
            }
          }
        });
    }

    /**
     *
     * @param {ElementNode['childNodes'][number]} node
     */
    function checkChild(node) {
      const children = (node.childNodes || []).filter(
        (n) => !!n.range[0] && n.type !== NODE_TYPES.TEXT
      );
      const first = children[0];
      const last = children[children.length - 1];
      if (first) {
        if (node.startTag && isOnTheSameLine(node.startTag, first)) {
          context.report({
            node: node.startTag,
            messageId: MESSAGE_IDS.EXPECT_NEW_LINE_AFTER,
            data: { tag: `<${node.tagName}>` },
            fix(fixer) {
              if (node.startTag) {
                return fixer.insertTextAfter(node.startTag, "\n");
              }
              return null;
            },
          });
        }
      }
      if (last) {
        if (node.endTag && isOnTheSameLine(node.endTag, last)) {
          context.report({
            node: node.endTag,
            messageId: MESSAGE_IDS.EXPECT_NEW_LINE_BEFORE,
            data: { tag: `</${node.tagName}>` },
            fix(fixer) {
              if (node.endTag) {
                return fixer.insertTextBefore(node.endTag, "\n");
              }
              return null;
            },
          });
        }
      }
    }
    return {
      /**
       * @param {ElementNode} node
       */
      "*"(node) {
        if (node.type !== NODE_TYPES.TEXT) {
          checkSiblings(node.childNodes || []);
          checkChild(node);
        }
      },
    };
  },
};

/**
 * Checks whether two nodes are on the same line or not.
 * @param {AnyNode} nodeBefore A node before
 * @param {AnyNode} nodeAfter  A node after
 * @returns {boolean} `true` if two nodes are on the same line, otherwise `false`.
 */
function isOnTheSameLine(nodeBefore, nodeAfter) {
  if (nodeBefore && nodeAfter) {
    // @ts-ignore
    if (nodeBefore.endTag) {
      // @ts-ignore
      return nodeBefore.endTag.loc.end.line === nodeAfter.loc.start.line;
    }
    return nodeBefore.loc.start.line === nodeAfter.loc.start.line;
  }
  return false;
}
