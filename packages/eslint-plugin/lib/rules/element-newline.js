/**
 * @typedef { import("@html-eslint/types").Tag } Tag
 * @typedef { import("@html-eslint/types").Comment } Comment
 * @typedef { import("@html-eslint/types").Doctype } Doctype
 * @typedef { import("@html-eslint/types").ScriptTag } ScriptTag
 * @typedef { import("@html-eslint/types").StyleTag } StyleTag
 * @typedef { import("@html-eslint/types").Text } Text
 * @typedef { import("@html-eslint/types").AnyNode } AnyNode
 * @typedef { import("@html-eslint/types").OpenTagEnd } OpenTagEnd
 * @typedef { import("@html-eslint/types").CloseTag } CloseTag
 * @typedef { import("../types").Line } Line
 * @typedef { AnyNode | Line } AnyNodeOrLine
 *
 * @typedef {Object} Option
 * @property {string[]} [Option.skip]
 * @property {string[]} [Option.inline]
 *
 * @typedef { import("../types").RuleModule<[Option]> } RuleModule
 */

const { RULE_CATEGORY } = require("../constants");
const {
  isTag,
  isComment,
  isText,
  splitToLineNodes,
  isLine,
  isScript,
  isStyle,
} = require("./utils/node");
const { createVisitors } = require("./utils/visitors");
const MESSAGE_IDS = {
  EXPECT_NEW_LINE_AFTER: "expectAfter",
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
        "There should be a linebreak after {{name}}.",
    },
  },

  create(context) {
    const option = context.options[0] || {};
    /**
     * @type {string[]}
     */
    const skipTags = option.skip || ["pre", "code"];
    const inlineTags = optionsOrPresets(option.inline || []);

    /**
     * @param {AnyNodeOrLine[]} children
     * @returns {Exclude<AnyNodeOrLine, Text>[]}
     */
    function getChildrenToCheck(children) {
      /**
       * @type {Exclude<AnyNodeOrLine, Text>[]}
       */
      const childrenToCheck = [];

      for (const child of children) {
        if (isText(child)) {
          const lines = splitToLineNodes(child);
          childrenToCheck.push(...lines);
          continue;
        }
        childrenToCheck.push(child);
      }
      return childrenToCheck.filter((child) => !isEmptyText(child));
    }

    /**
     * @param {AnyNodeOrLine} before
     * @param {AnyNodeOrLine} after
     * @returns {boolean}
     */
    function isOnTheSameLine(before, after) {
      return before.loc.end.line === after.loc.start.line;
    }

    /**
     * @param {AnyNode} node
     * @returns {boolean}
     */
    function shouldSkipChildren(node) {
      if (isTag(node) && skipTags.includes(node.name.toLowerCase())) {
        return true;
      }
      return false;
    }

    /**
     * @param {AnyNodeOrLine} node
     * @returns {boolean}
     */
    function isInline(node) {
      return (
        isLine(node) ||
        (isTag(node) && inlineTags.includes(node.name.toLowerCase()))
      );
    }

    /**
     * @param {AnyNode[]} children
     * @param {AnyNode} parent
     * @param {[OpenTagEnd, CloseTag]} [wrapper]
     */
    function checkChildren(children, parent, wrapper) {
      if (shouldSkipChildren(parent)) {
        return;
      }

      const childrenToCheck = getChildrenToCheck(children);
      const firstChild = childrenToCheck[0];
      if (
        wrapper &&
        firstChild &&
        childrenToCheck.some((child) => !isInline(child))
      ) {
        const open = wrapper[0];
        if (isOnTheSameLine(open, firstChild)) {
          context.report({
            node: open,
            messageId: MESSAGE_IDS.EXPECT_NEW_LINE_AFTER,
            data: { name: getName(parent) },
            fix(fixer) {
              return fixer.insertTextAfter(open, `\n`);
            },
          });
        }
      }

      childrenToCheck.forEach((current, index) => {
        const next = childrenToCheck[index + 1];

        if (
          !next ||
          !isOnTheSameLine(current, next) ||
          (isInline(current) && isInline(next))
        ) {
          return;
        }

        context.report({
          node: current,
          messageId: MESSAGE_IDS.EXPECT_NEW_LINE_AFTER,
          data: { name: getName(current, { isClose: true }) },
          fix(fixer) {
            return fixer.insertTextAfter(current, `\n`);
          },
        });
      });

      childrenToCheck.forEach((child) => {
        if (isTag(child)) {
          /**
           * @type {[OpenTagEnd, CloseTag] | undefined}
           */
          const wrapper = child.close
            ? [child.openEnd, child.close]
            : undefined;
          checkChildren(child.children, child, wrapper);
        }
      });

      const lastChild = childrenToCheck[childrenToCheck.length - 1];
      if (
        wrapper &&
        lastChild &&
        childrenToCheck.some((child) => !isInline(child))
      ) {
        const close = wrapper[1];
        if (isOnTheSameLine(close, lastChild)) {
          context.report({
            node: lastChild,
            messageId: MESSAGE_IDS.EXPECT_NEW_LINE_AFTER,
            data: { name: getName(lastChild, { isClose: true }) },
            fix(fixer) {
              return fixer.insertTextAfter(lastChild, `\n`);
            },
          });
        }
      }
    }

    /**
     * @param {AnyNodeOrLine} node
     * @returns {boolean}
     */
    function isEmptyText(node) {
      return (
        (isText(node) && node.value.trim().length === 0) ||
        (isLine(node) && node.value.trim().length === 0)
      );
    }

    /**
     * @param {AnyNodeOrLine} node
     * @param {{ isClose?: boolean }} options
     */
    function getName(node, options = {}) {
      const isClose = options.isClose || false;
      if (isTag(node)) {
        if (isClose) {
          return `</${node.name}>`;
        }
        return `<${node.name}>`;
      }
      if (isLine(node)) {
        return "text";
      }
      if (isComment(node)) {
        return "comment";
      }
      if (isScript(node)) {
        if (isClose) {
          return `</script>`;
        }
        return "<script>";
      }
      if (isStyle(node)) {
        if (isClose) {
          return `</style>`;
        }
        return "<style>";
      }
      return `<${node.type}>`;
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

    return createVisitors(context, {
      Document(node) {
        checkChildren(node.children, node);
      },
    });
  },
};
