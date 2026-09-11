/**
 * @import {
 *   AttributeAdapter,
 *   RequireAttrsCondition,
 *   RequireAttrsOptions,
 *   RequireAttrsResult
 * } from "../types"
 */

/** @type {{ missing: "missing"; unexpected: "unexpected" }} */
export const REQUIRE_ATTRS_MESSAGE_IDS = {
  missing: "missing",
  unexpected: "unexpected",
};

/**
 * @param {string | null} attrValue
 * @returns {boolean}
 */
function isPresent(attrValue) {
  return attrValue !== null;
}

/**
 * @param {string | null} attrValue
 * @returns {boolean}
 */
function isAbsent(attrValue) {
  return attrValue === null;
}

/**
 * @param {string | null} attrValue
 * @param {string | undefined} value
 * @returns {boolean}
 */
function isEqual(attrValue, value) {
  return attrValue !== null && attrValue === value;
}

/**
 * @param {string | null} attrValue
 * @param {string | undefined} value
 * @returns {boolean}
 */
function isNotEqual(attrValue, value) {
  return attrValue === null || attrValue !== value;
}

/**
 * @param {RequireAttrsCondition} condition
 * @param {AttributeAdapter[]} attributes
 * @returns {boolean}
 */
function evaluateCondition(condition, attributes) {
  const matchingAttr = attributes.find((a) => {
    const key = a.getKey();
    return key && !key.hasExpression() && key.getValue() === condition.attr;
  });

  switch (condition.kind) {
    case "present":
      return isPresent(matchingAttr ? "" : null);
    case "absent":
      return isAbsent(matchingAttr ? "" : null);
    case "equal": {
      if (!matchingAttr) return false;
      const valueAdapter = matchingAttr.getValue();
      if (!valueAdapter) return false;
      return isEqual(valueAdapter.getValue(), condition.value);
    }
    case "not-equal": {
      if (!matchingAttr) return true;
      const valueAdapter = matchingAttr.getValue();
      if (!valueAdapter) return true;
      return isNotEqual(valueAdapter.getValue(), condition.value);
    }
    default:
      return false;
  }
}

/** @param {RequireAttrsOptions} options */
export function requireAttrs(options) {
  /** @type {Map<string, RequireAttrsOptions>} */
  const tagOptionsMap = new Map();

  for (const option of options) {
    const tagName = option.tag.toLowerCase();
    const existing = tagOptionsMap.get(tagName);
    tagOptionsMap.set(tagName, existing ? [...existing, option] : [option]);
  }

  return {
    /**
     * @param {import("../types").ElementAdapter} adapter
     * @returns {RequireAttrsResult}
     */
    checkElement(adapter) {
      const tagName = adapter.getElementName().toLowerCase();
      const tagOptions = tagOptionsMap.get(tagName);
      if (!tagOptions || !tagOptions.length) return [];

      const attributes = adapter.getAttributes();
      /** @type {RequireAttrsResult} */
      const result = [];

      for (const option of tagOptions) {
        const attrName = option.attr;
        const attr = attributes.find((a) => {
          const key = a.getKey();
          return key && key.getValue() === attrName;
        });

        if (option.conditions) {
          const conditionsMet = option.conditions.every((condition) =>
            evaluateCondition(condition, attributes)
          );
          if (!conditionsMet) continue;

          if (!attr) {
            result.push({
              ...(option.message
                ? { message: option.message }
                : { messageId: REQUIRE_ATTRS_MESSAGE_IDS.missing }),
              loc: adapter.getLocation(),
              data: { attr: attrName, tag: tagName },
              fix:
                typeof option.value === "string"
                  ? (() => {
                      const openStartEnd = adapter.getOpenStartRange()[1];
                      return {
                        range: /** @type {[number, number]} */ ([
                          openStartEnd,
                          openStartEnd,
                        ]),
                        text: ` ${attrName}="${option.value}"`,
                      };
                    })()
                  : undefined,
            });
          }
        } else {
          if (!attr) {
            result.push({
              ...(option.message
                ? { message: option.message }
                : { messageId: REQUIRE_ATTRS_MESSAGE_IDS.missing }),
              loc: adapter.getLocation(),
              data: { attr: attrName, tag: tagName },
              fix:
                typeof option.value === "string"
                  ? (() => {
                      const openStartEnd = adapter.getOpenStartRange()[1];
                      return {
                        range: /** @type {[number, number]} */ ([
                          openStartEnd,
                          openStartEnd,
                        ]),
                        text: ` ${attrName}="${option.value}"`,
                      };
                    })()
                  : undefined,
            });
          } else if (typeof option.value === "string") {
            const key = attr.getKey();
            if (key && key.hasExpression()) continue;
            const valueAdapter = attr.getValue();
            if (valueAdapter && valueAdapter.hasExpression()) continue;
            const currentValue = valueAdapter ? valueAdapter.getValue() : null;
            if (currentValue !== option.value) {
              /** @type {import("../types").RequireAttrsFix | undefined} */
              let fix;
              if (option.value) {
                if (valueAdapter) {
                  const range = valueAdapter.getRange();
                  fix = { range: [range[0], range[1]], text: option.value };
                } else if (key) {
                  const keyEnd = key.getRange()[1];
                  fix = {
                    range: [keyEnd, keyEnd],
                    text: `="${option.value}"`,
                  };
                }
              }
              result.push({
                ...(option.message
                  ? { message: option.message }
                  : { messageId: REQUIRE_ATTRS_MESSAGE_IDS.unexpected }),
                loc: attr.getLocation(),
                data: { attr: attrName, expected: option.value },
                fix,
              });
            }
          }
        }
      }

      return result;
    },
  };
}
