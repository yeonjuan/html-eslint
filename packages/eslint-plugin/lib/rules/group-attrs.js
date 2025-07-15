/**
 * @import {Attribute} from "@html-eslint/types";
 * @import {RuleModule} from "../types";
 *
 * @typedef {Object} Option
 * @property {(string[]|string[])[]} [Option.groups] - Array of attribute groups that should be kept together and in order. Each group can contain strings or regex patterns as strings (e.g., "/^data-/")
 */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");
const { getSourceCode } = require("./utils/source-code");

const MESSAGE_IDS = {
  NOT_GROUPED: "notGrouped",
  WRONG_ORDER: "wrongOrder",
};

/**
 * Default attribute groups that are commonly related.
 * When multiple attributes from the same group are present,
 * they should be placed next to each other in the specified order.
 */
const DEFAULT_GROUPS = [
  ["type", "name", "value"],
  ["width", "height"],
  ["min", "max"],
  ["low", "high"],
  ["src", "srcset", "alt"],
  ["cols", "rows"],
  ["shadowrootclonable", "shadowrootdelegatesfocus", "shadowrootmode"],
  ["formaction", "formmethod", "formtarget"],
  ["minlength", "maxlength"],
  ["left", "top", "right", "bottom"],
  // Group ARIA attributes
  ["aria-valuemin", "aria-valuenow", "aria-valuemax", "aria-valuetext"],
  ["aria-rowindex", "aria-colindex"],
  ["aria-rowspan", "aria-colspan"],
  ["aria-rowcount", "aria-colcount"],
  ["aria-label", "aria-labelledby", "aria-describedby"],
  ["aria-expanded", "aria-haspopup"],
  // Remaining ARIA attributes aren't sorted, but are grouped together
  ["role", "/^aria-/"],
];

/**
 * Check if an attribute matches a group pattern
 * @param {string} attrName - The attribute name to check
 * @param {string} pattern - The pattern to match against (can be a string or regex pattern like "/^data-/")
 * @returns {boolean} - True if the attribute matches the pattern
 */
function matchesPattern(attrName, pattern) {
  if (typeof pattern === "string") {
    // Check if it's a regex pattern (starts and ends with /)
    if (pattern.startsWith("/") && pattern.endsWith("/")) {
      try {
        const regex = new RegExp(pattern.slice(1, -1));
        return regex.test(attrName);
      } catch (e) { // eslint-disable-line no-unused-vars
        // If regex is invalid, fall back to exact string match
        return attrName === pattern;
      }
    }
    // Exact string match
    return attrName === pattern;
  }
  return false;
}

/**
 * Find which group an attribute belongs to
 * @param {string} attrName - The attribute name
 * @param {string[][]} groups - The groups to check
 * @returns {number} - The index of the first matching group, or -1 if no match
 */
