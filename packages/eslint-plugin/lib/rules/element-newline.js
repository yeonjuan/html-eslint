/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").ProgramNode } ProgramNode
 * @typedef { import("../types").TagNode } TagNode
 * @typedef { import("../types").BaseNode } BaseNode
 * @typedef { import("../types").CommentNode } CommentNode
 * @typedef { import("../types").DoctypeNode } DoctypeNode
 * @typedef { import("../types").ScriptTagNode } ScriptTagNode
 * @typedef { import("../types").StyleTagNode } StyleTagNode
 * @typedef { import("../types").TextNode } TextNode
 * @typedef { CommentNode | DoctypeNode | ScriptTagNode | StyleTagNode | TagNode | TextNode } NewlineNode
 * @typedef {{
 *   containsNewline: boolean;
 *   childFirst: NewlineNode | null;
 *   childLast: NewlineNode | null;
 * }} NodeMeta
 */

const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  EXPECT_NEW_LINE_AFTER: "expectAfter",
  EXPECT_NEW_LINE_AFTER_OPEN: "expectAfterOpen",
  EXPECT_NEW_LINE_BEFORE: "expectBefore",
  EXPECT_NEW_LINE_BEFORE_CLOSE: "expectBeforeClose",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforce newline between elements.",
      category: RULE_CATEGORY.STYLE,
      recommended: true,
    },

    fixable: true,
    schema: [
      {
        type: "object",
        properties: {
          skip: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
    ],
    messages: {
      [MESSAGE_IDS.EXPECT_NEW_LINE_AFTER]:
        "There should be a linebreak after {{tag}} element.",
      [MESSAGE_IDS.EXPECT_NEW_LINE_AFTER_OPEN]:
        "There should be a linebreak after {{tag}} open.",
      [MESSAGE_IDS.EXPECT_NEW_LINE_BEFORE]:
        "There should be a linebreak before {{tag}} element.",
      [MESSAGE_IDS.EXPECT_NEW_LINE_BEFORE_CLOSE]:
        "There should be a linebreak before {{tag}} close.",
    },
  },

  create(context) {
    const option = context.options[0] || { skip: [] };
    const skipTags = option.skip;
    /**
     * @param {Array<NewlineNode>} siblings
     * @returns {NodeMeta} meta
     */
    function checkSiblings(siblings) {
      /**
       * @type {NodeMeta}
       */
      const meta = {
        containsNewline: false,
        childFirst: null,
        childLast: null,
      };

      for (let length = siblings.length, index = 0; index < length; index += 1) {
        const node = siblings[index];

        if (isEmptyText(node)) {
          continue;
        }

        if (meta.childFirst === null) {
          meta.childFirst = node;
        }

        meta.childLast = node;

        const nodeIsNewline = isNewline(node);

        if (mayHaveChildren(node) && skipTags.includes(node.name) === false) {
          const nodeMeta = checkSiblings(node.children);
          const nodeContainsNewline = nodeMeta.containsNewline;

          if (nodeIsNewline || nodeContainsNewline) {
            meta.containsNewline = true;
          }

          if (
            nodeIsNewline
            && nodeContainsNewline
            && nodeMeta.childFirst
            && nodeMeta.childLast
          ) {
            if (node.openEnd.loc.end.line === nodeMeta.childFirst.loc.start.line) {
              context.report({
                node: node,
                messageId: MESSAGE_IDS.EXPECT_NEW_LINE_AFTER_OPEN,
                data: { tag: label(node) },
                fix(fixer) {
                  return fixer.insertTextAfter(node.openEnd, `\n`);
                },
              });
            }

            if (nodeMeta.childLast.loc.end.line === node.close.loc.start.line) {
              context.report({
                node: node,
                messageId: MESSAGE_IDS.EXPECT_NEW_LINE_BEFORE_CLOSE,
                data: { tag: label(node, { isClose: true }) },
                fix(fixer) {
                  return fixer.insertTextBefore(node.close, `\n`);
                },
              });
            }
          }
        }

        const nodeNext = siblings[index + 1];

        if (nodeNext) {
          if (nodeIsNewline && isEmptyText(nodeNext) === false) {
            context.report({
              node: nodeNext,
              messageId: MESSAGE_IDS.EXPECT_NEW_LINE_AFTER,
              data: { tag: label(node) },
              fix(fixer) {
                return fixer.insertTextAfter(node, `\n`);
              },
            });
          } else if (isNewline(nodeNext)) {
            context.report({
              node: nodeNext,
              messageId: MESSAGE_IDS.EXPECT_NEW_LINE_BEFORE,
              data: { tag: label(nodeNext) },
              fix(fixer) {
                return fixer.insertTextBefore(nodeNext, `\n`);
              },
            });
          }
        }
      }

      return meta;
    }

    /**
     * @param {NewlineNode} node
     */
    function isInline(node) {
      switch (node.type) {
        case `Comment`:
          return node.value.value.trim().match(/\n|\r/) === null;
        // case `Tag`:
        //   return skipTags.includes(node.name);
        case `Text`:
          return node.value.trim().match(/\n|\r/) === null;
        default:
          return false;
      }
    }

    /**
     * @param {NewlineNode} node
     */
    function isNewline(node) {
      return (isInline(node) === false);
    }

    /**
     * @param {NewlineNode} node
     */
    function isEmptyText(node) {
      return (node.type === `Text` && node.value.trim().length === 0);
    }

    /**
     * @param {NewlineNode} node
     * @param {{ isClose?: boolean }} options
     */
    function label(node, options = {}) {
      const isClose = options.isClose || false;

      switch (node.type) {
        case `Tag`:
          if (isClose) {
            return `</${node.name}>`;
          }
          return `<${node.name}>`;
        default:
          return `<${node.type}>`; // TODO1
      }
    }

    /**
     * @param {NewlineNode} node
     */
    function mayHaveChildren(node) {
      return (node.type === `Tag`);
    }

    return {
      Program(node) {
        checkSiblings(node.body);
      },
    };
  },
};
