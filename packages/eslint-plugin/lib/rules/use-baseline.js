/**
 * @typedef {Object} Option
 * @property {"widely" | "newly" | number} Option.available
 * @typedef { import("../types").RuleModule<[Option]> } RuleModule
 */

const { RULE_CATEGORY } = require("../constants");
const { elements, BASELINE_HIGH, BASELINE_LOW } = require("./utils/baseline");

const MESSAGE_IDS = {
  NOT_BASELINE_ELEMENT: "notBaselineElement",
  NOT_BASELINE_ATTRIBUTE_KEY: "notBaselineAttributeKey",
  NOT_BASELINE_ATTRIBUTE_KEY_VALUE: "notBaselineAttributeKeyVALUE",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "TBD",
      recomended: true,
      category: RULE_CATEGORY.BEST_PRACTICE,
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
      [MESSAGE_IDS.NOT_BASELINE_ELEMENT]: "TBD",
      [MESSAGE_IDS.NOT_BASELINE_ATTRIBUTE_KEY]: "TBD",
      [MESSAGE_IDS.NOT_BASELINE_ATTRIBUTE_KEY_VALUE]: "TBD",
    },
  },

  create(context) {
    const options = context.options[0] || { available: "widely" };
    const available = options.available;

    const baseYear = typeof available === "number" ? available : null;
    const baseStatus = available === "widely" ? BASELINE_HIGH : BASELINE_LOW;
    const availability = String(available);

    /**
     * @param {string} name
     * @returns {boolean}
     */
    function isSupportedElement(name) {
      const encoded = elements.get(name);
      if (!encoded) {
        return true;
      }
      const [status, year = NaN] = encoded
        .split(":")
        .map((part) => Number(part));
      if (baseYear) {
        return year <= baseYear;
      }
      return status >= baseStatus;
    }

    return {
      Tag(node) {
        const name = node.name.toLowerCase();
        if (!isSupportedElement(name)) {
          context.report({
            node: node.openStart,
            messageId: MESSAGE_IDS.NOT_BASELINE_ELEMENT,
            data: {
              element: name,
              availability,
            },
          });
        }
      },
    };
  },
};