function findAttributeGroup(attrName, groups) {
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    for (const pattern of group) {
      if (matchesPattern(attrName, pattern)) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * @type {RuleModule<[Option]>}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforce grouping and ordering of related attributes",
      category: RULE_CATEGORY.STYLE,
      recommended: false,
      url: getRuleUrl("group-attrs"),
    },

    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          groups: {
            type: "array",
            items: {
              type: "array",
              items: {
                type: "string"
              },
              minItems: 1,
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [MESSAGE_IDS.NOT_GROUPED]:
        "Related attributes should be grouped together: {{attrs}} (found separated by: {{separator}})",
      [MESSAGE_IDS.WRONG_ORDER]:
        "Related attributes should be in the correct order: {{attrs}} (expected order: {{expectedOrder}})",
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const groups = options.groups || DEFAULT_GROUPS;

    /**
     * @param {Attribute[]} attributes
     */
    function checkAttributes(attributes) {
      if (attributes.length <= 1) {
        return;
      }

      // Map each attribute to its group index (first match wins)
      /** @type {Map<number, {attrName: string, index: number, groupIndex: number}[]>} */
      const groupMap = new Map();

      for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];
        const attrName = attr.key.value;
        const groupIndex = findAttributeGroup(attrName, groups);
        
        if (groupIndex !== -1) {
          if (!groupMap.has(groupIndex)) {
            groupMap.set(groupIndex, []);
          }
          const groupList = groupMap.get(groupIndex);
          if (groupList) {
            groupList.push({
              attrName,
              index: i,
              groupIndex
            });
          }
        }
      }

      // Check each group for violations
      for (const [groupIndex, attrInfos] of groupMap) {
        if (attrInfos.length <= 1) {
          continue;
        }

        const group = groups[groupIndex];
        const indices = attrInfos.map(info => info.index);
        const foundAttrs = attrInfos.map(info => info.attrName);

        const firstIndex = Math.min(...indices);
        const lastIndex = Math.max(...indices);

        // Check if indices are consecutive
        const sortedIndices = [...indices].sort((a, b) => a - b);
        const isConsecutive = sortedIndices.every(
          (index, i) => i === 0 || index === sortedIndices[i - 1] + 1
        );

        if (!isConsecutive) {
          // Grouping violation: attributes are not together
          const separatorAttrs = [];
          for (let i = firstIndex + 1; i < lastIndex; i++) {
            if (!indices.includes(i)) {
              separatorAttrs.push(attributes[i].key.value);
            }
          }

          context.report({
            loc: {
              start: attributes[firstIndex].loc.start,
              end: attributes[lastIndex].loc.end,
            },
            messageId: MESSAGE_IDS.NOT_GROUPED,
            data: {
              attrs: foundAttrs.join(", "),
              separator: separatorAttrs.join(", "),
            },
            fix(fixer) {
              return fixAttributeOrder(
                fixer,
                attributes,
                indices,
                group,
                foundAttrs
              );
            },
          });
          return; // Only report one violation at a time
        } else {
          // Check ordering violation: attributes are together but in wrong order
          const isRegexGroup = group.length === 1 && 
            typeof group[0] === "string" && 
            group[0].startsWith("/") && 
            group[0].endsWith("/");
          
          let isCorrectOrder;
          /** @type {string[]} */
          let expectedOrder;
          
          if (isRegexGroup) {
            // For regex groups, sort alphabetically
            expectedOrder = [...foundAttrs].sort();
            isCorrectOrder = foundAttrs.every((attr, i) => attr === expectedOrder[i]);
          } else {
            // For string groups, follow the defined order
            expectedOrder = group.filter((pattern) => {
              return foundAttrs.some(attr => matchesPattern(attr, pattern));
            });
            
            // Create a mapping of expected positions
            const expectedPositions = new Map();
            let position = 0;
            for (const pattern of expectedOrder) {
              for (const attr of foundAttrs) {
                if (matchesPattern(attr, pattern) && !expectedPositions.has(attr)) {
                  expectedPositions.set(attr, position++);
                }
              }
            }

            isCorrectOrder = foundAttrs.every(
              (attr, i) => {
                const expectedPos = expectedPositions.get(attr);
                return expectedPos === i;
              }
            );
          }

          if (!isCorrectOrder) {
            context.report({
              loc: {
                start: attributes[firstIndex].loc.start,
                end: attributes[lastIndex].loc.end,
              },
              messageId: MESSAGE_IDS.WRONG_ORDER,
              data: {
                attrs: foundAttrs.join(", "),
                expectedOrder: isRegexGroup ? expectedOrder.join(", ") : foundAttrs.sort((a, b) => {
                  const aIndex = expectedOrder.findIndex(pattern => matchesPattern(a, pattern));
                  const bIndex = expectedOrder.findIndex(pattern => matchesPattern(b, pattern));
                  return aIndex - bIndex;
                }).join(", "),
              },
              fix(fixer) {
                return fixAttributeOrder(
                  fixer,
                  attributes,
                  indices,
                  group,
                  foundAttrs
                );
              },
            });
            return; // Only report one violation at a time
          }
        }
      }
    }

    /**
     * Fix attribute order by grouping and sorting them correctly
     * @param {*} fixer
     * @param {Attribute[]} attributes
     * @param {number[]} indices
     * @param {string[]} group
     * @param {string[]} foundAttrs
     */
    function fixAttributeOrder(fixer, attributes, indices, group, foundAttrs) {
      const sourceCode = getSourceCode(context);
      const source = sourceCode.getText();

      // Get the attributes that need to be reordered
      const attrsToReorder = indices.map((i) => attributes[i]);

      // Sort them according to the group order
      const isRegexGroup = group.length === 1 && 
        typeof group[0] === "string" && 
        group[0].startsWith("/") && 
        group[0].endsWith("/");
      
      if (isRegexGroup) {
        // For regex groups, sort alphabetically
        attrsToReorder.sort((a, b) => a.key.value.localeCompare(b.key.value));
      } else {
        // For string groups, follow the defined order
        const expectedOrder = group.filter((pattern) => {
          return foundAttrs.some(attr => matchesPattern(attr, pattern));
        });
        attrsToReorder.sort((a, b) => {
          const aIndex = expectedOrder.findIndex(pattern => matchesPattern(a.key.value, pattern));
          const bIndex = expectedOrder.findIndex(pattern => matchesPattern(b.key.value, pattern));
          return aIndex - bIndex;
        });
      }

      // Create a fixed version of all attributes by building the new arrangement
      const fixed = [];
      let groupInserted = false;
      const targetInsertIndex = Math.min(...indices); // Insert grouped attrs at position of first occurrence

      for (let i = 0; i < attributes.length; i++) {
        if (i === targetInsertIndex && !groupInserted) {
          // Insert the grouped/reordered attributes at the position of first occurrence
          fixed.push(...attrsToReorder);
          groupInserted = true;
        } else if (!indices.includes(i)) {
          // Only add non-grouped attributes
          fixed.push(attributes[i]);
        }
        // Skip attributes that are part of the group (they're already inserted above)
      }

      // Build the replacement text
      let result = "";
      for (let i = 0; i < fixed.length; i++) {
        const attr = fixed[i];
        result += source.slice(attr.range[0], attr.range[1]);

        // Add spacing between attributes
        if (i < fixed.length - 1) {
          result += " ";
        }
      }

      return fixer.replaceTextRange(
        [attributes[0].range[0], attributes[attributes.length - 1].range[1]],
        result
      );
    }

    return createVisitors(context, {
      Tag(node) {
        checkAttributes(node.attributes);
      },
      ScriptTag(node) {
        checkAttributes(node.attributes);
      },
      StyleTag(node) {
        checkAttributes(node.attributes);
      },
    });
  },
};
