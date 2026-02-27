/**
 * @import {
 *   JSXAttribute,
 *   JSXIdentifier,
 *   JSXOpeningElement,
 *   JSXSpreadAttribute,
 *   Literal,
 *   RuleModule,
 *   TemplateLiteral
 * } from "../types"
 */
const {
  noIneffectiveAttrs,
  NO_INEFFECTIVE_ATTRS_MESSAGE_IDS,
} = require("@html-eslint/core");
const { elementNodeAdapter } = require("./utils/adapter");
const { AST_NODE_TYPES } = require("../constants/node-types");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "problem",

    docs: {
      description:
        "Disallow HTML attributes that have no effect in their context",
      category: "Best Practice",
      recommended: true,
      url: "https://html-eslint.org/docs/react/rules/no-ineffective-attrs",
    },

    fixable: null,
    schema: [],
    messages: {
      [NO_INEFFECTIVE_ATTRS_MESSAGE_IDS.ineffective]: "{{ message }}",
    },
  },

  create(context) {
    const ruleCore = /**
     * @type {ReturnType<
     *   typeof noIneffectiveAttrs<
     *     JSXOpeningElement,
     *     JSXSpreadAttribute | JSXAttribute["name"] | null,
     *     Literal | TemplateLiteral | JSXIdentifier | null
     *   >
     * >}
     */ (noIneffectiveAttrs());
    return {
      JSXOpeningElement(node) {
        if (
          node.name.type !== AST_NODE_TYPES.JSXIdentifier ||
          node.name.name.toLocaleLowerCase() !== node.name.name ||
          node.name.name.includes("-")
        ) {
          return;
        }
        const adapter = elementNodeAdapter(node);
        const result = ruleCore.checkAttributes(adapter);

        for (const r of result) {
          context.report({
            node: r.node || undefined,
            messageId: r.messageId,
            data: r.data,
          });
        }
      },
    };
  },
};
