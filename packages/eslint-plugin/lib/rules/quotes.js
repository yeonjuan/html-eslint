/**
 * @import {AST} from "eslint";
 * @import {Attribute, Tag, ScriptTag, StyleTag} from "@html-eslint/types";
 * @import {RuleModule} from "../types";
 *
 * @typedef {"single" | "double"} SingleOrQuoteOption
 * @typedef {{enforceTemplatedAttrValue: boolean}} ObjectOption
 */

const { NODE_TYPES } = require("@html-eslint/parser");
const { RULE_CATEGORY } = require("../constants");
const { getSourceCode } = require("./utils/source-code");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
  MISSING: "missing",
};

const QUOTES_STYLES = {
  SINGLE: "single",
  DOUBLE: "double",
};

const QUOTES_CODES = [`"`, `'`];

/**
 * @type {RuleModule<[SingleOrQuoteOption, ObjectOption]>}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description:
        "Enforce consistent quoting attributes with double(\") or single(')",
      category: RULE_CATEGORY.STYLE,
      recommended: true,
      url: getRuleUrl("quotes"),
    },
    fixable: true,
    schema: [
      {
        enum: [QUOTES_STYLES.SINGLE, QUOTES_STYLES.DOUBLE],
      },
      {
        type: "object",
        properties: {
          enforceTemplatedAttrValue: {
            type: "boolean",
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]:
        "Expected {{expected}} quotes but found {{actual}}.",
      [MESSAGE_IDS.MISSING]:
        "Expected {{expected}} quotes but no quotes found.",
    },
  },

  create(context) {
    const SELECTED_STYLE =
      context.options && context.options.length
        ? context.options[0]
        : QUOTES_STYLES.DOUBLE;
    const expectedQuote = SELECTED_STYLE === QUOTES_STYLES.DOUBLE ? `"` : `'`;
    const enforceTemplatedAttrValue =
      context.options &&
      context.options[1] &&
      context.options[1].enforceTemplatedAttrValue;

    const sourceCode = getSourceCode(context);

    /**
     * @param {AST.Range} range
     * @returns {string}
     */
    function getCodeIn(range) {
      return sourceCode.text.slice(range[0], range[1]);
    }

    /**
     *
     * @param {Attribute} attr
     * @returns {[string, string]}
     */
    function getQuotes(attr) {
      // @ts-ignore
      return [attr.startWrapper.value, attr.endWrapper.value];
    }

    /**
     * @param {Attribute} attr
     * @returns {void}
     */
    function checkQuotes(attr) {
      if (!attr.value || attr.value.value.includes(expectedQuote)) {
        return;
      }
      /**
       * Allow template expression.
       * ex: html`<div foo=${foo}></div>`
       */
      if (
        !enforceTemplatedAttrValue &&
        attr.value.parts.some((part) => part.type === NODE_TYPES.Template)
      ) {
        return;
      }

      if (attr.startWrapper && attr.endWrapper) {
        const [opening, closing] = getQuotes(attr);
        if (QUOTES_CODES.includes(opening)) {
          if (opening === closing && opening !== expectedQuote) {
            context.report({
              node: attr,
              messageId: MESSAGE_IDS.UNEXPECTED,
              data: {
                expected: `${SELECTED_STYLE}(${expectedQuote})`,
                actual:
                  SELECTED_STYLE === QUOTES_STYLES.SINGLE
                    ? `${QUOTES_STYLES.DOUBLE}(")`
                    : `${QUOTES_STYLES.SINGLE}(')`,
              },
              fix(fixer) {
                if (
                  !attr.startWrapper ||
                  !attr.endWrapper ||
                  attr.value === undefined
                )
                  return null;
                return fixer.replaceTextRange(
                  [attr.startWrapper.range[0], attr.endWrapper.range[1]],
                  `${expectedQuote}${attr.value.value}${expectedQuote}`
                );
              },
            });
          }
        }
      } else {
        context.report({
          node: attr,
          messageId: MESSAGE_IDS.MISSING,
          data: {
            expected: `${SELECTED_STYLE}(${expectedQuote})`,
          },
          fix(fixer) {
            if (attr.value === undefined) return null;
            const originCode = getCodeIn(attr.value.range);
            return fixer.replaceTextRange(
              attr.value.range,
              `${expectedQuote}${originCode}${expectedQuote}`
            );
          },
        });
      }
    }
    /**
     * @param {Tag | ScriptTag | StyleTag} node
     */
    function check(node) {
      node.attributes.forEach((attr) => checkQuotes(attr));
    }

    return createVisitors(context, {
      Tag: check,
      ScriptTag: check,
      StyleTag: check,
    });
  },
};
