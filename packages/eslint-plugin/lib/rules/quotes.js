/**
 * @typedef {import("../types").Rule} Rule
 * @typedef {import("../types").Range} Range
 * @typedef {import("../types").AttrNode} AttrNode
 */

const { RULE_CATEGORY } = require("../constants");

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
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description:
        "Enforce consistent quoting attributes with double(\") or single(')",
      category: RULE_CATEGORY.STYLE,
      recommended: true,
    },
    fixable: true,
    schema: [
      {
        enum: [QUOTES_STYLES.SINGLE, QUOTES_STYLES.DOUBLE],
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

    const sourceCode = context.getSourceCode();

    /**
     * @param {Range} range
     * @returns {string}
     */
    function getCodeIn(range) {
      return sourceCode.text.slice(range[0], range[1]);
    }

    /**
     * @param {AttrNode} attr
     * @returns {Range}
     */
    function getValueRange(attr) {
      const attrCode = getCodeIn(attr.range);
      const [matched = ""] = attrCode.match(/\S*?\s*=\s*/) || [];
      return [attr.range[0] + matched.length, attr.range[1]];
    }

    /**
     * @param {AttrNode} attr
     * @returns {[string, string]}
     */
    function getQuotes(attr) {
      const [valueStart, valueEnd] = getValueRange(attr);
      const opening = getCodeIn([valueStart, valueStart + 1]);
      const closing = getCodeIn([valueEnd - 1, valueEnd]);
      return [opening, closing];
    }

    /**
     * @param {AttrNode} attr
     * @returns {boolean}
     */
    function hasEqualSign(attr) {
      const keyEnd = attr.range[0] + attr.name.length;
      return getCodeIn([keyEnd, attr.range[1]]).trimStart().startsWith("=");
    }

    /**
     * @param {AttrNode} attr
     */
    function checkQuotes(attr) {
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
              const range = getValueRange(attr);
              const originCode = getCodeIn(range);
              const onlyValue = originCode.slice(1, originCode.length - 1);

              return fixer.replaceTextRange(
                range,
                `${expectedQuote}${onlyValue}${expectedQuote}`
              );
            },
          });
        }
      } else if (hasEqualSign(attr)) {
        context.report({
          node: attr,
          messageId: MESSAGE_IDS.MISSING,
          data: {
            expected: `${SELECTED_STYLE}(${expectedQuote})`,
          },
          fix(fixer) {
            const range = getValueRange(attr);
            const originCode = getCodeIn(range);
            return fixer.replaceTextRange(
              range,
              `${expectedQuote}${originCode}${expectedQuote}`
            );
          },
        });
      }
    }

    return {
      "*"(node) {
        (node.attrs || []).forEach(checkQuotes);
      },
    };
  },
};
