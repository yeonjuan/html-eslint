/**
 * @typedef {import("../types").RuleCategory} RuleCategory
 */

/**
 * @type {RuleCategory}
 */
const CATEGORY = require("../constants/rule-category");

const MESSAGE_IDS = {
  EXTRA_BETWEEN: "unexpectBetween",
  EXTRA_AFTER: "unexpectAfter",
  EXTRA_BEFORE: "unexpectBefore",
};

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow an extra spacing around attributes",
      category: CATEGORY.STYLE,
      recommended: true,
    },

    fixable: true,
    schema: [],
    messages: {
      [MESSAGE_IDS.EXTRA_BETWEEN]: "Unexpected space between attributes",
      [MESSAGE_IDS.EXTRA_AFTER]: "Unexpected space after attribute",
      [MESSAGE_IDS.EXTRA_BEFORE]: "Unexpected space before attribute",
    },
  },
  create(context) {
    function checkExtraSpacesBetweenAttrs(attrs) {
      attrs.forEach((current, index, attrs) => {
        if (index >= attrs.length - 1) {
          return;
        }
        const after = attrs[index + 1];
        if (current.loc.end.line !== after.loc.start.line) {
          // skip the attributes on the other line
          return;
        }
        const spacesBetween = after.loc.start.column - current.loc.end.column;
        if (spacesBetween > 1) {
          context.report({
            loc: {
              start: current.loc.end,
              end: after.loc.start,
            },
            messageId: MESSAGE_IDS.EXTRA_BETWEEN,
            fix(fixer) {
              return fixer.removeRange([current.range[1] + 1, after.range[0]]);
            },
          });
        }
      });
    }
    function checkExtraSpaceAfter(startTag, lastAttr) {
      if (startTag.loc.end.line !== lastAttr.loc.end.line) {
        // skip the attribute on the diffrent line with the start tag
        return;
      }
      const spacesBetween = startTag.loc.end.column - lastAttr.loc.end.column;
      if (spacesBetween > 1) {
        context.report({
          loc: {
            start: startTag.loc.end.column,
            end: lastAttr.loc.end.column,
          },
          messageId: MESSAGE_IDS.EXTRA_AFTER,
          fix(fixer) {
            return fixer.removeRange([
              lastAttr.range[1],
              startTag.range[1] - 1,
            ]);
          },
        });
      }
    }
    function checkExtraSpaceBefore(node, firstAttr) {
      if (node.loc.start.line !== firstAttr.loc.start.line) {
        // skip the attribute on the diffrent line with the start tag
        return;
      }
      const nodeLength = node.tagName.length;
      const spacesBetween =
        firstAttr.loc.start.column - (node.loc.start.column + nodeLength);
      if (spacesBetween > 2) {
        context.report({
          loc: {
            start: node.loc.start,
            end: firstAttr.loc.start,
          },
          messageId: MESSAGE_IDS.EXTRA_BEFORE,
          fix(fixer) {
            return fixer.removeRange([
              node.range[0] + nodeLength + 2,
              firstAttr.range[0],
            ]);
          },
        });
      }
    }

    return {
      "*"(node) {
        if (node.attrs && node.attrs.length > 0) {
          checkExtraSpaceBefore(node, node.attrs[0]);
        }
        if (node.startTag && node.attrs && node.attrs.length > 0) {
          checkExtraSpaceAfter(
            node.startTag,
            node.attrs[node.attrs.length - 1]
          );
        }
        checkExtraSpacesBetweenAttrs(node.attrs || []);
      },
    };
  },
};
