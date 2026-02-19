/**
 * @import {TSESTree} from "@typescript-eslint/types"
 * @import {RuleModule} from "../types"
 * @typedef {Object} Option
 * @property {"widely" | "newly" | number} Option.available
 */

const { useBaseline, USE_BASELINE_MESSAGE_IDS } = require("@html-eslint/core");
const { elementNodeAdapter } = require("./utils/adapter");
const { AST_NODE_TYPES } = require("@typescript-eslint/types");

/** @type {RuleModule<[Option]>} */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "Enforce the use of baseline features.",
      recommended: true,
      category: "Best Practice",
      url: "https://html-eslint.org/docs/react/rules/use-baseline",
    },
    fixable: null,
    schema: [
      {
        type: "object",
        properties: {
          available: {
            anyOf: [
              {
                enum: ["widely", "newly"],
              },
              {
                // baseline year
                type: "integer",
                minimum: 2000,
                maximum: new Date().getFullYear(),
              },
            ],
          },
        },
        additionalProperties: false,
      },
    ],

    messages: {
      [USE_BASELINE_MESSAGE_IDS.noBaselineElement]:
        "Element '{{element}}' is not a {{availability}} available baseline feature.",
      [USE_BASELINE_MESSAGE_IDS.notBaselineElementAttribute]:
        "Attribute '{{attr}}' on '{{element}}' is not a {{availability}} available baseline feature.",
      [USE_BASELINE_MESSAGE_IDS.notBaselineGlobalAttribute]:
        "Attribute '{{attr}}' is not a {{availability}} available baseline feature.",
    },
  },

  create(context) {
    const options = context.options[0] || { available: "widely" };
    const ruleCore = /**
     * @type {ReturnType<
     *   typeof useBaseline<
     *     TSESTree.JSXOpeningElement,
     *     TSESTree.JSXSpreadAttribute | TSESTree.JSXAttribute["name"] | null,
     *     TSESTree.JSXAttribute["value"]
     *   >
     * >}
     */ (useBaseline(options));

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
            messageId: r.messageId,
            data: r.data,
            node: r.node || undefined,
          });
        }
      },
    };
  },
};
