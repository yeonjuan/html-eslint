/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").ProgramNode } ProgramNode
 * @typedef { import("es-html-parser").CommentContentNode } CommentContentNode
 * @typedef { import("../types").ContentNode } ContentNode
 * @typedef { import("../types").TextNode } TextNode
 */

const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow unnecessary consecutive spaces",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
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
        additionalProperties: false,
      },
    ],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]:
        "Tabs and/or multiple consecutive spaces not allowed here",
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const skipTags = options.skip || [];
    const sourceCode = context.getSourceCode();

    /**
     * @param {Array<ContentNode>} siblings
     */
    function checkSiblings(siblings) {
      for (
        let length = siblings.length, index = 0;
        index < length;
        index += 1
      ) {
        const node = siblings[index];

        if (node.type === `Tag` && skipTags.includes(node.name) === false) {
          checkSiblings(node.children);
        } else if (node.type === `Text`) {
          stripConsecutiveSpaces(node);
        } else if (node.type === `Comment`) {
          stripConsecutiveSpaces(node.value);
        }
      }
    }

    return {
      Program(node) {
        // @ts-ignore
        checkSiblings(node.body);
      },
    };

    /**
     * @param {TextNode | CommentContentNode} node
     */
    function stripConsecutiveSpaces(node) {
      const text = node.value;
      const matcher = /(^|[^\n \t])([ \t]+\n|\t[\t ]*|[ \t]{2,})/g;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const offender = matcher.exec(text);
        if (offender === null) {
          break;
        }

        const space = offender[2];
        const indexStart = node.range[0] + matcher.lastIndex - space.length;
        const indexEnd = indexStart + space.length;

        context.report({
          node: node,
          loc: {
            start: sourceCode.getLocFromIndex(indexStart),
            end: sourceCode.getLocFromIndex(indexEnd),
          },
          messageId: MESSAGE_IDS.UNEXPECTED,
          fix(fixer) {
            return fixer.replaceTextRange(
              [indexStart, indexEnd],
              space.endsWith(`\n`) ? `\n` : ` `
            );
          },
        });
      }
    }
  },
};
