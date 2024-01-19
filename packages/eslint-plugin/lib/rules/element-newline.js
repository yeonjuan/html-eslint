/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").ProgramNode } ProgramNode
 * @typedef { import("../types").TagNode } TagNode
 * @typedef { import("../types").BaseNode } BaseNode
 */

const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  EXPECT_NEW_LINE_AFTER: "expectAfter",
  EXPECT_NEW_LINE_BEFORE: "expectBefore",
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
        "There should be a linebreak after {{tag}}.",
      [MESSAGE_IDS.EXPECT_NEW_LINE_BEFORE]:
        "There should be a linebreak before {{tag}}.",
    },
  },

  create(context) {
    const option = context.options[0] || { skip: [] };
    const skipTags = option.skip;
    let skipTagCount = 0;
    /**
     * @param {import("../types").ChildType<TagNode | ProgramNode>[]} siblings
     */
    function checkSiblings(siblings) {
      siblings
        .filter((node) => node.type !== "Text")
        .forEach((current, index, arr) => {
          const after = arr[index + 1];
          if (after) {
            if (isOnTheSameLine(current, after)) {
              context.report({
                node: current,
                messageId: MESSAGE_IDS.EXPECT_NEW_LINE_AFTER,
                // @ts-ignore
                data: { tag: `<${current.name}>` },
                fix(fixer) {
                  return fixer.insertTextAfter(current, "\n");
                },
              });
            }
          }
        });
    }

    /**
     * @param {TagNode} node
     * @param {import("../types").ChildType<TagNode>[]} children
     */
    function checkChild(node, children) {
      const targetChildren = children.filter((n) => n.type !== "Text");
      const first = targetChildren[0];
      const last = targetChildren[targetChildren.length - 1];
      if (first) {
        if (isOnTheSameLine(node.openEnd, first)) {
          context.report({
            node: node.openEnd,
            messageId: MESSAGE_IDS.EXPECT_NEW_LINE_AFTER,
            data: { tag: `<${node.name}>` },
            fix(fixer) {
              return fixer.insertTextAfter(node.openEnd, "\n");
            },
          });
        }
      }

      if (last) {
        if (node.close && isOnTheSameLine(node.close, last)) {
          context.report({
            node: node.close,
            messageId: MESSAGE_IDS.EXPECT_NEW_LINE_BEFORE,
            data: { tag: `</${node.name}>` },
            fix(fixer) {
              return fixer.insertTextBefore(node.close, "\n");
            },
          });
        }
      }
    }
    return {
      Program(node) {
        checkSiblings(node.body);
      },
      Tag(node) {
        if (skipTagCount > 0) {
          return;
        }
        if (skipTags.includes(node.name)) {
          skipTagCount++;
          return;
        }
        checkSiblings(node.children);
        checkChild(node, node.children);
      },
      /**
       * @param {TagNode} node
       * @returns
       */
      "Tag:exit"(node) {
        if (skipTags.includes(node.name)) {
          skipTagCount--;
          return;
        }
      },
    };
  },
};

/**
 * @param {BaseNode} nodeBefore
 * @param {BaseNode} nodeAfter
 * @returns
 */
function isOnTheSameLine(nodeBefore, nodeAfter) {
  if (nodeBefore && nodeAfter) {
    return nodeBefore.loc.end.line === nodeAfter.loc.start.line;
  }
  return false;
}
