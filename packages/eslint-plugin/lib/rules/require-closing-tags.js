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
          allowSelfClosingCustom: {
            type: "boolean",
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
    const shouldSelfClose =
      context.options && context.options.length
        ? context.options[0].selfClosing === "always"
        : false;
    const allowSelfClosingCustom =
      context.options && context.options.length
        ? context.options[0].allowSelfClosingCustom === true
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

    function checkVoidElement(node, shouldSelfClose, fixable) {
      const hasSelfClose = node.openEnd.value === "/>";
      if (shouldSelfClose && !hasSelfClose) {
        context.report({
          node: node.openEnd,
          data: {
            tag: node.name,
          },
          messageId: MESSAGE_IDS.MISSING_SELF,
          fix(fixer) {
            if (!fixable) {
              return null;
            }
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
            if (!fixable) {
              return null;
            }
            return fixer.replaceText(node.openEnd, ">");
          },
        });
      }
    }

    return {
      Tag(node) {
        const isVoidElement = VOID_ELEMENTS_SET.has(node.name);
        if (
          node.selfClosing &&
          allowSelfClosingCustom &&
          node.name.indexOf("-") !== -1
        ) {
          checkVoidElement(node, true, false);
        } else if (node.selfClosing || isVoidElement) {
          checkVoidElement(node, shouldSelfClose, isVoidElement);
        } else if (node.openEnd.value !== "/>") {
          checkClosingTag(node);
        }
      },
    };
  },
};
