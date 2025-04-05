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
const { createVisitors } = require("./utils/visitors");

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
      description: "Enforce the use of baseline features.",
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
      [MESSAGE_IDS.NOT_BASELINE_ELEMENT]:
        "Element '{{element}}' is not a {{availability}} available baseline feature.",
      [MESSAGE_IDS.NOT_BASELINE_ATTRIBUTE]:
        "Attribute '{{attr}}' is not a {{availability}} available baseline feature.",
    },
  },

  create(context) {
    const options = context.options[0] || { available: "widely" };
    const available = options.available;

    const baseYear = typeof available === "number" ? available : null;
    const baseStatus = available === "widely" ? BASELINE_HIGH : BASELINE_LOW;
    const availability = String(available);

    /**
     * @param {string} element
     * @returns {boolean}
     */
    function isCustomElement(element) {
      return element.includes("-");
    }

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
      if (!elementEncoded) {
        return true;
      }
      return isSupported(elementEncoded);
    }

    /**
     * @param {string} element
     * @param {string} key
     * @returns {boolean}
     */
    function isSupportedAttributeKey(element, key) {
      const elementEncoded = elements.get(`${element}.${key}`);
      if (elementEncoded) {
        return isSupported(elementEncoded);
      }
      const globalEncoded = globalAttributes.get(key);
      if (!globalEncoded) {
        return true;
      }
      return isSupported(globalEncoded);
    }

    /**
     * @param {string} element
     * @param {string} key
     * @param {string} value
     * @returns {boolean}
     */
    function isSupportedAttributeKeyValue(element, key, value) {
      const elementEncoded = elements.get(`${element}.${key}.${value}`);

      if (elementEncoded) {
        return isSupported(elementEncoded);
      }
      const globalEncoded = globalAttributes.get(`${key}.${value}`);
      if (!globalEncoded) {
        return true;
      }
      return isSupported(globalEncoded);
    }

    return createVisitors(context, {
      Tag(node) {
        const elementName = node.name.toLowerCase();
        if (isCustomElement(elementName)) {
          return;
        }

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
                attr: attribute.key.value,
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
              node: attribute,
              messageId: MESSAGE_IDS.NOT_BASELINE_ATTRIBUTE,
              data: {
                element: elementName,
                attr: `${attribute.key.value}="${attribute.value.value}"`,
                availability,
              },
            });
          }
        });
      },
    });
  },
};
