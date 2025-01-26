/**
 * @template T
 * @template {T} S
 * @param {T[]} items
 * @param {(node: T) => node is S} predicate
 * @returns {S | undefined}
 */
function find(items, predicate) {
  return items.find(predicate);
}

/**
 * @template T
 * @template {T} S
 * @param {T[]} items
 * @param {(node: T) => node is S} predicate
 * @returns {S[]}
 */
function filter(items, predicate) {
  return items.filter(predicate);
}

module.exports = {
  find,
  filter,
};
