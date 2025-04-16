/**
 * @typedef {Object} Option
 * @property {"widely" | "newly" | number} Option.available
 * @typedef { import("../types").RuleModule<[Option]> } RuleModule
 * @typedef {import("@html-eslint/types").Attribute} Attribute
 * @typedef {import("@html-eslint/types").Tag} Tag
 * @typedef {import("@html-eslint/types").ScriptTag} ScriptTag
 * @typedef {import("@html-eslint/types").StyleTag} StyleTag
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
  NOT_BASELINE_ELEMENT_ATTRIBUTE: "notBaselineElementAttribute",
  NOT_BASELINE_GLOBAL_ATTRIBUTE: "notBaselineGlobalAttribute",
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
      [MESSAGE_IDS.NOT_BASELINE_ELEMENT_ATTRIBUTE]:
        "Attribute '{{attr}}' on '{{element}}' is not a {{availability}} available baseline feature.",
      [MESSAGE_IDS.NOT_BASELINE_GLOBAL_ATTRIBUTE]:
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
     * @param {string[]} parts
     * @returns {string}
     */
    function toStatusKey(...parts) {
      return parts.map((part) => part.toLowerCase().trim()).join(".");
    }

    /**
     * @param {string} element
     * @param {string} key
     * @returns {boolean}
     */
    function isSupportedElementAttributeKey(element, key) {
      const elementStatus = elements.get(toStatusKey(element, key));
      if (!elementStatus) {
        return true;
      }
      return isSupported(elementStatus);
    }

    /**
     * @param {string} key
     * @returns {boolean}
     */
    function isSupportedGlobalAttributeKey(key) {
      const globalAttrStatus = globalAttributes.get(toStatusKey(key));
      if (!globalAttrStatus) {
        return true;
      }
      return isSupported(globalAttrStatus);
    }

    /**
     * @param {string} element
     * @param {string} key
     * @param {string} value
     * @returns {boolean}
     */
    function isSupportedElementAttributeKeyValue(element, key, value) {
      const elementStatus = elements.get(toStatusKey(element, key, value));
      if (!elementStatus) {
        return true;
      }
      return isSupported(elementStatus);
    }

    /**
     * @param {string} key
     * @param {string} value
     * @returns {boolean}
     */
    function isSupportedGlobalAttributeKeyValue(key, value) {
      const globalAttrStatus = globalAttributes.get(toStatusKey(key, value));
      if (!globalAttrStatus) {
        return true;
      }
      return isSupported(globalAttrStatus);
    }

    /**
     *
     * @param {string} element
     * @param {string} key
     * @param {string} value
     * @returns {string | null}
     */
    function getElementAttributeSpecificStatusKey(element, key, value) {
      const elementName = element.toLowerCase();
      const attributeKey = key.toLowerCase();
      const attributeValue = value.toLowerCase();

      // <input type="...">
      if (elementName === "input" && attributeKey === "type") {
        return `input.type_${attributeValue}`;
      }

      // <a href="sms:0000..">
      if (
        elementName === "a" &&
        attributeKey === "href" &&
        attributeValue.trim().startsWith("sms:")
      ) {
        return "a.href.href_sms";
      }

      // <td rowspan="0"> <th rowspan="0">
      if (
        (elementName === "td" || elementName === "th") &&
        attributeKey === "rowspan" &&
        attributeValue === "0"
      ) {
        return `${elementName}.rowspan.rowspan_zero`;
      }
      return null;
    }

    /**
     * @param {string} element
     * @param {string} key
     * @param {string} value
     * @returns {boolean}
     */
    function isSupportedElementSpecificAttributeKeyValue(element, key, value) {
      const statusKey = getElementAttributeSpecificStatusKey(
        element,
        key,
        value
      );
      if (!statusKey) {
        return true;
      }
      const elementStatus = elements.get(statusKey);
      if (!elementStatus) {
        return true;
      }
      return isSupported(elementStatus);
    }

    /**
     * @param {Tag | ScriptTag | StyleTag} node
     * @param {string} elementName
     * @param {Attribute[]} attributes
     */
    function check(node, elementName, attributes) {
      if (isCustomElement(elementName)) {
        return;
      }

      if (!isSupportedElement(elementName)) {
        context.report({
          node: node.openStart,
          messageId: MESSAGE_IDS.NOT_BASELINE_ELEMENT,
          data: {
            element: `<${elementName}>`,
            availability,
          },
        });
      }
      attributes.forEach((attribute) => {
        if (!isSupportedElementAttributeKey(elementName, attribute.key.value)) {
          context.report({
            node: attribute.key,
            messageId: MESSAGE_IDS.NOT_BASELINE_ELEMENT_ATTRIBUTE,
            data: {
              element: `<${elementName}>`,
              attr: attribute.key.value,
              availability,
            },
          });
        } else if (!isSupportedGlobalAttributeKey(attribute.key.value)) {
          context.report({
            node: attribute.key,
            messageId: MESSAGE_IDS.NOT_BASELINE_GLOBAL_ATTRIBUTE,
            data: {
              attr: attribute.key.value,
              availability,
            },
          });
        } else if (attribute.value) {
          if (
            !isSupportedElementAttributeKeyValue(
              elementName,
              attribute.key.value,
              attribute.value.value
            ) ||
            !isSupportedElementSpecificAttributeKeyValue(
              elementName,
              attribute.key.value,
              attribute.value.value
            )
          ) {
            context.report({
              node: attribute.value,
              messageId: MESSAGE_IDS.NOT_BASELINE_ELEMENT_ATTRIBUTE,
              data: {
                element: `<${elementName}>`,
                attr: `${attribute.key.value}="${attribute.value.value}"`,
                availability,
              },
            });
          } else if (
            !isSupportedGlobalAttributeKeyValue(
              attribute.key.value,
              attribute.value.value
            )
          ) {
            context.report({
              node: attribute.value,
              messageId: MESSAGE_IDS.NOT_BASELINE_GLOBAL_ATTRIBUTE,
              data: {
                attr: `${attribute.key.value}="${attribute.value.value}"`,
                availability,
              },
            });
          }
        }
      });
    }

    return createVisitors(context, {
      ScriptTag(node) {
        check(node, "script", node.attributes);
      },
      StyleTag(node) {
        check(node, "style", node.attributes);
      },
      Tag(node) {
        check(node, node.name, node.attributes);
      },
    });
  },
};
