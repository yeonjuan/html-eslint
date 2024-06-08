/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").TagNode } TagNode
 */

const { RULE_CATEGORY, VOID_ELEMENTS } = require("../constants");

const VOID_ELEMENTS_SET = new Set(VOID_ELEMENTS);

const MESSAGE_IDS = {
  MISSING: "missing",
  MISSING_SELF: "missingSelf",
  UNEXPECTED: "unexpected",
};

/**
 * @type {RuleModule}
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
          selfClosingCustomPatterns: {
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
      [MESSAGE_IDS.MISSING]: "Missing closing tag for {{tag}}.",
      [MESSAGE_IDS.MISSING_SELF]: "Missing self closing tag for {{tag}}",
      [MESSAGE_IDS.UNEXPECTED]: "Unexpected self closing tag for {{tag}}.",
    },
  },

  create(context) {
    /** @type {string[]} */
    const foreignContext = [];
    const shouldSelfCloseVoid =
      context.options && context.options.length
        ? context.options[0].selfClosing === "always"
        : false;
    /** @type {string[]} */
    const selfClosingCustomPatternsOption =
      (context.options &&
        context.options.length &&
        context.options[0].selfClosingCustomPatterns) ||
      [];
    const selfClosingCustomPatterns = selfClosingCustomPatternsOption.map(
      (i) => new RegExp(i)
    );

    /**
     * @param {TagNode} node
     */
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

    /**
     * @param {TagNode} node
     * @param {boolean} shouldSelfClose
     * @param {boolean} fixable
     */
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
            const fixes = [];
            fixes.push(fixer.replaceText(node.openEnd, " />"));
            if (node.close) fixes.push(fixer.remove(node.close));
            return fixes;
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
        const isSelfClosingCustomElement = !!selfClosingCustomPatterns.some(
          (i) => node.name.match(i)
        );
        const isForeign = foreignContext.length > 0;
        const shouldSelfCloseCustom =
          isSelfClosingCustomElement && !node.children.length;
        const shouldSelfCloseForeign = node.selfClosing;
        const shouldSelfClose =
          (isVoidElement && shouldSelfCloseVoid) ||
          (isSelfClosingCustomElement && shouldSelfCloseCustom) ||
          (isForeign && shouldSelfCloseForeign);
        const canSelfClose =
          isVoidElement || isSelfClosingCustomElement || isForeign;
        if (node.selfClosing || canSelfClose) {
          checkVoidElement(node, shouldSelfClose, canSelfClose);
        } else if (node.openEnd.value !== "/>") {
          checkClosingTag(node);
        }
        if (["svg", "math"].includes(node.name)) foreignContext.push(node.name);
      },
      /**
       * @param {TagNode} node
       */
      "Tag:exit"(node) {
        if (node.name === foreignContext[foreignContext.length - 1]) {
          foreignContext.pop();
        }
      },
    };
  },
};
