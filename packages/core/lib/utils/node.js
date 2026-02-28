/**
 * @param {string} name Element name
 * @returns {boolean}
 */
export function isCustomElement(name) {
  return name.includes("-");
}
