/**
 * @typedef {Object} Option
 * @property {"widely" | "newly" | number} Option.available
 * @typedef { import("../types").RuleModule<[Option]> } RuleModule
 */

const { RULE_CATEGORY } = require("../constants");
const {
  elements,
  globalAttributes,
  BASELINE_HIGH,
  BASELINE_LOW,
} = require("./utils/baseline");

const MESSAGE_IDS = {
  NOT_BASELINE_ELEMENT: "notBaselineElement",
  NOT_BASELINE_ATTRIBUTE: "notBaselineAttribute",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "TBD",
      recommended: true,
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
      [MESSAGE_IDS.NOT_BASELINE_ATTRIBUTE]: "TBD",
    },
  },

  create(context) {
    const options = context.options[0] || { available: "widely" };
    const available = options.available;

    const baseYear = typeof available === "number" ? available : null;
    const baseStatus = available === "widely" ? BASELINE_HIGH : BASELINE_LOW;
    const availability = String(available);

    /**
     * @param {string} encoded
     * @returns {[number, number]}
     */
    function decodeStatus(encoded) {
      const [status, year = NaN] = encoded
        .split(":")
        .map((part) => Number(part));
      return [status, year];
    }

    /**
     * @param {string} encoded
     * @returns {boolean}
     */
    function isSupported(encoded) {
      const [status, year = NaN] = decodeStatus(encoded);
      if (baseYear) {
        return year <= baseYear;
      }
      return status >= baseStatus;
    }

    /**
     * @param {string} element
     * @returns {boolean}
     */
    function isSupportedElement(element) {
      const elementEncoded = elements.get(element);
      return !!elementEncoded && isSupported(elementEncoded);
    }

    /**
     * @param {string} element
     * @param {string} key
     * @returns {boolean}
     */
    function isSupportedAttributeKey(element, key) {
      const elementEncoded = elements.get(`${element}.${key}`);
      if (!!elementEncoded && isSupported(elementEncoded)) {
        return true;
      }
      const globalEncoded = globalAttributes.get(`${key}`);
      return !!globalEncoded && isSupported(globalEncoded);
    }

    /**
     * @param {string} element
     * @param {string} key
     * @param {string} value
     * @returns {boolean}
     */
    function isSupportedAttributeKeyValue(element, key, value) {
      const elementEncoded = elements.get(`${element}.${key}.${value}`);
      if (!!elementEncoded && isSupported(elementEncoded)) {
        return true;
      }
      const globalEncoded = globalAttributes.get(`${key}`);
      return !!globalEncoded && isSupported(globalEncoded);
    }

    return {
      Tag(node) {
        const elementName = node.name.toLowerCase();
        if (!isSupportedElement(elementName)) {
          context.report({
            node: node.openStart,
            messageId: MESSAGE_IDS.NOT_BASELINE_ELEMENT,
            data: {
              element: elementName,
              availability,
            },
          });
        }
        node.attributes.forEach((attribute) => {
          if (!isSupportedAttributeKey(elementName, attribute.key.value)) {
            context.report({
              node: attribute.key,
              messageId: MESSAGE_IDS.NOT_BASELINE_ATTRIBUTE,
              data: {
                element: elementName,
                key: attribute.key.value,
                availability,
              },
            });
          } else if (
            attribute.value &&
            !isSupportedAttributeKeyValue(
              elementName,
              attribute.key.value,
              attribute.value.value
            )
          ) {
            context.report({
              node: attribute.key,
              messageId: MESSAGE_IDS.NOT_BASELINE_ATTRIBUTE,
              data: {
                element: elementName,
                key: attribute.key.value,
                availability,
              },
            });
          }
        });
      },
    };
  },
};
