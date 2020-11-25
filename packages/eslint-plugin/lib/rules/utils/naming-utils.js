// https://stylelint.io/user-guide/rules/regex
const KEBAB_CASE_REGEX = /^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/;
const SNAKE_CASE_REGEX = /^([a-z][a-z0-9]*)(_[a-z0-9]+)*$/;
const PASCAL_CASE_REGEX = /^[A-Z][a-zA-Z0-9]+$/;
const CAMEL_CASE_REGEX = /^[a-z][a-zA-Z0-9]+$/;

module.exports = {
  /**
   * @param {string} name
   * @returns {boolean}
   */
  isKebabCase(name) {
    return KEBAB_CASE_REGEX.test(name);
  },

  /**
   * @param {string} name
   * @returns {boolean}
   */
  isSnakeCase(name) {
    return SNAKE_CASE_REGEX.test(name);
  },

  /**
   * @param {string} name
   * @returns {boolean}
   */
  isPascalCase(name) {
    return PASCAL_CASE_REGEX.test(name);
  },

  /**
   * @param {string} name
   * @returns {boolean}
   */
  isCamelCase(name) {
    return CAMEL_CASE_REGEX.test(name);
  },
};
