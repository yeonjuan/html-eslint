/**
 * @typedef { import("@html-eslint/types").Attribute } Attribute
 * @typedef { import("@html-eslint/types").OpenTagEnd } OpenTagEnd
 * @typedef { import("@html-eslint/types").OpenScriptTagEnd } OpenScriptTagEnd
 * @typedef { import("@html-eslint/types").OpenStyleTagEnd } OpenStyleTagEnd
 * @typedef { import("@html-eslint/types").OpenScriptTagStart } OpenScriptTagStart
 * @typedef { import("@html-eslint/types").OpenTagStart } OpenTagStart
 * @typedef { import("@html-eslint/types").OpenStyleTagStart } OpenStyleTagStart
 * @typedef { import("@html-eslint/types").Tag } Tag
 * @typedef { import("@html-eslint/types").StyleTag } StyleTag
 * @typedef { import("@html-eslint/types").ScriptTag } ScriptTag
 * @typedef { import("@html-eslint/types").AnyNode } AnyNode
 *
 * @typedef {Object} Option
 * @property {boolean} [Option.disallowInAssignment]
 * @property {boolean} [Option.disallowMissing]
 * @property {boolean} [Option.disallowTabs]
 * @property {boolean} [Option.enforceBeforeSelfClose]
 * @typedef { import("../types").RuleModule<[Option]> } RuleModule
 */

const { RULE_CATEGORY } = require("../constants");
const { getLocBetween } = require("./utils/node");
const { getSourceCode } = require("./utils/source-code");
const { createVisitors } = require("./utils/visitors");

