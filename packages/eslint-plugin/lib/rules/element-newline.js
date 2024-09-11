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
 *   childFirst: NewlineNode | null;
 *   childLast: NewlineNode | null;
 *   shouldBeNewline: boolean;
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
 * @type {Object.<string, Array<string>>}
 */
const PRESETS = {
  // From https://developer.mozilla.org/en-US/docs/Web/HTML/Element#inline_text_semantics
  $inline: `
a
abbr
b
bdi
bdo
br
cite
code
data
dfn
em
i
kbd
mark
q
rp
rt
ruby
s
samp
small
span
strong
sub
sup
time
u
var
wbr
  `
    .trim()
    .split(`\n`),
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
          inline: {
            type: "array",
            items: {
              type: "string",
            },
          },

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
    const option = context.options[0] || {};
    const skipTags = option.skip || [];
    const inlineTags = optionsOrPresets(option.inline || []);

    /**
     * @param {Array<NewlineNode>} siblings
     * @returns {NodeMeta} meta
     */
    function checkSiblings(siblings) {
      /**
       * @type {NodeMeta}
       */
      const meta = {
        childFirst: null,
        childLast: null,
        shouldBeNewline: false,
      };

      const nodesWithContent = [];
      for (
        let length = siblings.length, index = 0;
        index < length;
        index += 1
      ) {
        const node = siblings[index];

        if (isEmptyText(node) === false) {
          nodesWithContent.push(node);
        }
      }

      for (
        let length = nodesWithContent.length, index = 0;
        index < length;
        index += 1
      ) {
        const node = nodesWithContent[index];
        const nodeNext = nodesWithContent[index + 1];

        if (meta.childFirst === null) {
          meta.childFirst = node;
        }

        meta.childLast = node;

        const nodeShouldBeNewline = shouldBeNewline(node);

        if (node.type === `Tag` && skipTags.includes(node.name) === false) {
          const nodeMeta = checkSiblings(node.children);
          const nodeChildShouldBeNewline = nodeMeta.shouldBeNewline;

          if (nodeShouldBeNewline || nodeChildShouldBeNewline) {
            meta.shouldBeNewline = true;
          }

          if (
            nodeShouldBeNewline &&
            nodeChildShouldBeNewline &&
            nodeMeta.childFirst &&
            nodeMeta.childLast
          ) {
            if (
              node.openEnd.loc.end.line === nodeMeta.childFirst.loc.start.line
            ) {
              if (isNotNewlineStart(nodeMeta.childFirst)) {
                context.report({
                  node: node,
                  messageId: MESSAGE_IDS.EXPECT_NEW_LINE_AFTER_OPEN,
                  data: { tag: label(node) },
                  fix(fixer) {
                    return fixer.insertTextAfter(node.openEnd, `\n`);
                  },
                });
              }
            }

            if (nodeMeta.childLast.loc.end.line === node.close.loc.start.line) {
              if (isNotNewlineEnd(nodeMeta.childLast)) {
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
        }

        if (nodeNext && node.loc.end.line === nodeNext.loc.start.line) {
          if (nodeShouldBeNewline) {
            if (isNotNewlineStart(nodeNext)) {
              context.report({
                node: nodeNext,
                messageId: MESSAGE_IDS.EXPECT_NEW_LINE_AFTER,
                data: { tag: label(node) },
                fix(fixer) {
                  return fixer.insertTextAfter(node, `\n`);
                },
              });
            }
          } else if (shouldBeNewline(nodeNext)) {
            if (isNotNewlineEnd(node)) {
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
      }

      return meta;
    }

    /**
     * @param {NewlineNode} node
     */
    function isEmptyText(node) {
      return node.type === `Text` && node.value.trim().length === 0;
    }

    /**
     * @param {NewlineNode} node
     */
    function isNotNewlineEnd(node) {
      return node.type !== `Text` || /\n\s*$/.test(node.value) === false;
    }

    /**
     * @param {NewlineNode} node
     */
    function isNotNewlineStart(node) {
      return node.type !== `Text` || /^\n/.test(node.value) === false;
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
          return `<${node.type}>`;
      }
    }

    /**
     * @param {Array<string>} options
     */
    function optionsOrPresets(options) {
      const result = [];
      for (const option of options) {
        if (option in PRESETS) {
          const preset = PRESETS[option];
          result.push(...preset);
        } else {
          result.push(option);
        }
      }
      return result;
    }

    /**
     * @param {NewlineNode} node
     */
    function shouldBeNewline(node) {
      switch (node.type) {
        case `Comment`:
          return /[\n\r]+/.test(node.value.value.trim());
        case `Tag`:
          return inlineTags.includes(node.name.toLowerCase()) === false;
        case `Text`:
          return /[\n\r]+/.test(node.value.trim());
        default:
          return true;
      }
    }

    return {
      Program(node) {
        // @ts-ignore
        checkSiblings(node.body);
      },
    };
  },
};
