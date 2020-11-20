/**
 * @typedef {import("../types").IEmitter} IEmitter
 * @typedef {import("../types").ITraverser} ITraverser
 */

class Traverser {
  /**
   * @param {IEmitter} emitter
   * @param {string[]} childrenKeys
   */
  constructor(emitter, childrenKeys) {
    this.emitter = emitter;
    this.childrenKeys = childrenKeys;
  }

  /**
   * @param {object} node
   * @param {object} [parent]
   */
  traverse(node, parent) {
    if (!node) {
      return;
    }

    this.emitter.emit("enter", node, parent);

    if (Array.isArray(this.childrenKeys)) {
      this.childrenKeys.forEach((key) => {
        if (Array.isArray(node[key])) {
          node[key].forEach((child) => this.traverse(child, node));
        }
      });
    }

    this.emitter.emit("exit", node, parent);
  }
}

/**
 * @param {IEmitter} emitter
 * @param {string[]} childrenKeys
 * @returns {ITraverser}
 */
module.exports = function createTraverser(emitter, childrenKeys) {
  return new Traverser(emitter, childrenKeys);
};
