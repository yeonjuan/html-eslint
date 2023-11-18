const { NODE_TYPES } = require("@html-eslint/parser");
const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
};

/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "suggestion",

    docs: {
      description: "Enforce to use lowercase for tag and attribute names.",
      category: RULE_CATEGORY.STYLE,
      recommended: false,
    },

    fixable: "code",
    schema: [],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]: "'{{name}}' is not in lowercase.",
    },
  },

  create(context) {
    /**
     * @param {TagNode | StyleTagNode | ScriptTagNode} node
     */
    function nameOf(node) {
      if (node.type === NODE_TYPES.ScriptTag) return "script";
      if (node.type === NODE_TYPES.StyleTag) return "style";
      return node.name;
    }

    /**
     * @param {TagNode | StyleTagNode | ScriptTagNode} node
     */
    function check(node) {
      const raw = node.openStart.value.slice(1);
      if (nameOf(node) !== raw) {
        context.report({
          node: node.openStart,
          messageId: MESSAGE_IDS.UNEXPECTED,
          data: {
            name: raw,
          },
          fix(fixer) {
            const name = nameOf(node);
            const fixes = [
              fixer.replaceTextRange(node.openStart.range, `<${name}`),
            ];

            if (node.close) {
              fixes.push(
                fixer.replaceTextRange(node.close.range, `</${name}>`)
              );
            }

            return fixes;
          },
        });
      }
      if (node.attributes && node.attributes.length) {
        node.attributes.forEach((attribute) => {
          if (attribute.key.value !== attribute.key.value.toLowerCase()) {
            context.report({
              node: attribute.key,
              messageId: MESSAGE_IDS.UNEXPECTED,
              data: {
                name: attribute.key.value,
              },
              fix(fixer) {
                return fixer.replaceText(
                  attribute.key,
                  attribute.key.value.toLowerCase()
                );
              },
            });
          }
        });
      }
    }

    return {
      Tag: check,
      StyleTag: check,
      ScriptTag: check,
    };
  },
};
