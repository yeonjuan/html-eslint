/** @import {RuleModule} from "../types" */
const {
  noObsoleteTags,
  NO_OBSOLETE_TAGS_MESSAGE_IDS,
} = require("@html-eslint/core");
const { elementNodeAdapter } = require("./utils/adapter");
const { AST_NODE_TYPES } = require("../constants/node-types");

/**
 * @type {RuleModule<
 *   [{ allow?: { tag: string; attr: string; valuePattern?: string }[] }]
 * >}
 */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "Disallow use of obsolete elements in HTML5",
      category: "Best Practice",
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      [NO_OBSOLETE_TAGS_MESSAGE_IDS.unexpected]:
        "Unexpected use of obsolete tag <{{tag}}>",
    },
  },

  create(context) {
    const ruleCore = noObsoleteTags();

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
        const result = ruleCore.checkElement(adapter);
        for (const r of result) {
          context.report({
            node: r.node,
            messageId: r.messageId,
            data: r.data,
          });
        }
      },
    };
  },
};
