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
      [MESSAGE_IDS.HUCKS]: "HUCKS.",
    },
  },

  create(context) {
    let svgStacks = [];

    const shouldSelfClose =
      context.options && context.options.length
        ? context.options[0].selfClosing === "always"
        : false;

    function checkClosingTag(node) {
      if (!node.close) {
        context.report({
          node: node,
          data: {
            tag: node.name,
          },
          messageId: MESSAGE_IDS.MISSING,
        });
      }
    }

    function checkVoidElement(node) {
      const hasSelfClose = node.openEnd.value === "/>";
      if (shouldSelfClose && !hasSelfClose) {
        context.report({
          node: node.openEnd,
          data: {
            tag: node.name,
          },
          messageId: MESSAGE_IDS.MISSING_SELF,
          fix(fixer) {
            return fixer.replaceText(node.openEnd, " />");
          },
        });
      }
      if (!shouldSelfClose && hasSelfClose) {
        context.report({
          node: node.openEnd,
          data: {
            tag: node.name,
          },
          messageId: MESSAGE_IDS.UNEXPECTED,
          fix(fixer) {
            return fixer.replaceText(node.openEnd, ">");
          },
        });
      }
    }

    return {
      Tag(node) {
        if (node.name === "svg") {
          svgStacks.push(node);
        }
        if (node.selfClosing || VOID_ELEMENTS_SET.has(node.name)) {
          checkVoidElement(node);
        } else if (node.openEnd.value !== "/>") {
          checkClosingTag(node);
        }
      },
      "Tag:exit"(node) {
        if (node.name === "svg") {
          svgStacks.push(node);
        }
      },
    };
  },
};
