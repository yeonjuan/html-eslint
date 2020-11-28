// https://stylelint.io/user-guide/rules/regex
const KEBAB_CASE_REGEX = /^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/;
const SNAKE_CASE_REGEX = /^([a-z][a-z0-9]*)(_[a-z0-9]+)*$/;
const PASCAL_CASE_REGEX = /^[A-Z][a-zA-Z0-9]+$/;
const CAMEL_CASE_REGEX = /^[a-z][a-zA-Z0-9]+$/;

module.exports = {
  /**
   * Checks a given name follows `kebab-case` or not.
   * @param {string} name name to check
   * @returns {boolean} `true` if a name follows `kebab-case`, otherwise `false`.
   */
  isKebabCase(name) {
    return KEBAB_CASE_REGEX.test(name);
  },

  /**
   * Checks a given name follows `snake_case` or not.
   * @param {string} name name to check
   * @returns {boolean} `true` if a name follows `snake_case`, otherwise `false`.
   */
  isSnakeCase(name) {
    return SNAKE_CASE_REGEX.test(name);
  },

  /**
   * Checks a given name follows `PascalCase` or not.
   * @param {string} name name to check
   * @returns {boolean} `true` if a name follows `PascalCase`, otherwise `false`.
   */
  isPascalCase(name) {
    return PASCAL_CASE_REGEX.test(name);
  },

  /**
   * Checks a given name follows `camelCase` or not.
   * @param {string} name name to check
   * @returns {boolean} `true` if a name follows `camelCase`, otherwise `false`.
   */
  isCamelCase(name) {
    return CAMEL_CASE_REGEX.test(name);
  },
};
