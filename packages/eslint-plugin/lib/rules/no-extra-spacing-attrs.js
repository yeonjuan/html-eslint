/**
 * @typedef {import("../types").Rule} Rule
 * @typedef {import("../types").AttrNode} AttrNode
 * @typedef {import("../types").TagNode} TagNode
 * @typedef {import("../types").ElementNode} ElementNode
 */

const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  EXTRA_BETWEEN: "unexpectedBetween",
  EXTRA_AFTER: "unexpectedAfter",
  EXTRA_BEFORE: "unexpectedBefore",
};

/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow an extra spacing around attributes",
      category: RULE_CATEGORY.STYLE,
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
    /**
     * @param {AttrNode[]} attrs
     */
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
    /**
     * @param {TagNode} startTag
     * @param {AttrNode} lastAttr
     * @param {boolean} isSelfClosed
     */
    function checkExtraSpaceAfter(startTag, lastAttr, isSelfClosed) {
      if (startTag.loc.end.line !== lastAttr.loc.end.line) {
        // skip the attribute on the different line with the start tag
        return;
      }
      let spacesBetween = startTag.loc.end.column - lastAttr.loc.end.column;
      if (isSelfClosed) {
        spacesBetween--;
      }

      if (spacesBetween > 1) {
        context.report({
          loc: {
            start: lastAttr.loc.end,
            end: startTag.loc.end,
          },
          messageId: MESSAGE_IDS.EXTRA_AFTER,
          fix(fixer) {
            return fixer.removeRange([
              lastAttr.range[1],
              lastAttr.range[1] + spacesBetween - 1,
            ]);
          },
        });
      }
    }

    /**
     * @param {ElementNode} node
     * @param {AttrNode} firstAttr
     */
    function checkExtraSpaceBefore(node, firstAttr) {
      if (node.loc.start.line !== firstAttr.loc.start.line) {
        // skip the attribute on the different line with the start tag
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
          const isSelfClosed = !node.endTag;
          checkExtraSpaceAfter(
            node.startTag,
            node.attrs[node.attrs.length - 1],
            isSelfClosed
          );
        }
        checkExtraSpacesBetweenAttrs(node.attrs || []);
      },
    };
  },
};
