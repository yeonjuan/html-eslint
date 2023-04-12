const { RULE_CATEGORY } = require("../constants");

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

    let isInSkipTags = false;

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
                data: { tag: `<${current.name}>` },
                fix(fixer) {
                  return fixer.insertTextAfter(current, "\n");
                },
              });
            }
          }
        });
    }

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
      [["Tag", "Program"].join(",")](node) {
        if (isInSkipTags) {
          return;
        }

        const children = node.type === "Program" ? node.body : node.children;
        checkSiblings(children);
        if (skipTags.includes(node.name)) {
          isInSkipTags = true;
          return;
        }
        checkChild(node, children);
      },
      "Tag:exit"(node) {
        if (skipTags.includes(node.name)) {
          isInSkipTags = false;
          return;
        }
      },
    };
  },
};

function isOnTheSameLine(nodeBefore, nodeAfter) {
  if (nodeBefore && nodeAfter) {
    return nodeBefore.loc.end.line === nodeAfter.loc.start.line;
  }
  return false;
}
