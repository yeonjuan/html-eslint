/**
 * @typedef { import("@html-eslint/types").Tag } Tag
 * @typedef { import("@html-eslint/types").StyleTag } StyleTag
 * @typedef { import("@html-eslint/types").ScriptTag } ScriptTag
 * @typedef { import("@html-eslint/types").AttributeValue } AttributeValue
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 * @typedef {Object} ClassInfo
 * @property {string} name
 * @property {import("@html-eslint/types").AnyNode['loc']} loc
 * @property {import("@html-eslint/types").AnyNode['range']} range
 */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");

const MESSAGE_IDS = {
  DUPLICATE_CLASS: "duplicateClass",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow to use duplicate class",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.DUPLICATE_CLASS]: "The class '{{class}}' is duplicated.",
    },
  },

  create(context) {
    /**
     * @param {AttributeValue} value
     * @returns {{name: string, column: number}[]}
     */
    function splitClass(value) {
      /**
       * @type {{name: string, column: number}[]}
       */
      const result = [];
      const regex = /\S+/g;
      /**
       * @type {RegExpExecArray | null}
       */
      let match = null;

      while ((match = regex.exec(value.value)) !== null) {
        result.push({
          name: match[0],
          column: value.loc.start.column + match.index,
        });
      }

      return result;
    }

    return createVisitors(context, {
      Attribute(node) {
        if (node.key.value.toLowerCase() !== "class") {
          return;
        }
        if (!node.value || !node.value.value) {
          return;
        }
        const classes = splitClass(node.value).reverse();
        const classSet = new Set();
        classes.forEach(({ name, column }) => {
          if (classSet.has(name)) {
            context.report({
              loc: {
                start: {
                  line: node.loc.start.line,
                  column: column,
                },
                end: {
                  line: node.loc.start.line,
                  column: column + name.length,
                },
              },
              data: {
                class: name,
              },
              messageId: MESSAGE_IDS.DUPLICATE_CLASS,
            });
          } else {
            classSet.add(name);
          }
        });
      },
    });
  },
};
