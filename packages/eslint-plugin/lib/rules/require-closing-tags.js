/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY, VOID_ELEMENTS } = require("../constants");

const VOID_ELEMENTS_SET = new Set(VOID_ELEMENTS);

const MESSAGE_IDS = {
  MISSING: "missing",
  MISSING_SELF: "missingSelf",
  UNEXPECTED: "unexpected",
};

/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Require closing tags.",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: true,
    },

    fixable: true,
    schema: [
      {
        type: "object",
        properties: {
          selfClosing: {
            enum: ["always", "never"],
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [MESSAGE_IDS.MISSING]: "Missing closing tag for {{tag}}.",
      [MESSAGE_IDS.MISSING_SELF]: "Missing self closing tag for {{tag}}",
      [MESSAGE_IDS.UNEXPECTED]: "Unexpected self closing tag for {{tag}}.",
    },
  },

  create(context) {
    const shouldSelfClose =
      context.options && context.options.length
        ? context.options[0].selfClosing === "always"
        : false;

    const sourceCode = context.getSourceCode();
    function getCodeIn(range) {
      return sourceCode.text.slice(range[0], range[1]);
    }

    function checkClosingTag(node) {
      if (node.startTag && !node.endTag) {
        if (
          node.namespaceURI === "http://www.w3.org/2000/svg" ||
          node.namespaceURI === "http://www.w3.org/1998/Math/MathML"
        ) {
          const code = getCodeIn(node.startTag.range);
          const hasSelfClose = code.endsWith("/>");
          if (hasSelfClose) {
            return;
          }
        }
        context.report({
          node: node.startTag,
          data: {
            tag: node.tagName,
          },
          messageId: MESSAGE_IDS.MISSING,
        });
      }
    }

    function checkVoidElement(node) {
      const startTag = node.startTag;
      const code = getCodeIn(startTag.range);
      const hasSelfClose = code.endsWith("/>");

      if (shouldSelfClose && !hasSelfClose) {
        context.report({
          node: startTag,
          data: {
            tag: node.tagName,
          },
          messageId: MESSAGE_IDS.MISSING_SELF,
          fix(fixer) {
            return fixer.replaceTextRange(
              [startTag.range[1] - 1, startTag.range[1]],
              " />"
            );
          },
        });
      }
      if (!shouldSelfClose && hasSelfClose) {
        context.report({
          node: startTag,
          data: {
            tag: node.tagName,
          },
          messageId: MESSAGE_IDS.UNEXPECTED,
          fix(fixer) {
            return fixer.replaceTextRange(
              [startTag.range[1] - 2, startTag.range[1]],
              ">"
            );
          },
        });
      }
    }

    return {
      "*"(node) {
        if (node.startTag) {
          if (VOID_ELEMENTS_SET.has(node.tagName)) {
            checkVoidElement(node);
          } else {
            checkClosingTag(node);
          }
        }
      },
    };
  },
};
