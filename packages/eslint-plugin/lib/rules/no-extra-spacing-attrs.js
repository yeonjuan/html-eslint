/**
 * @typedef {import("../types").Rule} Rule
 */
const { RULE_CATEGORY } = require("../constants");
const { NodeUtils } = require("./utils");

const MESSAGE_IDS = {
  EXTRA_BETWEEN: "unexpectedBetween",
  EXTRA_AFTER: "unexpectedAfter",
  EXTRA_BEFORE: "unexpectedBefore",
  MISSING_BEFORE: "missingBefore",
  MISSING_BEFORE_SELF_CLOSE: "missingBeforeSelfClose",
  EXTRA_BEFORE_SELF_CLOSE: "unexpectedBeforeSelfClose",
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
    schema: [
      {
        type: "object",
        properties: {
          disallowMissing: {
            type: "boolean",
          },
          enforceBeforeSelfClose: {
            type: "boolean",
          },
        },
      },
    ],
    messages: {
      [MESSAGE_IDS.EXTRA_BETWEEN]: "Unexpected space between attributes",
      [MESSAGE_IDS.EXTRA_AFTER]: "Unexpected space after attribute",
      [MESSAGE_IDS.EXTRA_BEFORE]: "Unexpected space before attribute",
      [MESSAGE_IDS.MISSING_BEFORE_SELF_CLOSE]:
        "Missing space before self closing",
      [MESSAGE_IDS.EXTRA_BEFORE_SELF_CLOSE]:
        "Unexpected extra spaces before self closing",
      [MESSAGE_IDS.MISSING_BEFORE]: "Missing space before attribute",
    },
  },
  create(context) {
    const enforceBeforeSelfClose = !!(context.options[0] || {})
      .enforceBeforeSelfClose;
    const disallowMissing = !!(context.options[0] || {}).disallowMissing;

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
            loc: NodeUtils.getLocBetween(current, after),
            messageId: MESSAGE_IDS.EXTRA_BETWEEN,
            fix(fixer) {
              return fixer.removeRange([current.range[1] + 1, after.range[0]]);
            },
          });
        } else if (disallowMissing && spacesBetween < 1) {
          context.report({
            loc: after.loc,
            messageId: MESSAGE_IDS.MISSING_BEFORE,
            fix(fixer) {
              return fixer.insertTextAfter(current, " ");
            },
          });
        }
      });
    }

    function checkExtraSpaceAfter(openEnd, lastAttr, isSelfClosed) {
      if (openEnd.loc.end.line !== lastAttr.loc.end.line) {
        // skip the attribute on the different line with the start tag
        return;
      }
      const limit = isSelfClosed && enforceBeforeSelfClose ? 1 : 0;
      const spacesBetween = openEnd.loc.start.column - lastAttr.loc.end.column;

      if (spacesBetween > limit) {
        context.report({
          loc: NodeUtils.getLocBetween(lastAttr, openEnd),
          messageId: MESSAGE_IDS.EXTRA_AFTER,
          fix(fixer) {
            return fixer.removeRange([
              lastAttr.range[1],
              lastAttr.range[1] + spacesBetween - limit,
            ]);
          },
        });
      }

      if (isSelfClosed && enforceBeforeSelfClose && spacesBetween < 1) {
        context.report({
          loc: NodeUtils.getLocBetween(lastAttr, openEnd),
          messageId: MESSAGE_IDS.MISSING_BEFORE_SELF_CLOSE,
          fix(fixer) {
            return fixer.insertTextAfter(lastAttr, " ");
          },
        });
      }
    }

    function checkExtraSpaceBefore(node, firstAttr) {
      if (node.loc.start.line !== firstAttr.loc.start.line) {
        // skip the attribute on the different line with the start tag
        return;
      }

      const spacesBetween = firstAttr.loc.start.column - node.loc.end.column;
      if (spacesBetween >= 2) {
        context.report({
          loc: NodeUtils.getLocBetween(node, firstAttr),

          messageId: MESSAGE_IDS.EXTRA_BEFORE,
          fix(fixer) {
            return fixer.removeRange([
              firstAttr.range[0] - spacesBetween + 1,
              firstAttr.range[0],
            ]);
          },
        });
      }
    }

    function checkSpaceBeforeSelfClosing(beforeSelfClosing, openEnd) {
      if (beforeSelfClosing.loc.start.line !== openEnd.loc.start.line) {
        // skip the attribute on the different line with the start tag
        return;
      }
      const spacesBetween =
        openEnd.loc.start.column - beforeSelfClosing.loc.end.column;
      const locBetween = NodeUtils.getLocBetween(beforeSelfClosing, openEnd);

      if (spacesBetween > 1) {
        context.report({
          loc: locBetween,
          messageId: MESSAGE_IDS.EXTRA_BEFORE_SELF_CLOSE,
          fix(fixer) {
            return fixer.removeRange([
              beforeSelfClosing.range[1] + 1,
              openEnd.range[0],
            ]);
          },
        });
      } else if (spacesBetween < 1) {
        context.report({
          loc: locBetween,
          messageId: MESSAGE_IDS.MISSING_BEFORE_SELF_CLOSE,
          fix(fixer) {
            return fixer.insertTextAfter(beforeSelfClosing, " ");
          },
        });
      }
    }

    return {
      [["Tag", "StyleTag", "ScriptTag"].join(",")](node) {
        if (!node.attributes) {
          return;
        }

        if (node.attributes.length) {
          checkExtraSpaceBefore(node.openStart, node.attributes[0]);
        }
        if (node.openEnd) {
          const isSelfClosing = node.openEnd.value === "/>";

          if (node.attributes && node.attributes.length > 0) {
            checkExtraSpaceAfter(
              node.openEnd,
              node.attributes[node.attributes.length - 1],
              isSelfClosing
            );
          }

          checkExtraSpacesBetweenAttrs(node.attributes);
          if (
            node.attributes.length === 0 &&
            isSelfClosing &&
            enforceBeforeSelfClose
          ) {
            checkSpaceBeforeSelfClosing(node.openStart, node.openEnd);
          }
        }
      },
    };
  },
};
