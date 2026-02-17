/**
 * @import {
 *   ElementNodeAdapter,
 *   UseBaselineOptions,
 *   UseBaselineResult
 * } from "../types"
 */
import {
  elements,
  globalAttributes,
  BASELINE_HIGH,
  BASELINE_LOW,
} from "../utils/baseline";

/**
 * @type {{
 *   noBaselineElement: "noBaselineElement";
 *   notBaselineElementAttribute: "notBaselineElementAttribute";
 *   notBaselineGlobalAttribute: "notBaselineGlobalAttribute";
 * }}
 */
export const USE_BASELINE_MESSAGE_IDS = {
  noBaselineElement: "noBaselineElement",
  notBaselineElementAttribute: "notBaselineElementAttribute",
  notBaselineGlobalAttribute: "notBaselineGlobalAttribute",
};

/**
 * @param {string[]} parts
 * @returns {string}
 */
function toStatusKey(...parts) {
  return parts.map((part) => part.toLowerCase().trim()).join(".");
}

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
  const [status, year = NaN] = encoded.split(":").map((part) => Number(part));
  return [status, year];
}

/**
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
 * @template ElementNode
 * @template AttributeKeyNode
 * @template AttributeValueNode
 * @param {UseBaselineOptions} options
 */
export function useBaseline(options) {
  const available = options.available;

  const baseYear = typeof available === "number" ? available : null;
  const baseStatus = available === "widely" ? BASELINE_HIGH : BASELINE_LOW;
  const availability = String(available);

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
   * @param {string} element
   * @param {string} key
   * @param {string} value
   * @returns {boolean}
   */
  function isSupportedElementSpecificAttributeKeyValue(element, key, value) {
    const statusKey = getElementAttributeSpecificStatusKey(element, key, value);
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

  return {
    /**
     * @param {ElementNodeAdapter<
     *   ElementNode,
     *   AttributeKeyNode,
     *   AttributeValueNode
     * >} adapter
     * @returns {UseBaselineResult<
     *   ElementNode,
     *   AttributeKeyNode,
     *   AttributeValueNode
     * >}
     */
    checkAttributes(adapter) {
      const elementName = adapter.getTagName();
      if (isCustomElement(elementName)) {
        return [];
      }

      if (!isSupportedElement(elementName)) {
        return [
          {
            messageId: USE_BASELINE_MESSAGE_IDS.noBaselineElement,
            node: adapter.node,
            data: {
              element: `<${elementName}>`,
              availability,
            },
          },
        ];
      }

      /**
       * @type {UseBaselineResult<
       *   ElementNode,
       *   AttributeKeyNode,
       *   AttributeValueNode
       * >}
       */
      const result = [];

      for (const attribute of adapter.getAttributes()) {
        const attributeKey = attribute.key().value;
        const attributeKeyIsExpression = attribute.key().isExpression();
        if (!attributeKey || attributeKeyIsExpression) {
          continue;
        }
        const attributeValue = attribute.value().value;

        if (!isSupportedElementAttributeKey(elementName, attributeKey)) {
          result.push({
            messageId: USE_BASELINE_MESSAGE_IDS.notBaselineElementAttribute,
            node: attribute.key().node,
            data: {
              element: `<${elementName}>`,
              attr: attributeKey,
              availability,
            },
          });
        } else if (!isSupportedGlobalAttributeKey(attributeKey)) {
          result.push({
            messageId: USE_BASELINE_MESSAGE_IDS.notBaselineGlobalAttribute,
            node: attribute.key().node,
            data: {
              attr: attributeKey,
              availability,
            },
          });
        } else if (attributeValue !== null) {
          if (
            !isSupportedElementAttributeKeyValue(
              elementName,
              attributeKey,
              attributeValue
            ) ||
            !isSupportedElementSpecificAttributeKeyValue(
              elementName,
              attributeKey,
              attributeValue
            )
          ) {
            result.push({
              messageId: USE_BASELINE_MESSAGE_IDS.notBaselineElementAttribute,
              node: attribute.value().node || adapter.node,
              data: {
                element: `<${elementName}>`,
                attr: `${attributeKey}="${attributeValue}"`,
                availability,
              },
            });
          } else if (
            !isSupportedGlobalAttributeKeyValue(attributeKey, attributeValue)
          ) {
            const valueNode = attribute.value().node;
            if (valueNode) {
              result.push({
                messageId: USE_BASELINE_MESSAGE_IDS.notBaselineGlobalAttribute,
                node: valueNode,
                data: {
                  attr: `${attributeKey}="${attributeValue}"`,
                  availability,
                },
              });
            }
          }
        }
      }
      return result;
    },
  };
}