const MESSAGE_IDS = {
  EXTRA_BETWEEN: "unexpectedBetween",
  EXTRA_AFTER: "unexpectedAfter",
  EXTRA_BEFORE: "unexpectedBefore",
  EXTRA_BEFORE_CLOSE: "unexpectedBeforeClose",
  EXTRA_IN_ASSIGNMENT: "unexpectedInAssignment",
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
          disallowInAssignment: {
            type: "boolean",
          },
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
      [MESSAGE_IDS.EXTRA_BEFORE_CLOSE]: "Unexpected space before closing",
      [MESSAGE_IDS.EXTRA_IN_ASSIGNMENT]:
        "Unexpected space in attribute assignment",
      [MESSAGE_IDS.MISSING_BEFORE_SELF_CLOSE]:
        "Missing space before self closing",
      [MESSAGE_IDS.EXTRA_BEFORE_SELF_CLOSE]:
        "Unexpected extra spaces before self closing",
      [MESSAGE_IDS.MISSING_BEFORE]: "Missing space before attribute",
      [MESSAGE_IDS.EXTRA_TAB_BEFORE]:
        "Unexpected tab before attribute; use space instead",
      [MESSAGE_IDS.EXTRA_TAB_BEFORE_SELF_CLOSE]:
        "Unexpected tab before self closing; use space instead",
      [MESSAGE_IDS.EXTRA_TAB_BETWEEN]:
        "Unexpected tab between attributes; use space instead",
    },
  },
  create(context) {
    const enforceBeforeSelfClose = !!(context.options[0] || {})
      .enforceBeforeSelfClose;
    const disallowMissing = !!(context.options[0] || {}).disallowMissing;
    const disallowTabs = !!(context.options[0] || {}).disallowTabs;
    const disallowInAssignment = !!(context.options[0] || [])
      .disallowInAssignment;

    const sourceCode = getSourceCode(context).text;

    /**
     * @param {Attribute[]} attrs
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
              return fixer.replaceTextRange(
                [current.range[1], after.range[0]],
                ` `
              );
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
          if (sourceCode[current.range[1]] === `\t`) {
            context.report({
              loc: getLocBetween(current, after),
              messageId: MESSAGE_IDS.EXTRA_TAB_BETWEEN,
              fix(fixer) {
                return fixer.replaceTextRange(
                  [current.range[1], after.range[0]],
                  ` `
                );
              },
            });
          }
        }
      });
    }

    /**
     * @param {OpenScriptTagStart | OpenTagStart | OpenStyleTagStart} node
     * @param {Attribute} firstAttr
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
        if (sourceCode[firstAttr.range[0] - 1] === `\t`) {
          context.report({
            loc: firstAttr.loc,
            messageId: MESSAGE_IDS.EXTRA_TAB_BEFORE,
            fix(fixer) {
              return fixer.replaceTextRange(
                [firstAttr.range[0] - 1, firstAttr.range[0]],
                ` `
              );
            },
          });
        }
      }
    }
    /**
     * @param {Tag | StyleTag | ScriptTag} node
     * @returns
     */
    function check(node) {
      if (!node.attributes) {
        return;
      }

      if (node.attributes.length) {
        checkExtraSpaceBefore(node.openStart, node.attributes[0]);

        for (const attr of node.attributes) {
          if (attr.startWrapper && attr.value) {
            if (
              disallowInAssignment &&
              attr.startWrapper.loc.start.column - attr.key.loc.end.column > 1
            ) {
              const start = attr.key.range[1];
              const end = attr.startWrapper.range[0];
              context.report({
                node: attr,
                messageId: MESSAGE_IDS.EXTRA_IN_ASSIGNMENT,
                fix(fixer) {
                  return fixer.replaceTextRange([start, end], `=`);
                },
              });
            }
          }
        }
      }

      if (node.openEnd) {
        checkExtraSpacesBetweenAttrs(node.attributes);

        const lastAttr = node.attributes[node.attributes.length - 1];
        const nodeBeforeEnd =
          node.attributes.length === 0 ? node.openStart : lastAttr;

        if (nodeBeforeEnd.loc.end.line !== node.openEnd.loc.start.line) {
          return;
        }

        const isSelfClosing = node.openEnd.value === "/>";

        const spacesBetween =
          node.openEnd.loc.start.column - nodeBeforeEnd.loc.end.column;
        const locBetween = getLocBetween(nodeBeforeEnd, node.openEnd);

        if (isSelfClosing && enforceBeforeSelfClose) {
          if (spacesBetween < 1) {
            context.report({
              loc: locBetween,
              messageId: MESSAGE_IDS.MISSING_BEFORE_SELF_CLOSE,
              fix(fixer) {
                return fixer.insertTextAfter(nodeBeforeEnd, " ");
              },
            });
          } else if (spacesBetween === 1) {
            if (
              disallowTabs &&
              sourceCode[node.openEnd.range[0] - 1] === `\t`
            ) {
              context.report({
                loc: node.openEnd.loc,
                messageId: MESSAGE_IDS.EXTRA_TAB_BEFORE_SELF_CLOSE,
                fix(fixer) {
                  return fixer.replaceTextRange(
                    [node.openEnd.range[0] - 1, node.openEnd.range[0]],
                    ` `
                  );
                },
              });
            }
          } else {
            context.report({
              loc: locBetween,
              messageId: MESSAGE_IDS.EXTRA_BEFORE_SELF_CLOSE,
              fix(fixer) {
                return fixer.removeRange([
                  nodeBeforeEnd.range[1] + 1,
                  node.openEnd.range[0],
                ]);
              },
            });
          }

          return;
        }

        if (spacesBetween > 0) {
          if (node.attributes.length > 0) {
            context.report({
              loc: locBetween,
              messageId: MESSAGE_IDS.EXTRA_AFTER,
              fix(fixer) {
                return fixer.removeRange([
                  lastAttr.range[1],
                  node.openEnd.range[0],
                ]);
              },
            });
          } else {
            context.report({
              loc: locBetween,
              messageId: MESSAGE_IDS.EXTRA_BEFORE_CLOSE,
              fix(fixer) {
                return fixer.removeRange([
                  node.openStart.range[1],
                  node.openEnd.range[0],
                ]);
              },
            });
          }
        }
      }
    }

    return createVisitors(context, {
      Tag: check,
      StyleTag: check,
      ScriptTag: check,
    });
  },
};
