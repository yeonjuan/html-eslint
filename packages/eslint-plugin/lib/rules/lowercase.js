/**
 * @import {
 *   Tag,
 *   StyleTag,
 *   ScriptTag,
 *   Doctype,
 * } from "@html-eslint/types";
 * @import {RuleModule} from "../types";
 */

const { RULE_CATEGORY } = require("../constants");
const SVG_CAMEL_CASE_ATTRIBUTES = require("../constants/svg-camel-case-attributes");
const { createVisitors } = require("./utils/visitors");
const { hasTemplate, isScript, isStyle } = require("./utils/node");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
};

/**
 * @type {RuleModule<[]>}
 */
module.exports = {
  meta: {
    type: "suggestion",

    docs: {
      description: "Enforce use of lowercase for tag and attribute names.",
      category: RULE_CATEGORY.STYLE,
      recommended: false,
      url: getRuleUrl("lowercase"),
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
      if (isScript(node)) return "script";
      if (isStyle(node)) return "style";
      return node.name;
    }

    /**
     * @param {Tag | StyleTag | ScriptTag} node
     */
    function check(node) {
      const raw = node.openStart.value.slice(1);
      const name = nameOf(node);
      if (
        name !== raw &&
        (svgStack.length === 0 || name.toLowerCase() === "svg")
      ) {
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

    /**
     * @param {Doctype} doctype
     */
    function checkDoctype(doctype) {
      if (doctype.open.value !== doctype.open.value.toLowerCase()) {
        context.report({
          node: doctype.open,
          messageId: MESSAGE_IDS.UNEXPECTED,
          data: {
            name: doctype.open.value.slice(1),
          },
          fix(fixer) {
            return fixer.replaceTextRange(doctype.open.range, "<!doctype");
          },
        });
      }
      if (doctype.attributes && doctype.attributes.length) {
        doctype.attributes.forEach((attribute) => {
          if (
            attribute.value &&
            attribute.value.value !== attribute.value.value.toLowerCase()
          ) {
            context.report({
              node: attribute.value,
              messageId: MESSAGE_IDS.UNEXPECTED,
              data: {
                name: attribute.value.value,
              },
              fix(fixer) {
                return fixer.replaceText(
                  // @ts-ignore
                  attribute.value,
                  // @ts-ignore
                  attribute.value.value.toLowerCase()
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
      Doctype: checkDoctype,
    });
  },
};
