/**
 * @import {RuleModule} from "../types";
 * @import {Text} from "@html-eslint/types";
 */

// Define the type for entities.json
/**
 * @typedef {Object} EntityData
 * @property {number[]} codepoints
 * @property {string} characters
 */

/** @type {{ [key: string]: EntityData }} */
const entities = require("../data/entities.json");

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  INVALID_ENTITY: "invalidEntity",
};

/**
 * @type {RuleModule<[]>}
 */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "Disallows the use of invalid HTML entities",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
      url: getRuleUrl("no-invalid-entity"),
    },
    fixable: null,
    hasSuggestions: false,
    schema: [],
    messages: {
      [MESSAGE_IDS.INVALID_ENTITY]: "Invalid HTML entity '{{entity}}' used.",
    },
  },

  create(context) {
    /**
     * @param {Text} node
     */
    function check(node) {
      const text = node.value;

      // Regular expression to match named and numeric entities
      const entityRegex = /&([a-zA-Z]+|#[0-9]+|#x[0-9a-fA-F]+|[#][^;]+);/g;
      let match;

      while ((match = entityRegex.exec(text)) !== null) {
        const entity = match[0];
        const entityName = match[1];

        // Check named entities
        if (!entityName.startsWith("#")) {
          const fullEntity = `&${entityName};`;
          if (!Object.prototype.hasOwnProperty.call(entities, fullEntity)) {
            context.report({
              node,
              messageId: MESSAGE_IDS.INVALID_ENTITY,
              data: { entity },
            });
          }
        }
        // Check numeric entities
        else {
          const isHex = entityName[1] === "x";
          const numStr = isHex ? entityName.slice(2) : entityName.slice(1);
          const num = isHex ? parseInt(numStr, 16) : parseInt(numStr, 10);

          // If the number is not a valid integer, report an error
          if (isNaN(num)) {
            context.report({
              node,
              messageId: MESSAGE_IDS.INVALID_ENTITY,
              data: { entity },
            });
            continue;
          }

          // Check if the numeric entity is valid (exists in entities.json or within valid Unicode range)
          const entityKey = Object.keys(entities).find((key) => {
            const codepoints = entities[key].codepoints;
            return codepoints.length === 1 && codepoints[0] === num;
          });

          if (!entityKey && (num < 0 || num > 0x10ffff)) {
            context.report({
              node,
              messageId: MESSAGE_IDS.INVALID_ENTITY,
              data: { entity },
            });
          }
        }
      }
    }

    return createVisitors(context, {
      Text: check,
    });
  },
};
