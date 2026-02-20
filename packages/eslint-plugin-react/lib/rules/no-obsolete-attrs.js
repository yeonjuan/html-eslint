/**
 * @import {TSESTree} from "@typescript-eslint/types"
 * @import {RuleModule} from "../types"
 */
const {
  noObsoleteAttrs,
  NO_OBSOLETE_ATTRS_MESSAGE_IDS,
} = require("@html-eslint/core");
const { elementNodeAdapter } = require("./utils/adapter");
const { AST_NODE_TYPES } = require("../constants/node-types");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "problem",

    docs: {
      description: "Disallow use of obsolete attributes in HTML5",
      category: "Best Practice",
      recommended: true,
      url: "https://html-eslint.org/docs/react/rules/no-obsolete-attrs",
    },

    fixable: null,
    schema: [],
    messages: {
      [NO_OBSOLETE_ATTRS_MESSAGE_IDS.obsolete]:
        "The {{attr}} attribute on <{{element}}> is obsolete. {{suggestion}}",
    },
  },

  create(context) {
    const ruleCore = noObsoleteAttrs();
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
