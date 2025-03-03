/**
 * @typedef { import("@html-eslint/types").Tag } Tag
 * @typedef { import("@html-eslint/types").StyleTag } StyleTag
 * @typedef { import("@html-eslint/types").ScriptTag } ScriptTag
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 */

const { NODE_TYPES } = require("@html-eslint/parser");
const { RULE_CATEGORY } = require("../constants");
const SVG_CAMEL_CASE_ATTRIBUTES = require("../constants/svg-camel-case-attributes");
const { createVisitors } = require("./utils/visitors");
const { hasTemplate } = require("./utils/node");

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
};

/**
 * @type {RuleModule}
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
    const allowedAttrKeySet = new Set(SVG_CAMEL_CASE_ATTRIBUTES);
    /**
     * @type {Tag[]}
     */
    const svgStack = [];

    /**
     * @param {Tag} node
     */
    function enterSvg(node) {
      svgStack.push(node);
    }

    function exitSvg() {
      svgStack.pop();
    }

    /**
     * @param {string} key
     * @returns {boolean}
     */
    function isAllowedAttributeKey(key) {
      return !!svgStack.length && allowedAttrKeySet.has(key);
    }

    /**
     * @param {Tag | StyleTag | ScriptTag} node
     */
    function nameOf(node) {
      if (node.type === NODE_TYPES.ScriptTag) return "script";
      if (node.type === NODE_TYPES.StyleTag) return "style";
      return node.name;
    }

    /**
     * @param {Tag | StyleTag | ScriptTag} node
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
          if (isAllowedAttributeKey(attribute.key.value)) {
            return;
          }
          if (hasTemplate(attribute.key)) {
            return;
          }
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

    return createVisitors(context, {
      Tag(node) {
        if (node.name.toLocaleLowerCase() === "svg") {
          enterSvg(node);
        }
        check(node);
      },
      "Tag:exit"(node) {
        if (node.name.toLocaleLowerCase() === "svg") {
          exitSvg();
        }
      },
      StyleTag: check,
      ScriptTag: check,
    });
  },
};
