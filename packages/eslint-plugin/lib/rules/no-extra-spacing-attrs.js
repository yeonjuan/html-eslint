/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").AttributeNode } AttributeNode
 * @typedef { import("../types").OpenTagEndNode } OpenTagEndNode
 * @typedef { import("../types").OpenScriptTagEndNode } OpenScriptTagEndNode
 * @typedef { import("../types").OpenStyleTagEndNode } OpenStyleTagEndNode
 * @typedef { import("../types").OpenScriptTagStartNode } OpenScriptTagStartNode
 * @typedef { import("../types").OpenTagStartNode } OpenTagStartNode
 * @typedef { import("../types").OpenStyleTagStartNode } OpenStyleTagStartNode
 * @typedef { import("../types").TagNode } TagNode
 * @typedef { import("../types").StyleTagNode } StyleTagNode
 * @typedef { import("../types").ScriptTagNode } ScriptTagNode
 * @typedef { import("../types").AnyNode } AnyNode
 */

const { RULE_CATEGORY } = require("../constants");
const { getLocBetween } = require("./utils/node");

const MESSAGE_IDS = {
  EXTRA_BETWEEN: "unexpectedBetween",
  EXTRA_AFTER: "unexpectedAfter",
  EXTRA_BEFORE: "unexpectedBefore",
  MISSING_BEFORE: "missingBefore",
  MISSING_BEFORE_SELF_CLOSE: "missingBeforeSelfClose",
  EXTRA_BEFORE_SELF_CLOSE: "unexpectedBeforeSelfClose",
  EXTRA_TAB_BEFORE: "unexpectedTabBefore",
  EXTRA_TAB_BEFORE_SELF_CLOSE: "unexpectedTabBeforeSelfClose",
  EXTRA_TAB_BETWEEN: "unexpectedTabBetween",
};

/**
 * @type {RuleModule}
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
          disallowTabs: {
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
      [MESSAGE_IDS.EXTRA_TAB_BEFORE]: "Unexpected tab before attribute; use space instead",
      [MESSAGE_IDS.EXTRA_TAB_BEFORE_SELF_CLOSE]: "Unexpected tab before self closing; use space instead",
      [MESSAGE_IDS.EXTRA_TAB_BETWEEN]: "Unexpected tab between attributes; use space instead"
    },
  },
  create(context) {
    const enforceBeforeSelfClose = !!(context.options[0] || {})
      .enforceBeforeSelfClose;
    const disallowMissing = !!(context.options[0] || {}).disallowMissing;
    const disallowTabs = !!(context.options[0] || {}).disallowTabs;

    const sourceCode = context.getSourceCode().text;

    /**
     * @param {AttributeNode[]} attrs
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
            loc: getLocBetween(current, after),
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
        } else if (disallowTabs) {
          if (sourceCode[current.loc.end.column] === `\t`) {
            context.report({
              loc: getLocBetween(current, after),
              messageId: MESSAGE_IDS.EXTRA_TAB_BETWEEN,
              fix(fixer) {
                return fixer.replaceTextRange([current.loc.end.column, after.loc.start.column], ` `);
              },
            });
          }
        }
      });
    }

    /**
     * @param {OpenTagEndNode | OpenScriptTagEndNode | OpenStyleTagEndNode} openEnd
     * @param {AttributeNode} lastAttr
     * @param {boolean} isSelfClosed
     * @returns {void}
     */
    function checkExtraSpaceAfter(openEnd, lastAttr, isSelfClosed) {
      if (openEnd.loc.end.line !== lastAttr.loc.end.line) {
        // skip the attribute on the different line with the start tag
        return;
      }
      const limit = isSelfClosed && enforceBeforeSelfClose ? 1 : 0;
      const spacesBetween = openEnd.loc.start.column - lastAttr.loc.end.column;

      if (spacesBetween > limit) {
        context.report({
          loc: getLocBetween(lastAttr, openEnd),
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
          loc: getLocBetween(lastAttr, openEnd),
          messageId: MESSAGE_IDS.MISSING_BEFORE_SELF_CLOSE,
          fix(fixer) {
            return fixer.insertTextAfter(lastAttr, " ");
          },
        });
      }
    }

    /**
     * @param {OpenScriptTagStartNode | OpenTagStartNode | OpenStyleTagStartNode} node
     * @param {AttributeNode} firstAttr
     * @returns
     */
    function checkExtraSpaceBefore(node, firstAttr) {
      if (node.loc.start.line !== firstAttr.loc.start.line) {
        // skip the attribute on the different line with the start tag
        return;
      }

      const spacesBetween = firstAttr.loc.start.column - node.loc.end.column;
      if (spacesBetween >= 2) {
        context.report({
          loc: getLocBetween(node, firstAttr),

          messageId: MESSAGE_IDS.EXTRA_BEFORE,
          fix(fixer) {
            return fixer.removeRange([
              firstAttr.range[0] - spacesBetween + 1,
              firstAttr.range[0],
            ]);
          },
        });
      } else if (disallowTabs) {
        if (sourceCode[firstAttr.loc.start.column - 1] === `\t`) {
          context.report({
            loc: firstAttr.loc,
            messageId: MESSAGE_IDS.EXTRA_TAB_BEFORE,
            fix(fixer) {
              return fixer.replaceTextRange([firstAttr.loc.start.column - 1, firstAttr.loc.start.column], ` `);
            },
          });
        }
      }
    }

    /**
     * @param {AnyNode} beforeSelfClosing
     * @param {OpenTagEndNode | OpenScriptTagEndNode | OpenStyleTagEndNode} openEnd
     * @returns
     */
    function checkSpaceBeforeSelfClosing(beforeSelfClosing, openEnd) {
      if (beforeSelfClosing.loc.start.line !== openEnd.loc.start.line) {
        // skip the attribute on the different line with the start tag
        return;
      }
      const spacesBetween =
        openEnd.loc.start.column - beforeSelfClosing.loc.end.column;
      const locBetween = getLocBetween(beforeSelfClosing, openEnd);

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
      } else if (disallowTabs) {
        if (sourceCode[openEnd.loc.start.column - 1] === `\t`) {
          context.report({
            loc: openEnd.loc,
            messageId: MESSAGE_IDS.EXTRA_TAB_BEFORE_SELF_CLOSE,
            fix(fixer) {
              return fixer.replaceTextRange([openEnd.loc.start.column - 1, openEnd.loc.start.column], ` `);
            },
          });
        }
      }
    }

    return {
      /**
       * @param {TagNode | StyleTagNode | ScriptTagNode} node
       * @returns
       */
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
            node.attributes.length === 0 && // TODO: Handle when there are attributes
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
