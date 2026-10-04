/**
 * @import {
 *   ElementAdapter,
 *   IdNamingConventionOptions,
 *   IdNamingConventionResult
 * } from "../types"
 */

import {
  isCamelCase,
  isSnakeCase,
  isPascalCase,
  isKebabCase,
} from "../utils/naming";

export const ID_NAMING_CONVENTIONS = {
  CAMEL_CASE: "camelCase",
  SNAKE_CASE: "snake_case",
  PASCAL_CASE: "PascalCase",
  KEBAB_CASE: "kebab-case",
  REGEX: "regex",
};

const CONVENTION_CHECKERS = {
  [ID_NAMING_CONVENTIONS.CAMEL_CASE]: isCamelCase,
  [ID_NAMING_CONVENTIONS.SNAKE_CASE]: isSnakeCase,
  [ID_NAMING_CONVENTIONS.PASCAL_CASE]: isPascalCase,
  [ID_NAMING_CONVENTIONS.KEBAB_CASE]: isKebabCase,
};

/**
 * @type {{
 *   wrong: "wrong";
 * }}
 */
export const ID_NAMING_CONVENTION_MESSAGE_IDS = {
  wrong: "wrong",
};

/** @param {IdNamingConventionOptions} options */
export function idNamingConvention(options) {
  const convention = options?.[0] ?? ID_NAMING_CONVENTIONS.SNAKE_CASE;
  const patternOption = options?.[1];

  const checkNaming =
    convention === ID_NAMING_CONVENTIONS.REGEX && patternOption
      ? (/** @type {string} */ name) =>
          new RegExp(patternOption.pattern, patternOption.flags || "").test(
            name
          )
      : CONVENTION_CHECKERS[convention];

  return {
    /**
     * @param {ElementAdapter} adapter
     * @returns {IdNamingConventionResult}
     */
    checkAttributes(adapter) {
      /** @type {IdNamingConventionResult} */
      const result = [];

      for (const attribute of adapter.getAttributes()) {
        const key = attribute.getKey();
        if (
          !key ||
          key.hasExpression() ||
          key.getValue().toLowerCase() !== "id"
        ) {
          continue;
        }

        const valueAdapter = attribute.getValue();
        if (!valueAdapter || valueAdapter.hasExpression()) {
          continue;
        }

        const idValue = valueAdapter.getValue();
        if (idValue === null || checkNaming(idValue)) {
          continue;
        }

        result.push({
          loc: attribute.getLocation(),
          messageId: ID_NAMING_CONVENTION_MESSAGE_IDS.wrong,
          data: { actual: idValue, convention },
        });
      }

      return result;
    },
  };
}
