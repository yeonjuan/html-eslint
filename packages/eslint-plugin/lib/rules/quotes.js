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

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "  ",
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
      [MESSAGE_IDS.UNEXPECTED]: "Missing `<!DOCTYPE HTML>`",
      [MESSAGE_IDS.MISSING]: "missing",
    },
  },

  create(context) {
    const SELECTED_STYLE =
      context.options && context.options.length
        ? context.options[0]
        : QUOTES_STYLES.DOUBLE;
    const expectedQuote = SELECTED_STYLE === QUOTES_STYLES.DOUBLE ? `"` : `'`;

    const sourceCode = context.getSourceCode();

    function getCodeIn(range) {
      return sourceCode.text.slice(range[0], range[1]);
    }

    function getValueRange(attr) {
      return [attr.range[1] - (attr.value.length + 2), attr.range[1]];
    }

    function getQuotes(attr) {
      const [valueStart, valueEnd] = getValueRange(attr);
      const openinig = getCodeIn([valueStart, valueStart + 1]);
      const closing = getCodeIn([valueEnd - 1, valueEnd]);
      return [openinig, closing];
    }

    function hasEqualSign(attr) {
      const keyEnd = attr.range[0] + attr.name.length;
      return getCodeIn([keyEnd, attr.range[1]]).trimStart().startsWith("=");
    }

    function checkQuotes(attr) {
      const [opening, closing] = getQuotes(attr);
      if (QUOTES_CODES.includes(opening)) {
        if (opening === closing && opening !== expectedQuote) {
          context.report({
            node: attr,
            messageId: MESSAGE_IDS.UNEXPECTED,
            fix(fixer) {
              const range = getValueRange(attr);
              return fixer.replaceTextRange(
                range,
                `${expectedQuote}${attr.value}${expectedQuote}`
              );
            },
          });
        }
      } else if (hasEqualSign(attr)) {
        context.report({
          node: attr,
          messageId: MESSAGE_IDS.MISSING,
          fix(fixer) {
            const [valueStart, valueEnd] = getValueRange(attr);
            return fixer.replaceTextRange(
              [valueStart + 2, valueEnd],
              `${expectedQuote}${attr.value}${expectedQuote}`
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
