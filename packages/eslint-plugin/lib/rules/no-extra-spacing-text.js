/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").ProgramNode } ProgramNode
 * @typedef { import("es-html-parser").CommentContentNode } CommentContentNode
 * @typedef { import("es-html-parser").TagNode } TagNode
 * @typedef { import("es-html-parser").CommentNode } CommentNode
 * @typedef { import("../types").ContentNode } ContentNode
 * @typedef { import("es-html-parser").TextNode } TextNode
 * @typedef { import("../types").LineNode } LineNode
 * @typedef { import("../types").Range } Range
 */

const { RULE_CATEGORY } = require("../constants");
const { isTag, isOverlapWithTemplates } = require("./utils/node");
const { getSourceCode } = require("./utils/source-code");
const { createVisitors } = require("./utils/visitors");

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
    /**
     * @type {string[]}
     */
    const skipTags = options.skip || [];
    const sourceCode = getSourceCode(context);
    /**
     * @type {TagNode[]}
     */
    const tagStack = [];

    /**
     * @param {CommentNode | TextNode} node
     * @returns {boolean}
     */
    function hasSkipTagOnParent(node) {
      // @ts-ignore
      const parent = node.parent;
      if (
        parent &&
        // @ts-ignore
        isTag(parent) &&
        skipTags.some((skipTag) => skipTag === parent.name)
      ) {
        return true;
      }
      return false;
    }

    /**
     * @param {CommentContentNode | TextNode} node
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

        const hasOverlap = isOverlapWithTemplates(node.templates, [
          indexStart,
          indexEnd,
        ]);

        if (hasOverlap) {
          return;
        }

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

    return createVisitors(context, {
      Comment(node) {
        if (hasSkipTagOnParent(node)) {
          return;
        }
        stripConsecutiveSpaces(node.value);
      },
      Text(node) {
        if (hasSkipTagOnParent(node)) {
          return;
        }
        stripConsecutiveSpaces(node);
      },
      Tag(node) {
        tagStack.push(node);
        if (
          skipTags.some((skipTag) =>
            tagStack.some((tag) => tag.name === skipTag)
          )
        ) {
          return;
        }
      },
      "Tag:exit"() {
        tagStack.pop();
      },
    });
  },
};
