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

/**
 * @template T
 * @param {T[]} items
 * @param {(itemA: T, itemB: T) => number} compare
 * @returns {T[]}
 */
function stableSort(items, compare) {
  return items
    .map((item, originalIndex) => ({ item, originalIndex }))
    .sort(
      (
        { item: itemA, originalIndex: originalIndexA },
        { item: itemB, originalIndex: originalIndexB }
      ) => {
        const result = compare(itemA, itemB);
        if (result === 0) {
          return originalIndexA - originalIndexB;
        }
        return result;
      }
    )
    .map(({ item }) => item);
}

module.exports = {
  find,
  filter,
  stableSort,
};
