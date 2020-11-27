const {RULE_CATEGORY} = require("../constants");

const MESSAGE_IDS = {
  EXPECT_NEW_LINE_AFTER: "expectAfter",
  EXPECT_NEW_LINE_BEFORE: "expectBefore",
};

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforce newline between elements",
      category: RULE_CATEGORY.STYLE,
      recommended: true,
    },

    fixable: true,
    schema: [],
    messages: {
      [MESSAGE_IDS.EXPECT_NEW_LINE_AFTER]: "Expected newline after {{tag}}",
      [MESSAGE_IDS.EXPECT_NEW_LINE_BEFORE]: "Expected newline before {{tag}}",
    },
  },

  create(context) {
    function checkSiblings(sibilings) {
      sibilings
        .filter((node) => node.type !== "text" && node.range[0])
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

    function checkChild(node) {
      const children = (node.childNodes || []).filter(
        (n) => !!n.range[0] && n.type !== "text"
      );
      const first = children[0];
      const last = children[children.length - 1];
      if (first) {
        if (isOnTheSameLine(node.startTag, first)) {
          context.report({
            node: node.startTag,
            messageId: MESSAGE_IDS.EXPECT_NEW_LINE_AFTER,
            data: { tag: `<${node.tagName}>` },
            fix(fixer) {
              return fixer.insertTextAfter(node.startTag, "\n");
            },
          });
        }
      }
      if (last) {
        if (isOnTheSameLine(node.endTag, last)) {
          context.report({
            node: node.endTag,
            messageId: MESSAGE_IDS.EXPECT_NEW_LINE_BEFORE,
            data: { tag: `</${node.tagName}>` },
            fix(fixer) {
              return fixer.insertTextBefore(node.endTag, "\n");
            },
          });
        }
      }
    }
    return {
      "*"(node) {
        if (node.type !== "text") {
          checkSiblings(node.childNodes || []);
          checkChild(node);
        }
      },
    };
  },
};

function isOnTheSameLine(nodeBefore, nodeAfter) {
  return (
    nodeBefore &&
    nodeAfter &&
    nodeBefore.loc &&
    nodeAfter.loc &&
    nodeBefore.loc.end.line === nodeAfter.loc.start.line
  );
}
