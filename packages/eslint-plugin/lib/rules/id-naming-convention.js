/**
 * @typedef { import("@html-eslint/types").Tag } Tag
 * @typedef { import("@html-eslint/types").ScriptTag } ScriptTag
 * @typedef { import("@html-eslint/types").StyleTag } StyleTag
 *
 * @typedef {"camelCase" | "snake_case" | "PascalCase" | "kebab-case" | "regex"} Option1
 * @typedef {Object} Option2
 * @property {string} pattern
 * @property {string} [flags]
 *
 * @typedef { import("../types").RuleModule<[Option1, Option2]> } RuleModule
 */

const { RULE_CATEGORY } = require("../constants");
const {
  isCamelCase,
  isSnakeCase,
  isPascalCase,
  isKebabCase,
} = require("./utils/naming");
const { findAttr, isAttributesEmpty, hasTemplate } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");

const MESSAGE_IDS = {
  WRONG: "wrong",
};

const CONVENTIONS = {
  CAMEL_CASE: "camelCase",
  SNAKE_CASE: "snake_case",
  PASCAL_CASE: "PascalCase",
  KEBAB_CASE: "kebab-case",
  REGEX: "regex",
};

const CONVENTION_CHECKERS = {
  [CONVENTIONS.CAMEL_CASE]: isCamelCase,
  [CONVENTIONS.SNAKE_CASE]: isSnakeCase,
  [CONVENTIONS.PASCAL_CASE]: isPascalCase,
  [CONVENTIONS.KEBAB_CASE]: isKebabCase,
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforce consistent naming id attributes",
      category: RULE_CATEGORY.STYLE,
      recommended: false,
    },

    fixable: null,
    schema: [
      {
        enum: Object.values(CONVENTIONS),
      },
      {
        type: "object",
        properties: {
          pattern: { type: "string" },
          flags: { type: "string" },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [MESSAGE_IDS.WRONG]:
        "The id '{{actual}}' is not matched with the {{convention}}.",
    },
  },

  create(context) {
    const convention =
      context.options && context.options.length
        ? context.options[0]
        : CONVENTIONS.SNAKE_CASE;

    const checkNaming =
      convention === CONVENTIONS.REGEX
        ? (/** @type string */ name) =>
            new RegExp(
              context.options[1].pattern,
              context.options[1].flags || ""
            ).test(name)
        : CONVENTION_CHECKERS[convention];

    /**
     * @param {Tag | ScriptTag | StyleTag} node
     */
    function check(node) {
      if (isAttributesEmpty(node)) {
        return;
      }
      const idAttr = findAttr(node, "id");
      if (
        idAttr &&
        idAttr.value &&
        !hasTemplate(idAttr.value) &&
        !checkNaming(idAttr.value.value)
      ) {
        context.report({
          node: idAttr,
          data: {
            actual: idAttr.value.value,
            convention,
          },
          messageId: MESSAGE_IDS.WRONG,
        });
      }
    }

    /**
     * @param {Tag | ScriptTag | StyleTag} node
     */
    function checkInTemplate(node) {
      if (isAttributesEmpty(node)) {
        return;
      }
      const idAttr = findAttr(node, "id");
      if (
        idAttr &&
        idAttr.value &&
        !hasTemplate(idAttr.value) &&
        !checkNaming(idAttr.value.value)
      ) {
        context.report({
          node: idAttr,
          data: {
            actual: idAttr.value.value,
            convention,
          },
          messageId: MESSAGE_IDS.WRONG,
        });
      }
    }

    return createVisitors(
      context,
      {
        Tag: check,
        ScriptTag: check,
        StyleTag: check,
      },
      {
        Tag: checkInTemplate,
        ScriptTag: checkInTemplate,
        StyleTag: checkInTemplate,
      }
    );
  },
};
