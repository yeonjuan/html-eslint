/**
 * @import {Attribute} from "@html-eslint/types";
 * @import {RuleModule} from "../types";
 *
 * @typedef {Object} Option
 * @property {string[][]} [Option.groups] - Array of attribute groups that should be kept together and in order
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
  ["min", "max"],
  ["minlength", "maxlength"],
  ["width", "height"],
  ["aria-labelledby", "aria-describedby"],
  ["data-min", "data-max"],
  ["left", "top", "right", "bottom"],
];

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
                type: "string",
              },
              minItems: 2,
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

      for (const group of groups) {
        /** @type {string[]} */
        const foundAttrs = [];
        /** @type {number[]} */
        const indices = [];
        
        // Find which attributes from this group are present
        for (let i = 0; i < attributes.length; i++) {
          const attr = attributes[i];
          if (group.includes(attr.key.value)) {
            foundAttrs.push(attr.key.value);
            indices.push(i);
          }
        }
        
        // If we have multiple attributes from this group, check violations
        if (foundAttrs.length > 1) {
          const firstIndex = indices[0];
          const lastIndex = indices[indices.length - 1];
          
          // Check if indices are consecutive
          const isConsecutive = indices.every((index, i) => 
            i === 0 || index === indices[i - 1] + 1
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
                return fixAttributeOrder(fixer, attributes, indices, group, foundAttrs);
              },
            });
            return; // Only report one violation at a time
          } else {
            // Check ordering violation: attributes are together but in wrong order
            const expectedOrder = group.filter(attr => foundAttrs.includes(attr));
            const isCorrectOrder = foundAttrs.every((attr, i) => attr === expectedOrder[i]);
            
            if (!isCorrectOrder) {
              context.report({
                loc: {
                  start: attributes[firstIndex].loc.start,
                  end: attributes[lastIndex].loc.end,
                },
                messageId: MESSAGE_IDS.WRONG_ORDER,
                data: {
                  attrs: foundAttrs.join(", "),
                  expectedOrder: expectedOrder.join(", "),
                },
                fix(fixer) {
                  return fixAttributeOrder(fixer, attributes, indices, group, foundAttrs);
                },
              });
              return; // Only report one violation at a time
            }
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
      const attrsToReorder = indices.map(i => attributes[i]);
      
      // Sort them according to the group order
      const expectedOrder = group.filter(attr => foundAttrs.includes(attr));
      attrsToReorder.sort((a, b) => {
        const aIndex = expectedOrder.indexOf(a.key.value);
        const bIndex = expectedOrder.indexOf(b.key.value);
        return aIndex - bIndex;
      });
      
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
